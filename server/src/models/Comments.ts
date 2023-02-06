

import mongoose,{Schema,Document} from "mongoose";

export interface IComment extends Document{
    comment:string;
    user:string
}


export interface ICommentModel extends IComment{
    // add custom methods for your model here
}

const CommentSchema:Schema = new Schema({
    comment:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

export default mongoose.model<ICommentModel>("Comment",CommentSchema);