const mongoose = require(`mongoose`)
const scoreSchema = new mongoose.Schema({
    Firstname:{type:String,set: (entry) => {
        const capitalize =
        entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase();
          return capitalize;},required:[true,'Kindly enter your first name']},
    Lastname:{type:String,set: (entry) => {
        const capitalize =
        entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase();
          return capitalize;},required:[true,'Kindly enter your last name']},
    BirthYear:{type:Number, required:[true,'Kindly enter your birth year']},
    Age:{type:Number},
    Sex:{type: String,
        set: (entry) => {
        const capitalize =
        entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase();
          return capitalize;},
        enum: ["Male", "Female"],
        required: true,
      },
    Subjects:{type: Array, required:[true,'Kindly enter your subjects']},
    Scores:{type: Object, required:[true,'Kindly enter your state']},
    Country:{type:String},
    CallingCode:{type:String},
    State:{type: String},
    IpAddress:{type:String},
    CurrentWeather:{type:String},
    TemperatureReading:{type:String},
    Total:{type: Number},
    IsPassed:{type: Boolean, default: function(){if (this.Total < 200) {
        return false
    } else {
        return true
    }} }
},{timestamps:true})

const scoreModel = mongoose.model(`Exams&Record`,scoreSchema)

module.exports = scoreModel