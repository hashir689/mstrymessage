import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { signUpSchema } from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: signUpSchema.shape.username,
});

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return Response.json(
      {
        success: false,
        message: "Methid not allowed",
      },
      { status: 405 },
    );
  }
  await dbConnection();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      // this is syntax it always hold object
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        {
          status: 400,
        },
      );
    }
    const { username } = result.data;
    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is Unique",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      },
    );
  }
}
