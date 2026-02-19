const express = require("express");
const cors = require("cors");
const session = require("express-session");
const db = require("./config/db");
const connection = require("./dbConnection");

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({
    secret:'student',
    resave:false,
    saveUninitialized:false
}));
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("uploads/images"));

// Initialize database - add photo column to users table if it doesn't exist
db.query("ALTER TABLE users ADD COLUMN photo VARCHAR(255) DEFAULT NULL", (err, result) => {
  if (err) {
    console.log("Photo column may already exist or table issue:", err.message);
  } else {
    console.log("Photo column added to users table");
  }
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api", require("./routes/uploads"));
app.use("/farmers", require("./routes/farmers"));

// Legacy endpoints for compatibility with app.js
app.post('/create_account',(req,res) => {
    const {username}=req.body;
    connection.query('select * from users where username=?',[username],(err,results)=>{
if(err){
    console.error('query error',err);
}
else if(results.length>0){
    res.json({msg:' already exist! try another!'});
}
else{
    const {username,password}=req.body;
connection.query('insert into users (username,password) values(?,?)',[username,password],(err,results)=>{
if(err){
    console.error('queryerror',err);

}   
else{
    res.json({msg:'welcome! your account created succesfuly!'});
}
});
}
    });
});

app.post('/login',(req,res) => {
    const {password}=req.body;

    connection.query("select * from  users where password=?",[password],(err,results)=>{
        if(err){
            console.error('query error',err);
        }
        else if(results.length === 0){
            res.json('account not found');
        }
   else{ 
    const users=results[0];
    if(users.password === password){
        res.json({msg:'welcome! to your account!'});
    }
    
}

});
});

app.put("/forgot_password",(req,res) => {
        const {username}=req.body;
 
    connection.query("select * from  users where username=?",[username],(err,results)=>{
        if(err){
            console.error('query error',err);
        }
        else if(results.length === 0){
            res.json('account not found');
        }
        else{
            const {username,password}=req.body;

            connection.query("update users set password=? where username=?",[password,username],(err,results)=>{
                if(err){
                    console.error('update is error',err);
                }
                else{
                    res.json({msg:' is arlead updated!'});
    
                }
            });
        }
       
    });
});

app.get('/users',(req,res)=>{
    connection.query("select* from users",(err,results)=>{
        if(err) console.error(err);
        return res.json(results);

    });
});

app.delete('/delete/:id',(req,res)=>{
    const {id} = req.params;
    connection.query('delete from users where id=?',[id],(err,result)=>{
        if(err) throw err;
        else{
            res.json({message:'deleted succseful!'})
        }
    });
});

app.listen(5000, () => {
  console.log("FarmerJoin backend running on port 5000");
});
