// Entire JS is to create offline data management capability
let db;
const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  // Create an object store (also known as table)
  db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadTransaction();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// Save a record when there is no internet connection
function saveRecord(record) {
  const transaction = db.transaction(["new_transaction"], "readwrite");
  const transactionObjectStore = transaction.objectStore("new_transaction");

  // Add record to the object store
  transactionObjectStore.add(record);
}

function uploadTransaction() {
  const transaction = db.transaction(["new_transaction"], "readwrite");

  // Access the object store
  const transactionObjectStore = transaction.objectStore("new_transaction");

  // Ggt all records from the object store
  const getAll = transactionObjectStore.getAll();

  getAll.onsuccess = function () {
    // IF indexedDB has data, send to the API server
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["new_transaction"], "readwrite");
          const transactionObjectStore = transaction.objectStore(
            "new_transaction"
          );

          // Clear all items in the object store
          transactionObjectStore.clear();

          alert("All saved transaction has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// Listen for when internet connect is reestablished
window.addEventListener("online", uploadTransaction);