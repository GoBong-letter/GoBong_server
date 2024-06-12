const { Community, CommunityComment, User, sequelize } = require('../models');

// 게시물 작성
exports.writePostMid = async (req, res) => {
    try{
        const post = await Community.create({
            ...req.body
        })

        return res.status(201).json({ message: '게시물 작성 성공' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 게시글 작성 실패" })
    }
}

// 댓글 작성
exports.writeCommentPostMid = async (req, res) => {
    try{
        const comment = CommunityComment.create({
            ...req.body
        })

        return res.status(201).json({ message: '댓글 작성 성공' });
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 댓글 작성 실패" })
    }
}

// 모든 게시물 조회
exports.allPostGetMid = async (req, res) => {
    try{
        const posts = await Community.findAll({
            attributes: ['id', 'title', 'content', 'createdAt'],
            include: [
                {
                    model: CommunityComment,
                    as: "comments",
                    attributes: ['content'],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['nickname'] 
                    }]
                },
                {
                    model: User,
                    attributes: ['nickname', 'image']
                }
            ]
        });
        
        res.json(posts)
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 모든 게시물 불러오기 실패" })
    }
}

// 나의 게시물 조회
exports.myPostGetMid = async (req, res) => {
    try{
        const user_id = req.params.user_id
        const posts = await Community.findAll({
            where: { user_id: user_id },
            attributes: [
                'id',
                'title',
                [sequelize.fn('COUNT', sequelize.col('comments.id')), 'commentCount']
            ],
            include: [{
                model: CommunityComment,
                as: 'comments',
                attributes: []
            }],
            group: ['Community.id']
        });
        
        res.json(posts)
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 나의 게시물 불러오기 실패" })
    }
}

// 특정 게시물 조회
exports.postGetMid = async (req, res) => {
    try{
        const post_id = req.params.post_id;
        const post = await Community.findOne({
            attributes: ['id', 'title', 'content', 'createdAt'],
            where: { id: post_id },
            include: [
                {
                    model: CommunityComment,
                    as: "comments",
                    attributes: [ 'content'],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['nickname'] 
                    }]
                },
                {
                    model: User,
                    attributes: ['nickname', 'image']
                }
            ]
        });

        
        const formattedPost = {
            ...post.dataValues,
            comments: post.comments.map(comment => ({
                content: comment.content,
                nickname: comment.user.nickname
            }))
        };

        res.json(formattedPost);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 게시물 불러오기 실패" })
    }
}