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

module.exports = {validateSignupData}
