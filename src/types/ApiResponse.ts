import { boolean, success } from "zod";
import { Message } from "@/model/User.models";
export interface ApiResponse  {
  success : boolean
  message : String
 isAcceptingMessage?:boolean
 messages?: Array<Message>

}