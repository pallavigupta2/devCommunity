const jwt = require("jsonwebtoken");
const userModal = require("../modals/user");

const userAuth = async (req, res, next) => {
  try {
    // Reading the cookies
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Please Login")
    }

    // Validating the token
    const decodedData = await jwt.verify(token, process.env.JWT_TOKEN);
    const { _id } = decodedData;

    // Getting the user data.
    const userData = await userModal.findById(_id);
    if(!userData){
        throw new Error("User does not exist!..");
        
    }
    req.userData = userData;
    next();
  } catch(err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = {userAuth}
