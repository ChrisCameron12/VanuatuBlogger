const Post = require('../database/models/Post')
 
module.exports = async (req, res) => {
    const posts = await Post.find({});
 
    res.render("accomodation", {
        posts
    });
}