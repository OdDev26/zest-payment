import {
  getFromLocalStorage,
  saveToLocalStorage,
  reverseExpiryDate,
} from "./script/utils.js";

console.log("non-tokenized.js called");

// Replace with the dev (sandbox) URL for testing
const url =
  "https://api-apps.vfdbank.systems/vtech-wallet/api/v1/baas-cards/initiate/payment";

// Non tokenized payment details
function cardDetails() {
  saveToLocalStorage("reference", document.getElementById("reference").value);
  console.log("Saved Reference: " + getFromLocalStorage("reference"));

  const cardData = {
    email: document.getElementById("email").value,
    amount: document.getElementById("amount").value,
    reference: document.getElementById("reference").value,
    cardNumber: document.getElementById("pan").value,
    cardPin: document.getElementById("pin").value,
    cvv2: document.getElementById("cvv2").value,
    shouldTokenize: true,
    useExistingCard: false,
    cvv2: document.getElementById("cvv2").value,
    expiryDate: document.getElementById("expiryDate").value,
    browserInformation: {
      browser: navigator.userAgent,
      threeDSecureChallengeWindowSize: "390_X_400", // Assuming this is a fixed value
      acceptHeaders:
        navigator.acceptHeader ||
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,ima ge/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
      colorDepth: screen.colorDepth,
      javaEnabled: navigator.javaEnabled(), // Deprecated and may not provide accurate information
      javaScriptEnabled: true, // Assuming JavaScript is enabled by default
      language: navigator.language,
      screenHeight: screen.height,
      screenWidth: screen.width,
      timeZone: new Date().getTimezoneOffset() / -60, // Convert timezone offset to hours
    },
  };
  return cardData;
}
function checkResponseCode(data) {
  console.log("Code: " + data?.data.code);
  if (data?.redirectHtml == "" || data?.redirectHtml == null) {
    console.log("otp page to be loaded");
    window.location.href = "/card-api-demo-COMPLETE_01_02_03/pages/otp.html";
  } else if (data?.redirectHtml !== "") {
    processCardDetails03(data?.redirectHtml);
  } else {
    return;
  }
}

const submitProcessCardDetails2 = () => {
  const payload = cardDetails();
  axios
    .post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        accesstoken:
          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzMiLCJ0b2tlbklkIjoiZWFkMTA0YmQtOGRiZS00NzI1LTk1YmItM2MyYTg4MmY5YzcxIiwiaWF0IjoxNzE3NTcxMDAzLCJleHAiOjQ4NzExNzEwMDN9.vOQ8CbIVuezTgTOUKHlddw2SjFQHk8MVmQykH0TK3lXcr038UEOEn_RaRxCqHli49ZyNeZo7xeiY5awgJ5u3Vw",
      },
    })
    .then(function (response) {
      console.log("Success message from VFD: " + response?.success);
      if (response?.success === true) {
        checkResponseCode(response?.data);
      } else {
        console.log("Error status: " + response?.success);
      }
    })
    .catch(function (error) {
      console.error("There was a problem with your fetch operation:", error);
    });
};
async function submitProcessCardDetails() {
  // POST Auth Payer

  // Data to be sent in the POST request (assuming JSON data)
  const payload = cardDetails();

  // Options for the fetch request
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify content type as JSON
      accesstoken:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzMiLCJ0b2tlbklkIjoiN2EwMTBmOGMtNTMxNy00NTdkLWFjMGUtNjQ0ZjcyZGQyMTljIiwiaWF0IjoxNzE2NTY1ODM1LCJleHAiOjQ4NzAxNjU4MzV9.-IaV1KhD2s_XGd21WxRc58FfGBfgltScP_OqXaYndjFZCGjnfFDBCsWQq3NL9pd7vvRv45EIm8aVQ6gT_QCbNg",
    },
    body: JSON.stringify(payload), // Convert data to JSON string
  };

  // Make the POST request using fetch
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response?.json(); // Parse response JSON
    })
    .then((data) => {
      // Handle response data
      if (data?.success === true) {
        console.log("Data from VFD: " + data?.data);
        checkResponseCode(data);
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with your fetch operation:", error);
    });
}

function processCardDetails03(redirectHtml) {
  console.log("processCardDetails03 called");
  // POST Auth Payer
  let newRedirectHtml = redirectHtml
    .replace("\n ", "")
    .replace("}", "")
    .replace("{", "");
  console.log("New redirectHtml: " + redirectHtml);
  document.write(redirectHtml);
}

document
  .getElementById("card-details-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    submitProcessCardDetails2();
    this.reset(); // Reset form fields
  });
