import postModel from '../models/postModel.js';

export const getLastTags = async (req, res) => {
    try {
      const posts = await postModel.find().limit(5).exec();
  
      const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .slice(0, 5);
  
      res.json(tags);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Tags getting was failed;(',
      });
    }
  };

export const create = async (req, res) => {
    try {
        const doc = new postModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Post creation failed;('
        });
    };
};

export const getAll = async (req, res) => {
    try {
        const posts = await postModel.find().populate('user').exec();

        res.json(posts.reverse());
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Posts`s sending is  failed;('
        });
    }
}

export const getAllPopular = async (req, res) => {
    try {
        const posts = await postModel.find().populate('user').sort({ viewsCount: -1 }).exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить популярные посты;('
        });
    }
}


export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedDoc = await postModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true } // чтобы вернуть обновленный документ
        ).populate('user');

        if (!updatedDoc) {
            return res.status(404).json({
                message: 'Article not found;('
            });
        }

        res.json(updatedDoc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Post getting failed;('
        });
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await postModel.findOneAndDelete({
            _id: postId,
        });

        if (!deletedPost) {
            return res.status(404).json({
                message: 'You can`t delete an unexisting article!'
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Post deleting is failed;('
        });
    }
}

export const update = async (req,res) => {
    try {
        const postId = req.params.id;

        await postModel.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        })

        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Post updating failed;('
        });
    }
}

export const getPostsByTag = async (req, res) => {
    try {
      const tag = req.params.tag;
  
      const posts = await postModel.find({ tags: tag }).populate('user').exec();
  
      res.json(posts);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to get posts by tag;(',
      });
    }
  };
  