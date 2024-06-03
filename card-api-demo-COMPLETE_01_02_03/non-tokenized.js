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
  };
  return cardData;
}
function checkResponseCode(data) {
  console.log("Code: " + data?.data.code);
  if (data?.data.redirectHtml == "" || data?.data.redirectHtml == null) {
    console.log("otp page to be loaded");
    window.location.href = "/card-api-demo-COMPLETE_01_02_03/pages/otp.html";
  } else if (data?.data.redirectHtml !== "") {
    processCardDetails03(data?.data.redirectHtml);
  } else {
    return;
  }
}

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

    submitProcessCardDetails();
    this.reset(); // Reset form fields
  });
