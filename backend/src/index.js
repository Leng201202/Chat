import express from 'express';
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();
const app = express();
app.set('trust proxy', 1); // trust first proxy
const allowedOrigins=['https://chatkie.netlify.app','http://localhost:3000','http://localhost:5000'];

const corsOptions = {
    origin(origin,cb){
        if(!origin) return cb(null,true);
        const ok=allowedOrigins.some(o=>o instanceof RegExp ? o.test(origin) : o===origin);
        cb(ok ? null : new Error('Not allowed by CORS'),ok);
    },
    credentials:true,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization'] 
};

app.use(cors(corsOptions));
app.options('*',cors(corsOptions));


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