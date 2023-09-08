import { body } from 'express-validator';

export const registerValidation = [
    body('email','Wrong email format!').isEmail(),
    body('password', 'Your password must include mor than 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Your name must be bigger than 3 synbols!').isLength({ min: 3 }),
    body('avataerUrl','It seems like that`s not img URL...').optional().isURL(),
];

export const loginValidation = [
    body('email','Wrong email format!').isEmail(),
    body('password', 'Your password must include mor than 5 symbols').isLength({ min: 5 }),
];

export const postCreateValidation = [
    body('title','Enter the title').isLength({min:3}).isString(),
    body('text', 'Enter the article text').isLength({ min: 3 }).isString(),
    body('tags', 'Wrong tag format!(here must be an array)').optional().isString(),
    body('imageUrl','Wrong URL!!!').optional().isString(),
]

