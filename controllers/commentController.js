import Comment from '../models/commentModel.js';
import mongoose from 'mongoose';

export const createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = new mongoose.Types.ObjectId(req.params.id);

        const comment = new Comment({
            text,
            user: req.userId,
            post: postId,
        });

        const savedComment = await comment.save();

        res.json(savedComment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create a comment;(',
        });
    }
};
