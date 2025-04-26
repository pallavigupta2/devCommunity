const mongoose = require("mongoose")

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://pallavigupta9804:0zR0odCnGkvPAeoC@nodelearning.spj1v.mongodb.net/devCommunity")
}

module.exports = connectDB