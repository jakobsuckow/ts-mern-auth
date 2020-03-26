import mongoose from "mongoose"

const uri: string = `mongodb://127.0.0.1:27017/local`

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`Connected to db`)
  } catch (err) {
    console.log(err)
  }
}

export default connectDB
