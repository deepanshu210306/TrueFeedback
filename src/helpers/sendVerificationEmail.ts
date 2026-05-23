import { resend } from "../lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode:string               
):Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: "TrueFeedback <onboarding@resend.dev>",
            to: email,
            subject: "TrueFeedback | Your Verification Code",
            react: VerificationEmail({ username, otp: verifycode }),
        });

        return{
            success: true,
            message: "Verification email sent successfully.",
        }

    }catch(error){
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email.",
        };
    }
}