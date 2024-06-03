import { API_PUBLIC_KEY } from "./private/userData.js";
import { getFromLocalStorage } from "./script/utils.js";

const transactionRef = getFromLocalStorage("reference");
console.log("Reference from local storage: " + transactionRef);

// Replace with the dev (sandbox) URL for testing
const url =
  "https://api-devapps.vfdbank.systems/vtech-wallet/api/v1/baas-cards/validate-otp";

function processCardDetails01() {
  // POST Auth Payer
  const payload = {
    reference: transactionRef,
    otp: document.getElementById("otp").value,
  };

  // Options for the fetch request
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify content type as JSON
      "Api-Public-Key": API_PUBLIC_KEY,
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
      if (data?.data.code === "00");
      {
        window.location.href =
          "/card-api-demo-COMPLETE_01_02_03/pages/success.html";
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with your fetch operation:", error);
    });
}

document
  .getElementById("enter-otp")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    processCardDetails01();
    this.reset(); // Reset form fields
  });
