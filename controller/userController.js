const scoreModel = require(`../model/userModel`)
const date = new Date()
const axios = require(`axios`)


const createUser = async (req, res) => {
    try {
        // Get the user's location data
        const locationOptions = {
            url: `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.locationKey}`,
            method: "GET"
        };
        const locationResponse = await axios.request(locationOptions);
        const locationData = locationResponse.data;
        const getWeather = async (lat, lon) => {
            try {
                const options = {
                    url: `http://api.weatherapi.com/v1/current.json?key=${process.env.weatherKey}&q=${lat},${lon}`,
                    method: "GET"
                };
                const response = await axios.request(options);
                return response.data;
            } catch (e) {
                ("Error fetching weather data");
            }
        };
        //Get the weather data using the latitude and longitude from the location data
        const weatherData = await getWeather(locationData.latitude, locationData.longitude);
      
        const { Firstname, Lastname, BirthYear, Sex, Subjects, Scores } = req.body;

        // Validate Subjects and Scores
        if (!(Subjects.includes(Object.keys(Scores)[0]) && 
              Subjects.includes(Object.keys(Scores)[1]) &&
              Subjects.includes(Object.keys(Scores)[2]) &&
              Subjects.includes(Object.keys(Scores)[3]))) {
            return res.status(400).json({ message: "The scores do not match the subjects provided." });
        }

        
        const data = {
            Firstname,
            Lastname,
            BirthYear,
            Age: date.getFullYear() - BirthYear,
            Sex,
            Subjects,
            Scores,
            Total: Object.values(Scores).reduce((a, b) => a + b),
            Country: locationData.country_name,
            CallingCode: locationData.calling_code,
            State: locationData.state_prov,
            IpAddress: locationData.ip,
            CurrentWeather: weatherData.current.condition.text,
            TemperatureReading: weatherData.current.temp_c,
        };
        
        if (data.Age < 18) {
            return res.status(400).json("You are not eligible to register for this exam");
        }

        const createUser = await scoreModel.create(data);
        res.status(201).json({ message: "New user created successfully.", createUser });
    } catch (e) {
        res.status(500).json(e.message);
    }
};

const getAll = async(req,res)=>{
    try {
            const getAll = await scoreModel.find()
            res.status(200).json({message: `Kindly find the ${getAll.length} registered students below:`,
            data: getAll})
            } catch (e) {
                res.status(500).json(e.message)
            }
}

const getOne = async(req,res)=>{
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
}

const getStatus = async(req,res)=>{
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
        
}

const updateScore = async(req,res)=>{
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

}

const updateInfo = async(req,res)=>{
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
}

//create a function to get user's location

const getUserLocation = async(req,res)=>{
    try {
        const options ={
            url:`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.locationKey}`,
            method: "GET"
        }
    const response = await axios.request(options)
    
    res.status(200).json(response.data)
    } catch (e) {
        res.status(500).json(e.message)
    }
}

//create a function to get user's weather condition
const getWeather = async(req,res)=>{
    try {
        const locationOptions = {
            url: `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.locationKey}`,
            method: "GET"
        };
        const locationResponse = await axios.request(locationOptions);
        const options = {
            url: `http://api.weatherapi.com/v1/current.json?key=${process.env.weatherKey}&q=${locationResponse.data.latitude},${locationResponse.data.longitude}`,
            method: "GET"
        };
    const response = await axios.request(options)
    
    res.status(200).json(response.data)
    } catch (e) {
        res.status(500).json(e.message)
    }
}

module.exports = {createUser,getAll,getOne,getStatus,updateScore,updateInfo,getUserLocation,getWeather}