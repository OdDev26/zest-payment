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

async function initializeTransaction() {
  const payload = cardDetails();
  console.log("Card data: " + payload);

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
