import express from "express"
import expressJwt from "express-jwt"

require("dotenv").config()

const router = express.Router()

router.use(
  "/auth",
  expressJwt({
    //@ts-ignore
    secret: process.env.JWT_SECRET
  }).unless({
    path: [
      { url: "/auth/login", methods: ["POST"] },
      { url: "/auth/signup", methods: ["POST"] }
    ]
  }),
  require("../controllers/auth")
)

router.use(
  "/dogs",
  //@ts-ignore
  expressJwt({ secret: process.env.JWT_SECRET }),
  require("../controllers/dogs")
)

export default router
