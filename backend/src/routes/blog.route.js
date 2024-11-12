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

        const post = await Blog.find(query);
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

module.exports = router;