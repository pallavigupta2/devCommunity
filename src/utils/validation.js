const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password, skills } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter firstname and lastname.");
  } else if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
    throw new Error("Please enter alphabets only.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter correct email.");
  } else if (skills?.length > 10) {
    throw new Error("You should not allowed to enter more than 10 skills!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter strong password.");
  }
};

const validateProfileEditData = (req) => {
  
  const { firstName, lastName, skills, age, gender, aboutUs, photoUrl } =
    req.body;
  const allowedFieldsForEdit = [
    "firstName",
    "lastName",
    "skills",
    "age",
    "gender",
    "aboutUs",
    "photoUrl",
  ];
  const isAllowedForEdit = Object.keys(req.body).every((field) =>
    allowedFieldsForEdit.includes(field)
  );
  if (!isAllowedForEdit) {
    throw new Error("Not allowed to edit.");
  } else if (skills?.length > 10) {
    throw new Error("You should not allowed to enter more than 10 skills!");
  } else if (aboutUs?.length > 200) {
    throw new Error("Enter about yourself in 100 characters only.");
  }
};

module.exports = { validateSignupData, validateProfileEditData };
