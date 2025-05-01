const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const { validateProfileEditData } = require("../utils/validation");
const userModal = require("../modals/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const userData = req.userData;
    res.send(userData);
  } catch (err) {
    res.status(400).send("Cannot get profile data : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // Validate data which user sent for update

    validateProfileEditData(req);
    const loggedInUser = req.userData;
    const { firstName, lastName, skills, age, gender, aboutUs, photoUrl } =
      req.body;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile is updated succesfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Some error occured while updating " + err.message);
  }
});

profileRouter.patch("/profile/resetpassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userInfo = req.userData;
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      userInfo.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Existing passwod is incorrect");
    } else if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter strong password.");
    } else if (newPassword !== confirmPassword) {
      throw new Error("New Passworda and Confirm Password does not matchs.");
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    userInfo.password = encryptedPassword;
    await userInfo.save();
    res.send("Password updated succesfully.");
  } catch (err) {
    res.status(400).send("Error while changing the password : " + err.message);
  }
});
module.exports = profileRouter;
