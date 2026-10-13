import { resend } from "../lib/resend"
import VerificationEmail from "../../email/verficationTemplate"

import { ApiResponse } from "@/types/ApiResponse"
import { success } from "zod";

export async function sendEmailVerfiaction(
  email:string,
  username:string,
  otp:string
):Promise<ApiResponse> {
  try {
     const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Verfiaction code',
      react: VerificationEmail({username,otp})

     })
       return {success : true,message:"verfication code send successfully"}
  } catch (error) {
    console.log("failed when email sending");
    return {success : false , message :"failed to send email verfiaction code"}
    
  }
}