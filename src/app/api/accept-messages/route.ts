import { getServerSession } from "next-auth";

import conntedDB from "@/lib/dbConntect";
import userModel from "@/model/User.models";

import { User } from "next-auth";
import { authOpetions } from "../auth/[...nextauth]/options";
import { success } from "zod";

export async function POST(request: Request) {
  await conntedDB();
  const session = await getServerSession(authOpetions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        messaage: "not authenticated",
      },
      {
        status: 401,
      },
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedtedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true },
    );

    if (!updatedtedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        { status: 401 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "messaage acceptance status updated successfully",
        updatedtedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to update user status to accept messages");

    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await conntedDB();
  const session = await getServerSession(authOpetions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        messaage: "not authenticated",
      },
      {
        status: 401,
      },
    );
  }
  const userId = user._id;
  try {
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "User found successfully",
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("failed to update user status to accept messages");

    return Response.json(
      {
        success: false,
        message: "error is geeting message acceptance status",
      },
      { status: 500 },
    );
  }
}
