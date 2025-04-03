import mongoose from "mongoose";
import { type } from "node:os";

const todoSchema=new mongoose.Schema({
    task:{type:String,required:true},
    status:{type:Boolean,required:true,default:false}
});

export default mongoose.model("Todo",todoSchema)
