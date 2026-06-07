import { resend } from "@/lib/resend";
import { EmailTemplate } from "../../Emails/EmailVerification";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerficationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mstry Message Verification Code",
      react: EmailTemplate({ username, otp: verifyCode }),
    });

    return { success: true, message: "Email Verification send Successfully" };
  } catch (error) {
    console.log("Email verification failed", error);
    return { success: false, message: "Email Verification failed" };
  }
}
