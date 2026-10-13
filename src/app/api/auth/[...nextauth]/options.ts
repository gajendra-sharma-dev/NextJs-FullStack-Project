import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import userModel from "@/model/User.models";
import conntedDB from "@/lib/dbConntect";

export const authOpetions : NextAuthOptions = {
  providers:[
     CredentialsProvider({
      id:"credentials",
      name:"Credentials",
      credentials : {
        username: { label: "Username", type: "text ", placeholder: "jsmith" },
      password: { label: "Password", type: "password" },
      },
       async authorize( credentials :any):Promise<any> {
            await conntedDB()

            try {
        const user =  await userModel.findOne({$or:[{email:credentials.identifier},{username:credentials.identifier}]})

          if(!user) {
          throw new Error("no user found this email")
          }

          if(user.isVerfied) {
             throw new Error("email verfied first")
          }
  const isPasswordCorrect =   await bcrypt.compare(credentials.password,user.password)

  if(isPasswordCorrect) {
       return user                       
  }else{
      throw new Error("incorrect password")
    
  }
            } catch (error:any) {
              throw new Error(error)
            }

            
       }
      
     })
  ],
  callbacks:{
     async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    }
  },
  pages:{
    signIn : '/sign-In'
  },
  session : {
    strategy:'jwt'
  },
  secret:process.env.NEXT_AUTH_SECRET
}