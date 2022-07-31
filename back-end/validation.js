import { body } from "express-validator";

export const loginValidation = [
  body("email", "invalid mail format").isEmail(),
  body("password", "The minimum password length is 5 characters.").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "invalid mail format").isEmail(),
  body("password", "The minimum password length is 5 characters.").isLength({
    min: 5,
  }),
  body("fullName", "The minimum name length is 2 characters.").isLength({
    min: 2,
  }),
  body("avatarUrl", "Invalid link").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "Title field is empty (minimum 3 characters)")
    .isLength({ min: 3 })
    .isString(),
  body("text", "Text field is empty (minimum 10 characters)")
    .isLength({ min: 10 })
    .isString(),
  body("tags", "Invalid format (input string)").optional().isString(),
  body("imageUrl", "Invalid link").optional().isString(),
];
