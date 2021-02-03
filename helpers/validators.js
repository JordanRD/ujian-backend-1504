const { body } = require('express-validator')

module.exports = {
    registerValidator: [
        body('username')
            .matches(/^\w{6,}$/)
            .withMessage('Username can not be empty and more than 6 characters long noo symbols or whitespaces'),
        body('password')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])[\S]{6,}$/)
            .withMessage('password can not be empty include lower case, upper case, number min 6 char'),
        body('email')
            .isEmail()
            .withMessage('invalid email address'),
        body('role')
            .optional()
            .isIn([1,2,'1','2'])
            .withMessage('choose role between admin (1) or user(2) by default'),
        body('status')
            .optional()
            .isIn([1, '1'])
            .withMessage('you can not input status from register form'),
        body('id')
            .optional()
            .matches(/\W{1430}\s/)
            .withMessage('you can not input id from register form'),
    ]
}