import {getServerSession} from "next-auth/next";
import {authOptions} from "@/src/app/api/auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import {User} from "next-auth"

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user= session?.user;
    if(!session || !user){
        return Response.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }
    const userId=user._id;
    const {acceptMessages}=await request.json();
    try{
        const updatedUser=await UserModel.findByIdAndUpdate(userId, {acceptMessages:acceptMessages},{new:true});
        if(!updatedUser){
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ success: true, message: "User settings updated successfully", data: updatedUser }, { status: 200 });

    }catch(error){
        console.log(error);
        return Response.json(({ success:false, message: "Error updating user settings" }), { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user= session?.user;
    if(!session || !user){
        return Response.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }
    const userId=user._id;
    try{
        const foundUser=await UserModel.findById(userId);
    if(!foundUser){
        return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return Response.json({ success: true, message: "User settings retrieved successfully", isAcceptingMessage: foundUser.isAcceptingMessages}, { status: 200 });
    }catch(error){
        console.log(error);
        return Response.json(({ success:false, message: "Error retrieving user settings" }), { status: 500 });
    }

}