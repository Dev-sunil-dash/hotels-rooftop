const express = require('express');
const router = express.Router();
const Blog = require('../model/blog.model')

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
        let postId = req.params.id;
        const post = await Blog.findById(postId);
        if (!post) {
            return res.status(404).send({ message: "Post not found" })
        }
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

module.exports = router;