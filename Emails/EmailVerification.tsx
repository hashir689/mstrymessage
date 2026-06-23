import * as React from "react";

interface EmailTemplateProps {
  username: string;
  otp: string;
}

export function EmailTemplate({ username, otp }: EmailTemplateProps) {
  return (
    <div>
      <h1>
        Welcome {username} to Mystery Message! your OTP is {otp}
      </h1>
    </div>
  );
}
