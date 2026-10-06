const { Schema, model } = require("mongoose")

const User = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    agree: {type: Boolean, required: true},
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
})

module.exports = model ('User', User)



