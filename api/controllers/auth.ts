require("dotenv").config()
import User from "../models/user"
import { Request, Response } from "express"
let db = require("../models")
let jwt = require("jsonwebtoken")
import express from "express"

// POST /auth/login (find and validate user; send token)
const router = express.Router()

router.post("/login", (req: Request, res: Response) => {
  console.log(req.body)
  // Find the user
  User.findOne({ email: req.body.email })
    .then((user: any) => {
      // Make sure the user exists and has a password
      if (!user || !user.password) {
        return res.status(404).send({ message: "User not found!" })
      }

      // Good - they exist. Now we check the password
      if (!user.isValidPassword(req.body.password)) {
        return res.status(401).send({ message: "Invalid credentials" })
      }

      // Good user - issue a token and send it
      let token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 8 // 8 hours in seconds
      })
      res.send({ token })
    })
    .catch(err => {
      console.log("Error in POST /auth/login", err)
      res.status(503).send({ message: "Database or server-side error" })
    })
})

// POST to /auth/signup (create user; generate token)
router.post("/signup", (req: Request, res: Response) => {
  console.log(req.body)
  // Look up the user (make sure they aren't a duplicate)
  User.findOne({ email: req.body.email })
    .then(user => {
      // If the user exists, do NOT let them create another account!
      if (user) {
        // Bad - this is signup, they shouldn't already exist
        return res.status(409).send({ message: "Email address in use!" })
      }

      // Good - the user doesn't exist :)
      User.create(req.body)
        .then(newUser => {
          // Cool - I have a user. Now I need to make them a token!
          let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 8 // 8 hours in seconds
          })

          // Send that token
          res.send({ token })
        })
        .catch(err => {
          console.log("Error when creating user", err)
          if (err.name === "ValidationError") {
            res.status(406).send({ message: "Validation error!" })
          } else {
            res.status(500).send({ message: "Error creating user" })
          }
        })
    })
    .catch(err => {
      console.log("Error in POST /auth/signup", err)
      res.status(503).send({ message: "Database or server error" })
    })
})

// NOTE: User should be logged in to access this route
router.get("/profile", (req: Request, res: Response) => {
  // The user is logged in, so req.user should have data!
  // TODO: Anything you want here!

  // NOTE: This is the user data from the time the token was issued
  // WARNING: If you update the user info those changes will not be reflected here
  // To avoid this, reissue a token when you update user data
  res.send({ message: "Secret message for logged in people ONLY!" })
})

module.exports = router
