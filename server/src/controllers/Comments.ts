

import { Request, Response, NextFunction } from 'express';

import mongoose from 'mongoose';
import Comments from '../models/Comments';

const makeComment = async (req: Request, res: Response, next: NextFunction) => {

    const comment = new Comments({

        comment: req.body.comment,

        user: req.body.user

    });

    try {

        const result = await comment.save();

        res.status(201).json({

            message: "Comment created",

            createdComment: result

        });

    } catch (err) {

        res.status(500).json({

            error: err

        });

    }

}

const readComment = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.commentId;

    try {

        const comment = await Comments.findById(id).populate("user");

        if (comment) {

            return res.status(200).json({

                comment

            });

        } else {

            return res.status(404).json({

                message: "Comment not found"

            });

        }

    } catch (err) {

        res.status(500).json({

            error: err

        });

    }
}


export default {
    makeComment,
    readComment
};