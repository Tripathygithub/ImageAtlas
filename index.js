const express=require('express');
const app=express();
const port=process.env.port || 3000;
const cors=require('cors');
const sequelize = require('./models/index.js').sequelize;

app.use(express.json());
app.use(cors());
async function checkDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

checkDatabaseConnection();
//routes import
const userRoutes=require('./routes/route.js');

app.use('/api',userRoutes);


app.listen(port,()=>{
    console.log('server is running on port 3000');
});