import {z} from "zod"


export const verfiySchema = z.object({
    code:z.string().length(6,{message:"verfication code must be  6 degit"})
})