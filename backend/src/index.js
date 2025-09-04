import express from 'express';
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true,
}));
// Middleware for parsing JSON and URL-encoded bodies with increased limits for base64 image uploads
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser()); 
const PORT = process.env.PORT || 8000;

// Routes
app.use('/api/auth', authRoute);
// NOTE: missing leading slash caused 404 for /api/messages/* endpoints
app.use('/api/messages', messageRoute);

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.listen(PORT,()=>{
    console.log('Server is running on port '+PORT);
    connectDB();
});