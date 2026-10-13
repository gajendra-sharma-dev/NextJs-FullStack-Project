import conntedDB from "@/lib/dbConntect";
import bcrypt from "bcrypt"
import {sendEmailVerfiaction} from "../../../helper/sendEmailVerfication"
import userModel from "@/model/User.models";
import { json, success } from "zod";


export async function POST(request:Request) {
  await conntedDB()
  try {
  const reqBody =  await request.json()
  const {username,email,password} = reqBody

 const exitingUserandverfiyedByemail = await userModel.findOne({
    username,
    isVerfied:true
  })
    if(exitingUserandverfiyedByemail) {
      return Response.json({success:false,message:"user already exit"},{status:400})
    }

   const existingUser = await userModel.findOne({email})
   const otp = Math.floor(100000 + Math.random() * 900000).toString()

   if(existingUser) {
    if(existingUser.isVerfied) {
      return Response.json({success:false,message:"user already exist this email"},{status:400})
    }else{
      const hashPassword = await bcrypt.hash(password,10)
      existingUser.password = hashPassword
      existingUser.verfiyCode = otp
      existingUser.verfiyCodeExpiry = new Date(Date.now()+360000)
      await existingUser.save()
    }

   }else{
    const hashPassword = await bcrypt.hash(password,10) 
    const expriyDate = new Date()
    expriyDate.setHours(expriyDate.getHours() + 1)

  const newUser =  new userModel({
        username,
          email,
          password:hashPassword,
          verfiyCode:otp,
          verfiyCodeExpiry:expriyDate,
          isVerfied:false,
          isAcceptingMessage:true,
          messages:[]
    })

    await newUser.save()
   }

 const emailResponse =  await sendEmailVerfiaction(
    email,
    username,
    otp
   )

   console.log(emailResponse);

   if(!emailResponse.success) {
    return Response.json({success:false,message:emailResponse.message},{status:500})
   }

   
   return Response.json({success:true,message:"user registerd and verfiyed your email"},{status:201})
   






  } catch (error) {
    console.log("error while sign in",error);
    return Response.json({success:false,message:"failed when sign in"},{status:500})
  }
}