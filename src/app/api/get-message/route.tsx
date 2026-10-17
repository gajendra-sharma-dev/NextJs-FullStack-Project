import { getServerSession } from "next-auth";
import { authOpetions } from "../auth/[...nextauth]/options";
import conntedDB from "@/lib/dbConntect";
import userModel from "@/model/User.models";
import { User } from "next-auth";

import mongoose from "mongoose";

export async function GET(request: Request) {
  await conntedDB();
  const session = await getServerSession(authOpetions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await userModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
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
        messages: user[0].messages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("error in get message", error);

    return Response.json(
      {
        success: false,
        message: "error in to get message",
      },
      { status: 500 },
    );
  }
}
