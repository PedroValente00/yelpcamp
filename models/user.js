const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose);

userSchema.post("save", (err,doc,next) =>{
    if(err.code === 11000 && err.keyValue.email){
        return next(new Error("This email address is already registered."))
    }
})

module.exports = mongoose.model("User", userSchema)
