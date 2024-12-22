export interface NotificationData {
  type: "message" | "match" | "run_invitation";
  message_id?: string;
  sender_id?: string;
  matched_user_id?: string;
  run_id?: string;
}
