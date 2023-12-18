const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, "Your email address is required"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Your username is required"],
    },
    password: {
      type: String,
      required: [true, "Your password is required"],
    },
    role: {
        type: mongoose.Types.ObjectId, 
        ref: 'Role',
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  });


// Use instance.save() when modifying a user's password
// to trigger this pre-hook
UserSchema.pre(
'save',
async function (next) {
    const user = this;
    // If password wasn't changed to plaintext, skip to next function.
    if (!user.isModified('password')) return next();
    // If password was changed, assume it was changed to plaintext and hash it.
    const hash = await bcrypt.hash(this.password, 10);
    // console.log("hashing again")
    this.password = hash;
    next();
}
);

const User = mongoose.model('User', UserSchema);

module.exports = {User};