import { getFromLocalStorage } from "./script/utils.js";
console.log("tokenized-final.js called");

const transactionRef = getFromLocalStorage("reference");
const transactionCardId = getFromLocalStorage("cardId");
console.log("Reference: " + transactionRef);
console.log("cardId: " + transactionCardId);

// Replace with the dev (sandbox) URL for testing

// Non tokenized payment details
function cardDetails() {
  const cardData = {
    cardId: transactionCardId,
    reference: transactionRef,
  };
  return cardData;
}

export async function submitProcessCardDetails() {
  // POST Auth Payer
  const url =
    "https://api-apps.vfdbank.systems/vtech-wallet/api/v1/baas-cards/process-tokenized-card";
  // Data to be sent in the POST request (assuming JSON data)
  const payload = cardDetails();

  // Options for the fetch request
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify content type as JSON
      accesstoken:
        "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMTYiLCJ0b2tlbklkIjoiZTA0NGE0MjMtYjk2Yi00MmE0LWE4NGItNmUwN2Y4NjAzM2I0IiwiaWF0IjoxNzEyMjM1MDExLCJleHAiOjQ4NjU4MzUwMTF9.mlQ6TRz2PZubP2voBSHGO8775HWsB7MT-kon0iuNrbKGUqmnIK7hJ3GRZ0Fom432y81291PVRZuLjmpfqq7ZvA",
    },
    body: JSON.stringify(payload), // Convert data to JSON string
  };

  // Make the POST request using fetch
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        console.log("Api returned an error");
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

function checkResponseCode(data) {
  console.log("API response data: " + data?.data);
  window.location.href = "/card-api-demo-COMPLETE_01_02_03/pages/success.html";
}

function processCardDetails02(data) {
  const md = data?.data.md;
  const acsUrl = data?.data.acsUrl;
  const jwt = data?.data.jwt;
  const termUrl = data?.data.termUrl;

  document.write(
    `<body onload=\'form1.submit()\'><form id=\'form1\' action=${acsUrl} method=\'post\'><input name=\'JWT\' value=${jwt}><input name=\'MD\' value=${md}> </form></body>`
  );
}

function processCardDetails03(redirectHtml) {
  console.log("processCardDetails03 called");
  // POST Auth Payer
  document.write(redirectHtml);
}
