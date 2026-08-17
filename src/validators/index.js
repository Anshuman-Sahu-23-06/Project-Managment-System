import { body } from "express-validator";

const userRegisterValidator = () =>{
    return[
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is not valid")
        .normalizeEmail(),

        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({min: 3})
        .withMessage("Username must be at least 3 characters long"),
        
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long"),
        
        body("fullname")
        .trim()
        .notEmpty()
        .withMessage("Fullname is required")
        .isLength({min: 3})
        .withMessage("Fullname must be at least 3 characters long")
    ]
}

const userLoginValidator = () =>{
    return[
        body("email").optional()
        .isEmail()
        .withMessage("Email is not valid")
        .normalizeEmail(),
        body("password")
        .notEmpty()
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long")
    ]
}

const userChangeCurrentPasswordValidator = () =>{
    return[
        body("oldPassword")
        .notEmpty()
        .withMessage("Password is required"),
        
        body("newPassword")
        .notEmpty()
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long"),
        body("fullname")
        .optional()
        .isLength({min: 3})
        .withMessage("Fullname must be at least 3 characters long")
    ]
}

const userForgotPasswordValidator = () =>{
    return[
        body("email")
        .notEmpty()
        .withMessage("Email is required"),
        
        body("newPassword")
        .notEmpty()
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long")
    ]
}

const userResetForgotPasswordValidator = () =>{
    return[
        body("email")
        .notEmpty()
        .withMessage("Email is required"),
        
        body("newPassword")
        .notEmpty()
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long")
    ]
}
export{userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator}