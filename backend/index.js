const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require('./models')
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

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