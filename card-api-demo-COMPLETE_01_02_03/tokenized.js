import { saveToLocalStorage } from "./script/utils.js";

console.log("tokenized.js called");

const url =
  "https://api-apps.vfdbank.systems/vtech-wallet/api/v1/baas-cards/initiate/payment";

function cardDetails() {
  saveToLocalStorage("reference", document.getElementById("reference").value);
  const cardData = {
    email: document.getElementById("email").value,
    amount: document.getElementById("amount").value,
    reference: document.getElementById("reference").value,
    useExistingCard: true,
  };
  return cardData;
}
const initializeTransaction = () => {
  const payload = cardDetails();
  axios
    .post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        accesstoken:
          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzMiLCJ0b2tlbklkIjoiNzU1ZGE0ZjAtNDQ1Mi00MzM3LWEwYjMtODAzNzdhNmZiMWY5IiwiaWF0IjoxNzE3Njc2MjYyLCJleHAiOjQ4NzEyNzYyNjJ9.fGHwAGrbFNP4ENUK9R7iK7-dtQEh8jp_uF4b5iFtZys7RUxI_wXBDV6UicjbG8-5-W--auF1ktsU7xQ_1ZRbQA",
      },
    })
    .then(function (response) {
      if (response.data?.success === true) {
        processTokenizedCard(response.data?.data[0].cardId);
      }
    })
    .catch(function (error) {
      console.error("There was a problem with your fetch operation:", error);
    });
};

async function initializeTransaction2() {
  const payload = cardDetails();
  console.log("Card data: " + payload);

  // Options for the fetch request
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify content type as JSON
      accesstoken:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzMiLCJ0b2tlbklkIjoiNjUwMjQyMjYtZTg4ZS00YjFhLTllMWEtYTRmNmNiY2VmMWY5IiwiaWF0IjoxNzE3NDE1OTI5LCJleHAiOjQ4NzEwMTU5Mjl9.07U6Gd8lMeUmNGX17ZntnTfCR4KGKvPvCDjY8W_eqlIr8v13dvkmjXHoGwFM8ILtZ2NT2c-b9LXmsCyOh0sFOw",
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
        processTokenizedCard(data?.data[0].cardId);
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with your fetch operation:", error);
    });
}

function processTokenizedCard(cardId) {
  saveToLocalStorage("cardId", cardId);
  import("./tokenized-final.js")
    .then((module) => {
      console.log("tokenized-final.js loaded");
      module.submitProcessCardDetails();
    })
    .catch((err) => {
      console.error("Error loading tokenized-final.js", err);
    });
}

document
  .getElementById("card-details-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    initializeTransaction();
    // saveFormDataToLocalStorage();
    this.reset(); // Reset form fields
  });
