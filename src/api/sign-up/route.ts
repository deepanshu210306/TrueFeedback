import dbConnect from "@/src/lib/dbConnect";
import User from "@/src/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";
import UserModel from "@/src/model/User";

export async function POST(request: Request) {
    try {
        const { email, username, password } = await request.json();
        await dbConnect();
        const existingUser = await User.findOne({ username,isverified: true });
        if (existingUser) {
            return Response.json(
                { success: false, message: "Username already exists." },
                { status: 400 }
            );
        }
        const existingUserByEmail = await User.findOne({ email });
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if(existingUserByEmail.isverified){
                return Response.json(
                    { success: false, message: "Email already in use." },
                    { status: 400 }
                );
            }
            else{                
                existingUserByEmail.username=username;
                const hashedPassword = await bcrypt.hash(password, 10);
                
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifycode=verifycode;
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                existingUserByEmail.verifycodeExpiry=expiryDate;
                await existingUserByEmail.save();
            }   
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                    email,
                    password:hashedPassword,
                    verifycode,
                    verifycodeExpiry:expiryDate,
                    isverified:false,
                    isAcceptingMessages:true,
                    messages:[]
            });
            await newUser.save();

        }
        const emailResponse= await sendVerificationEmail(email, username, verifycode);
        if(emailResponse.success){
            return Response.json({ success: true, message: "User registered successfully. Verification email sent." },
                { status: 201 }
            );
        }
        else{
            return Response.json({ success: false, message: "User registered but failed to send verification email." },
                { status: 500 }
            );
        }
    }
    catch (error) {
        console.error("Error during user registration:", error);
        return Response.json({ success: false, message: "An error occurred during registration." },
            { status: 500 }
    );
    }
}


