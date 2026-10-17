import { getServerSession } from "next-auth";

import conntedDB from "@/lib/dbConntect";
import userModel from "@/model/User.models";
import { User } from "next-auth";
import { authOpetions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> },
) {
  const messageId = await params;

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
  try {
    const updatedResult = await userModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } },
    );

    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          messaage: "Message not found or already delete",
        },
        { status: 404 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message deleted",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("error in delete message", error);

    return Response.json(
      {
        success: false,
        message: "error deleteing message",
      },
      { status: 500 },
    );
  }
}
