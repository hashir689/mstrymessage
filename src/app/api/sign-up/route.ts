import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerficationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, email, password } = await request.json();
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        {
          success: true,
          message: "Username already taken",
        },
        { status: 400 },
      );
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      if (existingEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already Exist and verified",
          },
          { status: 400 },
        );
      } else {
        const hashpassword = await bcrypt.hash(password, 10);
        existingEmail.password = hashpassword;
        existingEmail.verifyCode = otp;
        existingEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingEmail.save();
      }
    } else {
      const hashpassword = await bcrypt.hash(password, 10);
      const ExpiryDate = new Date();
      ExpiryDate.setHours(ExpiryDate.getHours() + 1);

      const newUser = await new UserModel({
        username,
        email,
        password: hashpassword,
        verifyCode: otp,
        verifyCodeExpiry: ExpiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send Verification Code
    const emailResponse = await sendVerficationEmail(email, username, otp);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "User register Successfuly, Please Verify your email",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error registration User", error);
    Response.json(
      {
        success: false,
        Message: "Error registering User",
      },
      {
        status: 500,
      },
    );
  }
}
