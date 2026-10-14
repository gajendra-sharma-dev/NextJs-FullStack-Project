import NextAuth from "next-auth";
import { authOpetions } from "./options"


const handler  = NextAuth(authOpetions)


export {handler as GET, handler as POST}