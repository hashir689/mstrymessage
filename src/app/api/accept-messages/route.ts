import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticate",
      },
      { status: 401 },
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true },
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "UpdatedUser Failed",
        },
        { status: 401 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Accept status updated Successfuly",
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Session Error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 400 },
    );
  }
  const userId = user._id;
  try {
    const FoundUser = await UserModel.findById(userId);
    if (!FoundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: FoundUser.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: true,
        message: "Accept Message Failed",
      },
      { status: 500 },
    );
  }
}
