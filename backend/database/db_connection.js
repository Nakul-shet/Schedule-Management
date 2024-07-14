const mongoose = require("mongoose");

const db_connection = async () => {

    try{

         await mongoose.connect(process.env.MONGODB_CONNECTION)
         .then(() => {
            console.log("Connceted to the database")
         })
         .catch((err) => {
            console.log(`Unable to conncet to the database ${err.message}`)
         })

    }catch(err){

        console.log(err)

    }
}

module.exports = {db_connection};