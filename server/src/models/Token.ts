

import { Schema, model, Document } from 'mongoose';

export interface IToken extends Document {
    token: string;
    user: string;
    createdAt: Date;
}

const TokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600
    }


},);

export default model<IToken>('Token', TokenSchema);

