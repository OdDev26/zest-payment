function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
};

function getFromLocalStorage(key) {
    const storedData = localStorage.getItem(key);
    if (storedData) {
        return JSON.parse(storedData);
    } else {
        return null; // Return null if the key does not exist in local storage
    }
};

function reverseExpiryDate(input) {
    const strInput = String(input);

    if (strInput.length !== 4) {
        throw new Error('Input must be a 4-digit number representing MMYY');
    }

    const MM = strInput.slice(0, 2);
    const YY = strInput.slice(2);

    return YY + MM;
};

export { getFromLocalStorage, saveToLocalStorage, reverseExpiryDate, };
