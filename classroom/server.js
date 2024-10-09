const express=require("express");
const app=express();
//const users=require("./routes/user.js");
//const posts=require("/.routes/post.js");
const session=require("express-session");


const sessionOptions=session({
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
});

app.use(session(sessionOptions));

app.get("/register",(req,res)=>{
    let {name}=req.query;
    res.send(name);
});

app.listen(8080,()=>{
    console.log("port is listening to the server")
});