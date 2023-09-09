import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from "./validations/validations.js";
import {userController,postController} from './controllers/index.js';

import {handleValidationErrors, checkAuth} from './utils/index.js';


// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Database is ok!')
    })
    .catch((err) => console.log('Database error!', err));

const app = express();

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Middleware setup for handling JSON data and serving static files
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


//reg/login functionality
app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register);
app.get('/auth/me', checkAuth, userController.getMe);

//image functionality
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
})

app.get('/tags',postController.getLastTags);
app.get('/popular', postController.getAllPopular);

//posts functionality
app.get('/posts', postController.getAll);
app.get('/posts/tag/:tag', postController.getPostsByTag);
app.get('/posts/popular', postController.getAllPopular);
app.get('/posts/tags', postController.getLastTags);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch(
    '/posts/:id',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    postController.update,
);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server`s OK!');
});