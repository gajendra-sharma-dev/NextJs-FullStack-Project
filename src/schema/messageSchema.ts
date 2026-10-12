import {z} from "zod"


export const messageSchema = z.object({
    content : z.string().min(10,{message:"content must be contain atleast 10 character"}).max(300,{message:"content must be under 300  character"})
})