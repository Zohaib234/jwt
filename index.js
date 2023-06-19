 const express = require("express");

 const jwt = require("jsonwebtoken");

 const bcrypt = require('bcrypt');

 const app = express();


 app.use(express.json());

  const secretKey = "3031"
  const user = {
       
       name: "",
       email: "",
       password: ""
  } 


 app.post("/signup",(req,res)=>{

    const {name,email,password} = req.body;

    
    if(!name){
        res.status(400).send("please input complete data");
    }

    // ecncrypted password

    const pass = bcrypt.hash(password,10,(error,password)=>{
        if(error){
            console.log(error.message);
        }
        else{
            console.log(password);
        }
    })

    user.name = name;
    user.email = email;
    user.password=pass;

    const token = jwt.sign(user,secretKey,{expiresIn:'1hr'});

    res.json({token});

 })


 // login with the help of token 


 app.post('/login',authenticateToken,(req,res)=>{
     
    const user = req.user;
    res.json(user);
 })

 // verify token

 function authenticateToken(req,res,next) {
    
   const bearerHeader = req.headers['authorization'];
   const token = bearerHeader.split(' ')[1];
   if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  jwt.verify(token,secretKey,(error,user)=>{
    if(error){
        console.log(error.message);
    }
    req.user = user;
    next();
  })



 }

app.get('/',(req,res)=>{

   res.json({
    message: " a sample api"
   })

});








app.listen(3000,()=>{
    console.log(`server is running on port:3000`);
})