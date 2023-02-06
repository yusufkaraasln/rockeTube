import mongoose, {
    Schema,
    Document
} from "mongoose";

export interface IVideo extends Document {
    title: string;
    description: string;
    video_url: string;
    actors: string[];
    cover_url: string;
    company: string;
    favorites: string[];
    comments: string[];

}

export interface IVideoModel extends IVideo {
}


const VideoSchema: Schema = new Schema({
    actors: [{
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
    }],

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    cover_url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    video_url: {
        type: String,
        required: true
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]


}, {
    timestamps: true
});

export default mongoose.model<IVideoModel>("Video", VideoSchema);

