const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;

//parsing
app.use(express.json());
app.use(cors())

//routes
const blogRoutes = require("./src/routes/blog.route");
app.use("/api/blogs", blogRoutes);

//env setup
require('dotenv').config()
// console.log(process.env.MONGODB_URL);

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);

    app.get('/', (req, res) => {
        res.send('The express project is running successfully!!!')
    })
}

//sunildash0306-VAtGszFkuhT6Dezv

main()
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log(err));



app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})