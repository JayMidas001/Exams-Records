const express = require(`express`);
const dotenv = require(`dotenv`).config()
const app = express();
const PORT = process.env.port
const mongoose = require(`mongoose`)
const router = require(`./router/userRouter`)
app.use(express.json());

app.use(router)

mongoose.connect(process.env.db).then(()=>{
    console.log(`Connection to DB is established successfully`);
    app.listen(PORT,()=>{
        console.log(`App is running on port:${PORT}`);
    })
}).catch((err)=>{
    console.log(`Unable to establish connection to DB because: ${err}`);
})