import {getServerSession} from "next-auth/next";
import {authOptions} from "@/src/app/api/auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import {User} from "next-auth"
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user= session?.user;
    if(!session || !user){
        return Response.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }
    const userId= new mongoose.Types.ObjectId(user._id);
    try{
        const user =await UserModel.aggregate([
            {
                $match: { _id: userId }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: { "messages.createdAt": -1 }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
            }
            }
        ])
        if(!user || user.length === 0){
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ success: true, message: "User messages retrieved successfully", messages: user[0].messages }, { status: 200 });
    }catch(error){
        console.log(error);
        return Response.json(({ success:false, message: "Error retrieving user messages" }), { status: 500 });

    }
}