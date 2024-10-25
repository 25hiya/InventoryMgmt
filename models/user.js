const mongoose = require("mongoose");
const {Schema} = mongoose;
const bcrypt = require("bcrypt")
//const passportLocalMongoose = require("passport-local-mongoose")

const UserSchema = new Schema({
    email: {
        type: String, 
        required:true
    },

    username: {
        type: String, 
        required: true
    },

    password: {
        type: String, 
        required: true
    }
})
//UserSchema.plugin(passportLocalMongoose); //creates a field for username and password automatically

UserSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

UserSchema.pre("save",  async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model("User", UserSchema)