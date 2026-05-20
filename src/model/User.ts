import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt:Date
}

const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
        },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifycode:string;
    verifycodeExpiry:Date;
    isverified:boolean;
    isAcceptingMessages:boolean;
    messages:Message[];
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/^\S+@\S+\.\S+$/,"Please provide a valid email address"] 
        
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifycode:{
        type:String,
        required:true
    },
    verifycodeExpiry:{
        type:Date,
        required:true
    },
    isverified:{
        type:Boolean,
        default:false,
        required:true
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true,
        required:true
    },
    messages:[MessageSchema]
})

const UserModel= (mongoose.models.User as mongoose.Model<User>)||mongoose.model<User>("User",UserSchema);

export default UserModel;