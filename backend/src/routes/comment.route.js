// import Comment from '../model/comment.model';
const express = require('express');
const router = express.Router();
const Comment = require('../model/comment.model')

//create a comment
router.post('/post-comment', async (req, res) => {
    // console.log(req.body);
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).send({
            message: "New comment created successfully",
            comment: newComment
        })
    } catch (error) {
        console.error("Error while adding comment:", error);
        res.status(500).send({ message: "Sorry, facing some error while creating the comment" })
    }
})

//get all comments count

router.get('/total-comments', async (req, res) => {
    try {
        const totalComments = await Comment.countDocuments({});
        res.status(200).send({
            message: "total comments count:",
            totalComments
        })
    } catch (error) {
        console.error("Error while getting comments count:", error);
        res.status(500).send({ message: "Sorry, facing some error while getting comments count" })
    }
})

module.exports = router;