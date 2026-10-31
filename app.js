// Q1: Create a function that takes an array of numbers and returns a new array where each number is squared. Use map method.
{
  const squareAll = (arr) => arr.map((n) => n * n);
  console.log(squareAll([1, 2, 3, 4, 5]));
}

// Q2: Write a function that takes an array of objects with name and age properties. Filter out only the users whose age is greater than 18.
{
  const getAdults = (users) => users.filter((user) => user.age > 18);
  const users = [
    { name: "Ali", age: 17 },
    { name: "Sara", age: 22 },
    { name: "Ahmed", age: 18 },
    { name: "Zoya", age: 30 },
  ];
  console.log(getAdults(users));
}

// Q3: Given an array of products with price, use reduce to calculate the total price of all products.
{
  const products = [
    { name: "Keyboard", price: 1500 },
    { name: "Mouse", price: 700 },
    { name: "Monitor", price: 12000 },
  ];
  const total = products.reduce((sum, product) => sum + product.price, 0);
  console.log("Total price:", total);
}

// Q4: Create an array of students with marks. Sort the array in descending order based on marks.
{
  const students = [
    { name: "Ali", marks: 72 },
    { name: "Sara", marks: 91 },
    { name: "Ahmed", marks: 65 },
    { name: "Zoya", marks: 85 },
  ];
  const sorted = [...students].sort((a, b) => b.marks - a.marks);
  console.log(sorted);
}

// Q5: Write a function that takes an array of strings and finds the first string with length greater than 5 using find method.
{
  const findLongWord = (words) => words.find((word) => word.length > 5);
  console.log(findLongWord(["cat", "apple", "banana", "watermelon"]));
}

// Q6: Create an object named person with properties firstName, lastName and a method fullName that returns the full name using this keyword. Explain how this works in this context.
{
  const person = {
    firstName: "Ali",
    lastName: "Khan",
    fullName: function () {
      return this.firstName + " " + this.lastName;
    },
  };
  console.log(person.fullName());
  // Explanation: person.fullName() is called with the object before the dot,
  // so inside the method "this" points to that object (person).
  // That is why this.firstName is person.firstName and this.lastName is person.lastName.
}

// Q7: What will be the output of this code and why? Create an example to show the difference between regular function and arrow function when using this inside an object.
{
  const user = {
    name: "Sara",
    regularFn: function () {
      return this === user;
    },
    arrowFn: () => this === user,
    regularName: function () {
      return this.name;
    },
  };
  console.log("regular function, this === user:", user.regularFn()); // true
  console.log("arrow function, this === user:", user.arrowFn()); // false
  console.log("regular function name:", user.regularName()); // Sara
  // Why: a regular function gets its own "this" from the object that calls it (user).
  // An arrow function has no "this" of its own. It uses the "this" of the place where it was written
  // (the outer scope), not the object, so it can not read user.name.
}

// Q8: Write a function that takes an array of numbers, filters even numbers, then doubles them using map, and finally returns the sum of those doubled numbers using reduce. Do it in a chain.
{
  const sumOfDoubledEvens = (arr) =>
    arr
      .filter((n) => n % 2 === 0)
      .map((n) => n * 2)
      .reduce((sum, n) => sum + n, 0);
  console.log(sumOfDoubledEvens([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
}

// Q9: Create an array of employees with name, department and salary. Write code to: a) Find an employee who works in HR department b) Sort employees by salary in ascending order
{
  const employees = [
    { name: "Ali", department: "IT", salary: 60000 },
    { name: "Sara", department: "HR", salary: 45000 },
    { name: "Ahmed", department: "Sales", salary: 52000 },
    { name: "Zoya", department: "Finance", salary: 70000 },
  ];
  // a) find an HR employee
  const hrEmployee = employees.find((emp) => emp.department === "HR");
  console.log("HR employee:", hrEmployee);
  // b) sort by salary, ascending
  const bySalary = [...employees].sort((a, b) => a.salary - b.salary);
  console.log("Sorted by salary:", bySalary);
}

// Q10: Create a function that takes an object and returns an array of its keys and values separately, then create a new object from an array of key-value pairs. Use Object.keys, Object.values, and Object.fromEntries.
{
  const splitObject = (obj) => [Object.keys(obj), Object.values(obj)];
  const [keys, values] = splitObject({ name: "Ali", age: 20, city: "Lahore" });
  console.log("Keys:", keys);
  console.log("Values:", values);

  const pairs = [
    ["brand", "Toyota"],
    ["model", "Corolla"],
    ["year", 2022],
  ];
  const car = Object.fromEntries(pairs);
  console.log("New object:", car);
}
