import express from 'express';
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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

// Enable CORS with configured options
app.use(cors(corsOptions));


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

// Health check endpoint to verify database connection
app.get('/health', async (req, res) => {
    try {
        // Check if mongoose is connected
        if (mongoose.connection.readyState === 1) {
            return res.status(200).json({ 
                status: 'ok',
                message: 'Database connection is healthy',
                dbHost: mongoose.connection.host
            });
        } else {
            return res.status(500).json({ 
                status: 'error',
                message: 'Database connection is not established',
                readyState: mongoose.connection.readyState
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            status: 'error',
            message: 'Error checking database connection',
            error: error.message
        });
    }
});

// Start server after attempting database connection
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        // Retry connection after delay in development
        if (process.env.NODE_ENV !== 'production') {
            console.log('Retrying database connection in 5 seconds...');
            setTimeout(startServer, 5000);
        }
    }
};

startServer();