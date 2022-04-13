const mongoose = require("mongoose");

if (
  process.argv.length < 3 ||
  (process.argv.length > 3 && process.argv.length < 5)
) {
  console.log(`Please use: node mongo.js password name number`);
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.r6sdk.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url).catch((err) => console.error(err));

mongoose.connection.on("error", (err) => {
  console.err(err);
});

const PersonSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", PersonSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
    process.exit(0);
  });
} else {
  person
    .save()
    .then((result) => {
      console.log(`added ${result.name} to phonebook`);
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error(err);
    });
}
