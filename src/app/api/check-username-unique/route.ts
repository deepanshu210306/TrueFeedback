import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { z } from "zod";
import { usernameValidation } from "@/src/schemas/signupSchema";


const checkUsernameSchema = z.object({
  username: usernameValidation,
});

const UsernameQuerySchema = z.object({
})
export async function GET(  request: Request) {
    await dbConnect();
    try{
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username") || "",
        }
        const result=UsernameQuerySchema.safeParse(queryParams);
        if(!result.success) {
            return Response.json({ success: false, message: "Invalid query parameters" }, { status: 400 });
        }
        const username = result.data;
        const existingVerifiedUser= await UserModel.findOne({ username: username.username, isVerified: true });
        if(existingVerifiedUser){
            return Response.json({ success: false, message: "Username is already taken" }, { status: 409 });
        }

    }catch(error){
        console.log(error);
        return Response.json(({ success:false, message: "Internal Server Error" }), { status: 500 });
}
}