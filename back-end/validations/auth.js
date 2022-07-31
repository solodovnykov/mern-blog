import { body } from "express-validator";

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
