import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAIResponse from '../utils/openai.js';
 const router = new express.Router();

 router.post('/test',async(req,res)=>{
    try{
    const thread = new Thread({
        threadId:"thread-2",
        title:"Sample thread"
    });
    const response = await thread.save();
    res.send(response);
    }catch(err){    
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
 });
 //To get all threads
 router.get('/threads',async(req,res)=>{
    try{
        // we want most recent chats should appear at top hence we are sorting by updatedAt field
         const threads= await Thread.find({}).sort({updatedAt:-1});
         res.send(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Thread not found"});
    }
 });

//To get specific thread i.e. specific chat
router.get('/threads/:threadId',async(req,res)=>{
    const {threadId} = req.params;
    try{
          const thread = await Thread.findOne({threadId});
          if(!thread){
             res.status(404).json({error:"Thread not found"});
          }
         res.json(thread.messages);
    }catch(err){
         console.log(err);
        res.status(500).json({error:"Failed to fetch chat"});
    }
 });

//  To delete specific thread i.e. specific chat
router.delete('/thread/:threadId',async(req,res)=>{
    const {threadId}=req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
             res.status(404).json({error:"Thread not found"});
        }
        res.status(200).json({success:"Thread deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to delete chat"});
    }
});

router.post('/chat',async(req,res)=>{
    const {threadId,message}=req.body;
    //To validate threadId and message
    if(!threadId || !message){
        return res.status(400).json({error:"Thread ID and message are required"});
    }
    try{
     const thread= await Thread.findOne({threadId});
     if(!thread){
        // If threadId is not their in DBthen we will create new thread in DB and then push msg into it
        thread = new Thread({
            threadId,
            title:message,
            messages:[{role:"user",content:message}]    
        });
     }else{
        //If thread is allready their then we will just push msg to it
    thread.messages.push({role:"user",content:message});
     }


    const assistantResponse = await getOpenAIResponse(message);
    thread.messages.push({role:"assistant",content:assistantResponse});

    thread.updatedAt= new Date();
    // Storing the updated thread/new thread in DB
    await thread.save();
    // Sending reply to frontend
    res.json({reply: assistantResponse});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Something went wrong"});
    }
})


 export default router;