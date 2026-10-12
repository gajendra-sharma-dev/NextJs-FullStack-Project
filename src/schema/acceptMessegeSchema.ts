import {z} from "zod"


export const acceptingMessage = z.object({
    isAcceptingMessage:z.boolean()
})