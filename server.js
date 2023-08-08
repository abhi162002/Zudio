import express from 'express';
import dotenv from 'dotenv';
import morgan from'morgan';
import authRoutes from'./routes/authRoute.js';
import connectDB from './config/db.js';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js';
import ProductRoute from './routes/ProductRoute.js';
import path from 'path';

//configure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "./client/build")))

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", ProductRoute);

//rest api
app.use('*', function(req, res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
});