import userModel from "@/model/User.models";
import conntedDB from "@/lib/dbConntect";
import { Message } from "@/model/User.models";
import { success } from "zod";

export async function POST(request: Request) {
  await conntedDB();
  try {
    const { username, content } = await request.json();
    const user = await userModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 },
      );
    }
    //is user accepting message
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user not accepting the message",
        },
        { status: 403 },
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("an unexpeted error occured", error);
    return Response.json(
      {
        success: false,
        message: "Internal sever error",
      },
      { status: 500 },
    );
  }
}
