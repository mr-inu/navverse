const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer')
module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if (post){
            let comment  = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
                post.comments.push(comment);
                post.save();
                //change email provider and then uncomment
                //comment = await comment.populate('user' ,'name email').execPopulate();
                commentsMailer.newComment(comment);
                req.flash('success', 'Commented!')
                res.redirect('/');
            };
        
    }catch(err){
        console.log(err);
        return;
    }
}
module.exports.destroy = async function(req, res){
    try{
       let comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();

            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
                return res.redirect('back');
            }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log(err);
        return;
    }
}