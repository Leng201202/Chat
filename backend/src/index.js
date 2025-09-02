import express from 'express';
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
const PORT = process.env.PORT || 8000;

// Routes
app.use('/api/auth', authRoute);
app.use('api/messages',messageRoute);

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.listen(PORT,()=>{
    console.log('Server is running on port '+PORT);
    connectDB();
});