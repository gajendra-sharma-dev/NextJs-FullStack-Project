import conntedDB from "@/lib/dbConntect";
import userModel from "@/model/User.models";
import { success } from "zod";

export async function POST(request: Request) {
  await conntedDB();
  try {
    const { username, code } = await request.json();

    const decodedUser = decodeURIComponent(username); //decodeURLComponetnt url me empty space me %20 add karta hai

    const user = await userModel.findOne({ username: decodedUser });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 500,
        },
      );
    }
    const isCodevailed = user.verfiyCode === code;
    const iscodeNotExpired = new Date(user.verfiyCodeExpiry) > new Date();

    if (iscodeNotExpired && isCodevailed) {
      user.isVerfied = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verfiyed successfully",
        },
        { status: 200 },
      );
    } else if (!iscodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "verfiyed code expiry. please sign in to get verfiyed token",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "verfiyed code is wrong",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error checking verfiy user", error);
    return Response.json(
      {
        success: false,
        message: "Error verfiying user",
      },
      {
        status: 500,
      },
    );
  }
}
