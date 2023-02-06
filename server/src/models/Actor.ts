
import mongoose, {Document,Schema} from "mongoose";

export interface IActor extends Document{
    name:string;
    age:number;
    films:string[];
    photo:string;

}

export interface IActorModel extends IActor{
    // add custom methods for your model here
    _id:string;
}

const ActorSchema:Schema = new Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    films:[{
        type:Schema.Types.ObjectId,
        ref:'Video'
    }],
    photo:{
        type:String,
    }
},{timestamps:true});

export default mongoose.model<IActorModel>("Actor",ActorSchema);