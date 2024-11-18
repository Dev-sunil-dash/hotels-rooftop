const express = require('express');
const router = express.Router();
const Blog = require('../model/blog.model')
const Comment = require('../model/comment.model')

//create a blog post
router.post('/create-post', async (req, res) => {
    try {
        // console.log("new blog data from API", req.body);
        const newPost = new Blog({ ...req.body });
        await newPost.save();
        res.status(201).send({
            message: "New post created succesfully",
            post: newPost
        })
    } catch (error) {
        console.error("Error while creating the post", error);
        res.status(500).send({ message: "Sorry, facing some error while creating the post" })
    }
})

//get all blogs
router.get('/', async (req, res) => {
    try {
        const { search, category } = req.query;
        console.log(search);

        let query = {};

        if (search) {
            query = {
                ...query,
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } }
                ]
            }
        }

        if (category) {
            query = {
                ...query,
                category
            }
        }

        // if (location) {
        //     query = {
        //         ...query,
        //         location
        //     }
        // }

        const post = await Blog.find(query).sort({ createdAt: -1 });
        res.status(201).send({
            message: "Post(s) fetcthed successfully...",
            post: post
        })
        res.send("Blog routes is responding...")
    } catch (error) {
        console.error("Error while fetching the data", error);
        res.status(500).send({ message: "Sorry, facing some error while fetching the data" })
    }
})

//get blog by id
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Blog.findById(postId);
        if (!post) {
            return res.status(404).send({ message: "Post not found" })
        }

        //fetch comment related to the post
        const comments = await Comment.find({ postId }).populate('user', "username email");

        res.status(200).send({
            message: "Post fetched successfully",
            post: post
        })

    } catch (error) {
        console.error("Error fetching the single post", error);
        res.send(500).send({ message: "Error fetching the single post" })
    }
})

//update a blog post
router.patch('/update-post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedPost = await Blog.findByIdAndUpdate(postId, {
            ...req.body
        }, { new: true });

        if (!updatedPost) {
            return res.status(404).send({ message: "Post not found" })
        }
        res.status(200).send({
            message: "Post updated successfully",
            post: updatedPost
        })

    } catch (error) {
        console.error("Error while updating the post:", error);
        res.status(500).send({ message: "Error while updating the post" })
    }
})

//delete a blog post
router.delete('/delete-post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await Blog.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).send({ message: "Post not found" })
        }
        // delete all comments related to the post
        await Comment.deleteMany({ postId });
        
        res.status(200).send({
            message: "Post deleted successfully",
            post: deletedPost
        })
    } catch (error) {
        console.error("Error while deleting the post:", error);
        res.status(500).send({ message: "Error while deleting the post" })
    }
})

//related blogs
router.get('/related/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        const titeRegex = new RegExp(blog.title.split(' ').join('|'), 'i');

        if (!id) {
            return res.status(404).send({ message: "Post id is required" });
        }
        if (!blog) {
            return res.status(404).send({ message: "Post is not found" });
        }

        const relatedQuery = {
            _id: { $ne: id }, //exclude the current blog by id
            title: { $regex: titeRegex }
        };

        const relatedPosts = await Blog.find(relatedQuery).limit(3);
        res.status(200).send({
            message: "Related posts fetched successfully",
            post: relatedPosts
        })
    } catch (error) {
        console.error("Error while finding the related post:", error);
        res.status(500).send({ message: "Error while finding the related the post" })
    }
})

module.exports = router;