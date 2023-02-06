import mongoose, { Document, Schema } from "mongoose";

export interface ICompany extends Document {
    name: string;
    website: string;
    logo: string;
    videos: string[];
}


export interface ICompanyModel extends ICompany {
    // add custom methods for your model here
}

const CompanySchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    logo: {
        type: String,
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }]
}, { timestamps: true });


export default mongoose.model<ICompanyModel>("Company", CompanySchema);