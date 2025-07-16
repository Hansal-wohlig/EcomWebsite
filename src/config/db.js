const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true
        })
        console.log("Mongodb connected successfully")
    }catch(err){
        console.log('Mongodb connnection failes', err.message)
        process.exit(1)
    }
}

module.exports = connectDB