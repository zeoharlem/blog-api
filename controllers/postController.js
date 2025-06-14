const mongoose = require("mongoose");

const BlogPostModel = require("../models/post");
const {StatusCodes, getReasonPhrase} = require("http-status-codes");


const createBlogPost = async (req, res, next) => {
    const {title, description, tags, body} = req.body
    try {
        const newBlogPost = await BlogPostModel.create(
            {
                title,
                description,
                author: req.user._id,
                tags,
                body,
            }
        )
        return res.status(201).json(
            {
                status: true,
                data: newBlogPost
            }
        )
    } catch (error) {
        next(error)
    }
}

const getMyBlogPosts = async (req, res, next) => {
    try {
        const id = req.user._id
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const state = req.query.state || 'published'

        const posts = await BlogPostModel.find({author: id, state: state})
            .skip(skip)
            .limit(limit)
            .populate('author')

        const total = await BlogPostModel.countDocuments({author: id, state: state});

        return res.status(StatusCodes.OK).json(
            {
                page,
                per_page: limit,
                total,
                total_pages: Math.ceil(total / limit),
                data: posts,
                status: true,
            }
        );
    } catch (error) {
        next(error)
    }
}

const getPostDetailsById = async (req, res, next) => {
    const postId = req.params.id
    try {
        const post = await BlogPostModel.findById({_id: postId})
            .where({state: 'published'})
            .populate('author')

        if (!post) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: `Post not available: ${getReasonPhrase(StatusCodes.EXPECTATION_FAILED)}`
            })
        }
        post.read_count += 1;
        await post.save()
        res.status(StatusCodes.OK).json(
            {
                status: true,
                data: post
            }
        )
    } catch (error) {
        next(error)
    }
}

/**
 * --- Got sorted using ChatGpt --- */
const getAllPostsByPagination = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit ?? '20', 10)
        const skip = (page - 1) * limit;

        // Search Filters
        const {author, title, tags, order_by, order, state} = req.query;
        let filter = {};

        if (author) {
            filter.author = new RegExp(author, 'i'); // case-insensitive
        }

        if (title) {
            filter.title = new RegExp(title, 'i'); // case-insensitive
        }

        if (tags) {
            const tagArray = tags.split(','); // ?tags=tech,news
            filter.tags = {$in: tagArray};
        }

        //ensure published posts are returned
        filter.state = {$eq: "published"}

        // Sorting
        const allowedSortFields = ['read_count', 'reading_time', 'timestamp'];
        const sortField = allowedSortFields.includes(order_by) ? order_by : 'timestamp';
        const sortOrder = order === 'asc' ? 1 : -1;
        const sort = {[sortField]: sortOrder};

        // Query
        const posts = await BlogPostModel.find(filter).sort(sort).skip(skip).limit(limit).populate('author');
        const total = await BlogPostModel.countDocuments(filter);

        res.json(
            {
                page,
                per_page: limit,
                total,
                total_pages: Math.ceil(total / limit),
                data: posts,
                status: true,
            }
        );
    } catch (e) {
        /*res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            {
                error: 'Server error',
                details: e.message
            }
        );*/
        next(e);
    }
}

//use PUT for this function
const updateMyBlogPost = async (req, res, next) => {
    const body = req.body

    try {
        const post = await BlogPostModel.findOneAndUpdate(
            {_id: req.params.id, author: req.user._id},
            {...body, updatedAt: new Date()},
            {new: true}
        )

        if (!post) {
            return res.status(StatusCodes.BAD_REQUEST).json(
                {
                    status: false,
                    message: `Post not available: ${getReasonPhrase(StatusCodes.EXPECTATION_FAILED)}`
                }
            )
        }

        return res.status(StatusCodes.OK).json(
            {
                status: true,
                data: post
            }
        )
    } catch (error) {
        next(error)
    }
}

//use PATCH for this function
const updateMyBlogPostStatus = async (req, res, next) => {
    try {
        const post = await BlogPostModel.findById(req.params.id)
        if (post.state === 'published') {
            return res.status(StatusCodes.BAD_REQUEST).json(
                {
                    status: false,
                    message: `Post not available: ${getReasonPhrase(StatusCodes.EXPECTATION_FAILED)}`
                }
            )
        }
        post.state = req.body.state;
        post.updatedAt = new Date()
        await post.save()
        return res.status(StatusCodes.OK).json(
            {
                status: true,
                post
            }
        )
    } catch (error) {
        next(error)
    }
}

const deleteMyBlogPost = async (req, res, next) => {
    try {
        const post = await BlogPostModel.findByIdAndDelete(req.params.id)
        if (!post) {
            return res.status(StatusCodes.BAD_REQUEST).json(
                {
                    status: false,
                    msg: "Post Not available"
                }
            )
        }
        return res.status(StatusCodes.OK).json(
            {
                status: true,
                msg: getReasonPhrase(StatusCodes.OK)
            }
        )
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createBlogPost,
    getPostDetailsById,
    getAllPostsByPagination,
    getMyBlogPosts,
    deleteMyBlogPost,
    updateMyBlogPostStatus,
    updateMyBlogPost
};
