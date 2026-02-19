const connection=require('./dbConnection.js');
const express= require ('express');
const cors=require('cors');
const path = require('path');
const uploadRoutes = require('./routes/uploads');
const productRoutes = require('./routes/products');
const farmerRoutes = require('./routes/farmers');
const app=express();
const port=4000;
app.use(express.json());
app.use(cors())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use upload routes
app.use('/api', uploadRoutes);

// Use product and farmer routes
app.use('/products', productRoutes);
app.use('/farmers', farmerRoutes);

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
//post method
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
app.delete('/delete/:id',(req,results)=>{
    connection.query('delete from users where id=?',[id],(err,result)=>{
        if(err) throw err;
        else{
            res.json({message:'deleted succseful!'})
        }
    });
});



app.use((req,res)=>{
    res.status(404).json({ error:'invalid API'});
});
app.listen(port,()=>{
    console.log(`server runing on port${port}`);
});

 