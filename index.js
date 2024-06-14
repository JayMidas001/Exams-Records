const express = require(`express`);
const mongoose = require(`mongoose`)
const dotenv = require(`dotenv`).config()
const app = express();
const PORT = process.env.port
app.use(express.json());
mongoose.connect(process.env.db).then(()=>{
    console.log(`Connection to DB is established successfully`);
    app.listen(PORT,()=>{
        console.log(`App is running on port:${PORT}`);
    })
}).catch((err)=>{
    console.log(`Unable to establish connection because: ${err}`);
})
const date = new Date()
app.get(`/`,(req,res)=>{
    try {
        res.status(200).json({message: `Welcome to Exams & Records`})
    } catch (e) {
       res.status(500).json(e.message) 
    }
})

//create a schema

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
    State:{type: String, required:[true,'Kindly enter your state']},
    Subjects:{type: Array, required:[true,'Kindly enter your subjects']},
    Scores:{type: Object, required:[true,'Kindly enter your state']},
    Total:{type: Number},
    IsPassed:{type: Boolean, default: function(){if (this.Total < 200) {
        return false
    } else {
        return true
    }} }
},{timestamps:true})

const scoreModel = mongoose.model(`Exams&Record`,scoreSchema)

//create new user
app.post(`/createuser`,async(req,res)=>{
    try {
        const {Firstname, Lastname, BirthYear, Sex, State, Subjects, Scores} = req.body;
    
            if (!(Subjects.includes(Object.keys(Scores)[0]) && 
            Subjects.includes(Object.keys(Scores)[1]) &&
            Subjects.includes(Object.keys(Scores)[2]) &&
            Subjects.includes(Object.keys(Scores)[3]))) {
            return res.status(400).json({message:`The scores does not match the subject provided.`})
            } else {
        const data = {
            Firstname,
            Lastname,
            BirthYear,
            Age: date.getFullYear() - BirthYear,
            Sex,
            State,
            Subjects,
            Scores,
            Total: Object.values(Scores).reduce((a,b)=> {return a+b})
          }
          if(data.Age<18){
            return res.status(400).json(`You are not eligible to register for this exam`)
          }
          const createUser = await scoreModel.create(data);
          res.status(201).json({ message: "New user created successfully.", createUser })};
    } catch (e) {
        res.status(500).json(e.message)
    }
})

//get all students
app.get(`/getallstudents`,async(req,res)=>{
    try {
    const getAll = await scoreModel.find()
    res.status(200).json({message: `Kindly find the ${getAll.length} registered students below:`,
    data: getAll})
    } catch (e) {
        res.status(500).json(e.message)
    }
})

//get one by id
app.get(`/getuser/:id`,async(req,res)=>{
    try {
     let ID = req.params.id
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
    const getOne = await scoreModel.findById(ID)
    if (!getOne) {
        return res.status(400).json(`User with ${ID} not found.`);
      } else {
    res.status(200).json({message: `Kindly find the student with ID: ${ID} below`,
foundUser: getOne})
      }
    } catch (e) {
        res.status(500).json(e.message)
    }
})

// get students by status
app.get(`/:status`,async(req,res)=>{
    try {
        let status = req.params.status.toLowerCase() === 'true'
    const getStatus = await scoreModel.find({IsPassed:status})
        if (status == true) {
            res.status(200).json({message: `Kindly find the ${getStatus.length} successful students below:`, getStatus})
        } else if(!status == true) {
            res.status(200).json({message: `Kindly find the ${getStatus.length} unsuccessful students below:`, getStatus})
        }
    } catch (e) {
        res.status(500).json(e.message)
    }

})

//update user scores by id
app.put(`/updateuser/:id`,async(req,res)=>{
    
    try {
        
        let ID = req.params.id
        let{yb,Subjects,Scores}=req.body
    let data={
        BirthYear:yb,
        Age:date.getFullYear() - yb,
        Subjects,
        Scores,
        Total:Object.values(Scores).reduce((a,b)=>{
            return a+b
        })
    }
    if(data.Total < 200){
        data.IsPassed=false
    }else{
        data.IsPassed=true
    }
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
    if (!(Subjects.includes(Object.keys(Scores)[0]) && 
    Subjects.includes(Object.keys(Scores)[1]) &&
    Subjects.includes(Object.keys(Scores)[2]) &&
    Subjects.includes(Object.keys(Scores)[3]))) {
    return res.status(400).json({message:`The scores does not match the subject provided.`})  
    }
    const updateUser = await scoreModel.findByIdAndUpdate(ID,data,{new:true})
    if(!updateUser){
        return res.status(400).json({message: `User with ID: ${ID} does not exist.`})
    }
    res.status(200).json({message: `${updateUser.Firstname} information has been successfully updated.`, data:updateUser})
    } catch (e) {
        res.status(500).json(e.message)
    }
})

//update user info
app.put(`/updateinfo/:id`,async(req,res)=>{
    let ID = req.params.id
    try {
        const {Firstname,Lastname,State,Sex}=req.body
        const userInfo = {Firstname,Lastname,State,Sex}

        if(userInfo.Sex!== "Male" && userInfo.Sex!=="Female"){
            return res.status(400).json({message:`Enter a valid sex`})
        }
        if(!mongoose.Types.ObjectId.isValid(ID)){
            return res.status(400).json({message:`Invalid ID format.`})
        }
        
        const updateInfo = await scoreModel.findByIdAndUpdate(ID, userInfo,{new:true})
        if(!updateInfo){
            return res.status(400).json({message: `User with ID: ${ID} does not exist.`})
        }
        res.status(200).json({message:`User info with ID: ${ID} has been successfully updated.`, data: updateInfo})
    } catch (e) {
        res.status(500).json(e.message)
    }
})