const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
const { sequelize } = require('./models')
const authRoute = require('./routes/auth.route')
const cookie = require('cookie-parser');
const PORT = process.env.PORT || 8000;

//Default required Middlewares
app.use(express.json());
app.use(cors());
app.use(cookie());

//Routes
app.use('/api/v1/auth',authRoute)



async function connectDb(){
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully to the database.");
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
}
app.listen(PORT, async () => {
    await connectDb();
    console.log(`Server running on port: ${PORT}`);
})