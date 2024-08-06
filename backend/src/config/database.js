const mongoose = require("mongoose");

async function database_connection(){

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

    try{

        await mongoose.connect("mongodb+srv://nakul:nakul123@cluster0.vjleu.mongodb.net/ScheduleDB" , options)
        
        console.log("Connected to the database")

    }catch(err){

        console.log(err.message)

        console.log("Unable to connect to the database")
    }
}

module.exports = {database_connection};