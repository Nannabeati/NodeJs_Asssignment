const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "twitterClone.db");
let db = null;

const initDbAndServer = async (request, response) => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server running on http://localhost:3000`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initDbAndServer();

// Write a function in node that inserts the following data in mysql , the email should
// be unique and if the email already exists in the system then the name of the customer
// will be updated with the new name that is there in the array for that customer.

const customers = [
  {
    email: "anurag11@yopmail.com",
    name: "anurag",
  },
  {
    email: "sameer11@yopmail.com",
    name: "sameer",
  },
  {
    email: "ravi11@yopmail.com",
    name: "ravi",
  },
  {
    email: "akash11@yopmail.com",
    name: "akash",
  },
  {
    email: "anjalli11@yopmail.com",
    name: "angai",
  },
  {
    email: "santosh111@yopmail.com",
    name: "santosh",
  },
];

// Make a api for phone number login

// a. Make add Customer api for customer, assume admin is adding customer ..
// use the input params validation, code commenting, logging and check for
// duplicates where required .
// b. Use of transaction connection in mysql is good to have (not the requirement)

app.post("/addCustomer/", async (request, response) => {
  let customerDetails = request.body;
  let { name, email } = customerDetails;
  const addingCustomer = `
    INSERT INTO customers (name,email)
    VALUES (
        '${name}',
        '${email}'
    );
    `;
  const getDbResponse = await db.run(addingCustomer);

  const emailSearch = () => {
    return new Promise((resolve, reject) => {
      let itemList = customers.find((eachCode) => eachCode.email === email);
      if (itemList !== undefined) {
        if (itemList.name.includes(name)) {
          console.log("Email Found");
        } else {
          console.log("Item Not Found");
        }
      } else {
        reject("Category Not Found");
      }
    });
  };
  emailSearch()
    .then((fromResolve) => {
      console.log("Email Already Exits");
    })
    .catch((fromReject) => {
      console.log("Email Not Found");
      const customerId = getDbResponse.lastID;
      response.send({ customerId: customerId });
    });
});

// Refer to the tables below, Write a sql query for finding the subjects for each
// student, the subjects should be order by alphabetically .

app.get("/findSubject/:customerId/", async (request, response) => {
  const { customerId } = request.params;
  try {
    const getSubjectDetails = `
    SELECT Subjects.subjectName FROM 
    Subjects INNER JOIN Subject_student_mapping ON Subject_student_mapping.subjectId = Subjects.subjectId
    INNER JOIN customers ON Subject_student_mapping.customerId = customers.customerId 
    WHERE customers.customerId = ${customerId}
    ORDER BY Subjects.subjectName ASC;
    `;

    const subjectForEachStudent = await db.all(getSubjectDetails);
    response.send(subjectForEachStudent);
  } catch (e) {
    console.log(e);
  }
});

// Create a new object which have all the properties of object person and student

let person = {
  id: 1,
  gender: "male",
};
console.log(person);
console.log(person["id"]);
console.log(person.id);

let student = {
  name: "Ravi",
  email: "ravi11@yopmail.com",
};

console.log(student);

// Make a promisifed function for the functioan having callback below , after the
// function is promisifed then call the function like you call a promise

function getGogleHomePage() {
  let url = "https://www.google.com";
  let options = {
    method: "GET",
  };
  try {
    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonData) {
        let requestStatus = jsonData.code;
        console.log("statusCode:", requestStatus);
        let httpResponse = JSON.stringify(jsonData);
        console.log("body:", httpResponse);
      });
  } catch (e) {
    console.log("error:", e);
  }
}

// 6. Imagine you have array of integer from 1 to 100 , the numbers are randomly ordered
// , one number from 1 to 100 is missing , Please write the code for finding the missing
// number

function findMissing(arr, N) {
  let i;
  let temp = [];
  for (i = 0; i <= N; i++) {
    temp[i] = 0;
  }

  for (i = 0; i < N; i++) {
    temp[arr[i] - 1] = 1;
  }

  let ans = 0;
  for (i = 0; i <= N; i++) {
    if (temp[i] == 0) ans = i + 1;
  }
  console.log(ans);
}

let arr = [1, 2, 5, 6, 75, 85, 73, 100];
let n = arr.length;

findMissing(arr, n);

module.exports = app;
