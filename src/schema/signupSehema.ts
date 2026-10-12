import {z} from "zod"


export const usernamevaildation = z
.string()
.min(2,"username must be two character")
.max(15,"username not more then 15 characters")
.regex(/^[a-zA-Z0-9_]+$/,"username must not be contain special character")


export const signupSchema = z.object({
    username:usernamevaildation,
    email:z.string().email({message:"Invaild email address"}),
    password:z.string().min(6,{message:"password must be grater then 6"})
})