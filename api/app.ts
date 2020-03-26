import cors from "cors"
import express, { Request, Response } from "express"
import morgan from "morgan"
import path from "path"
import connectDB from "./models"
import router from "./routes"

// Instantiate app
let app = express()

// Set up middleware
app.use(morgan("dev"))
app.use(cors())
app.use(express.urlencoded({ extended: false })) // Accept form data
app.use(express.static(path.join(__dirname, "client/build")))
app.use(express.json()) // Accept data from fetch (or any AJAX call)

// Initiate DB
connectDB()

// Routes
app.use("/", router)

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
})

app.listen(process.env.PORT, () => {
  console.log(`node running`)
})
