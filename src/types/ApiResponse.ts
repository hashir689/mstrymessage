import { Message } from "@/model/User";
export interface ApiResponse {
  message: string;
  success: boolean;
  acceptMessage?: boolean;
  messages?: Array<Message>;
}
