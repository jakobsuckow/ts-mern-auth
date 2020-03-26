import { NextFunction } from "express"
import mongoose from "mongoose"
import bcrypt from 'bcryptjs'


let dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  breed: String,
  age: Number
})

let userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1
  },
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100
  },
  dogs: [dogSchema]
})

// Use bcrypt to hash password
userSchema.pre("save", function(next: NextFunction) {
  //@ts-ignore
  if (this.isNew) {
    //@ts-ignore
    this.password = bcrypt.hashSync(this.password, 12)
  }

  next()
})

// Ensure that password doesn't get sent with the rest of the data
userSchema.set("toJSON", {
  transform: (doc: any, user: any) => {
    delete user.password
    delete user.__v
    return user
  }
})

// Create a helper function to compare the password hashes
userSchema.methods.isValidPassword = function(typedPassword: any) {
  return bcrypt.compareSync(typedPassword, this.password)
}

const User = mongoose.model("User", userSchema)
export default User
