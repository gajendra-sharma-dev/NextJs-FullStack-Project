import mongoose from "mongoose";
import { promise } from "zod";


type connectionObject = {
  isConnected?:number
}


const connection : connectionObject = {}


async function conntedDB(): Promise<void> {
 if(connection.isConnected) {
  console.log("already conncted to database");
  return
 }
  try {
   const db = await mongoose.connect(process.env.MONGODB_URL || 
      "",{}
    )
    console.log(db);
    console.log("connection",db.connections);
    
    
  } catch (error) {
    console.log("monngo db connection failed");
    process.exit(1)
  }
} 


export default  conntedDB