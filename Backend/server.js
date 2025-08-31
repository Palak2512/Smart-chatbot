//Using npm module open
// import OpenAI from 'openai';
// import 'dotenv/config';
// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, 
// });

// const response = await client.responses.create({
//   model: 'gpt-4o-mini',
//   input: 'Difference between SQL and NoSQL databases',
// });

// console.log(response.output_text);

import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
const app = express();
const PORT = 8080;
 app.use(cors());
 app.use(express.json());
 app.use('/api', chatRoutes);

 app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
 });
const connectDB = async()=>{  
   try{
       await mongoose.connect(process.env.MONGODB_URI);
       console.log("Connected with database!!");
   }catch(err){
       console.log("Failed to connect with database", err);
   }
}
