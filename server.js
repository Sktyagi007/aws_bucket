require('dotenv/config');
const express = require("express");
const multer = require("multer")
const AWS = require("aws-sdk");
const {v4 : uuidv4} = require("uuid");


const app = express();
const port = 3000;

// app.use(express.static("D:\disney\index.html"));

const s3 = new AWS.S3({
    accessKeyId:process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRETKEY

})

const storage = multer.memoryStorage({
    destination : function(req,res,callback){
        callback(null,'');
    }
})

const upload = multer({storage}).single('file');

app.post("/upload",upload,function (req,res){
    let myfile = req.file.originalname.split(".");
    let extention = myfile[myfile.length-1];

    const obj = {
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:`${uuidv4()}.${extention}`,
        Body: req.file.buffer
    } 

    // console.log(req.file);
    // res.send({
    //     message: "hello"
    // })

    s3.upload(obj,(error,data)=>{
        if(error){
            res.status(500).send(error);
        }else{
            res.status(200).send(data);
        }
    })
})

app.get("/",function (req,res){
    res.sendFile(__dirname +"/index.html");
})


app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})

