import conntedDB from "@/lib/dbConntect";
import userModel from "@/model/User.models";
import {success, z} from "zod"
import {usernamevaildation} from "@/schema/signupSehema"


const UsernameQuerySchema = z.object({
  username:   usernamevaildation
})

export async function GET(request:Request) {
  
  await conntedDB() 
  try {

const {searchParams} = new URL(request.url)
  const queryParams =  {
    username:searchParams.get('username')
  }
 //vaildate with zod
 const result = UsernameQuerySchema.safeParse(queryParams)

console.log("result",result)


if(!result.success) {
  const usernameErrors = result.error.format().username?._errors || []
  return Response.json({
    success:false,
    message:usernameErrors?.length > 0
    ? usernameErrors.join(',') : "Invailed query parameter"
  },{
    status:400
  })
}

    const {username} = result.data
const existingUser = await userModel.findOne({username,isVerfied:true})

if(existingUser) {
  return Response.json({
    success:false,
    message:"Username is already taken"
  },{
    status:400
  })
}

 return Response.json({
    success:true,
    message:"Username is unique"
  },{
    status:400
  })


   } catch (error) {
    console.error("Error checking username",error)
    return Response.json({
      success:false,
      message:"Error checking username",

    },
    {
      status:500
    }
  )
    
  }
}