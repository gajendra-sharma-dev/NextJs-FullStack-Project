import { match } from "assert";
import mongoose,{Schema,Document} from "mongoose";
import { unique } from "next/dist/build/utils";

export interface Message extends Document {
    content : string,
    created_at: Date
}

const messageSchema : Schema<Message> = new Schema({

   content:{
    type:String,
   
   },

   created_at:{
    type:Date,
    required:true,
    default:Date.now
   }
})

export interface User extends Document {
    username:string,
    email:string,
    password:string,
    verfiyCode:string,
    verfiyCodeExpiry:Date,
    isVerfied:Boolean,
    isAcceptingMessage:Boolean,
    messages:Message[]
} 

const UserSchema = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
       trim:true,
       unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
      match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,'please use a vild email'],
     
    
    },
    verfiyCode:{  
        type:String,
        required:[true,"verfiyCode is required"],
       trim:true,
      
    },

      verfiyCodeExpiry:{
        type:Date,
        required:[true,"verify date expriy is required"]
      },
        isVerfied:{
        type:Boolean,
        default:false
      },

       isAcceptingMessage:{
        type:Boolean,
        default:false
      },
      
         messages:[messageSchema]

})


const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)


export default userModel