import { Resend } from "resend";

export function createResendClient(): Resend | null {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return null;
  return new Resend(resendApiKey);
}

export function getInquiryRecipient(): string {
  return process.env.CONTACT_TO_EMAIL ?? "aiomake2023@gmail.com";
}
