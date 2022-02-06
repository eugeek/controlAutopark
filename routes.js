const router = require("express").Router();
const { body } = require("express-validator");

const {
    homePage,
    register,
    registerPage,
    login,
    loginPage,
    check,
    checkPage,
    usersPage
} = require("./controllers/userController");

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.userID){
        return res.redirect('/login');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.userID){
        return res.redirect('/');
    }
    next();
}

router.get('/', ifNotLoggedin, homePage);

router.get('/check', ifNotLoggedin, checkPage);
router.post('/check', ifNotLoggedin, check);

router.get("/login", ifLoggedin, loginPage);
router.post("/login",
    ifLoggedin,
    [
        body("_email", "Логин состоит минимум из 3 символов")
            .notEmpty()
            .escape()
            .trim()
            .isLength({ min: 3 }),
        body("_password", "Пароль должен состоять минимум из 4 символов")
            .notEmpty()
            .trim()
            .isLength({ min: 4 }),
    ],
    login
);

router.get('/users', ifNotLoggedin, usersPage);

router.get("/signup", ifNotLoggedin, registerPage);
router.post(
    "/signup",
    ifNotLoggedin,
    [
        body("_name", "Имя должно состоять минимум из 3 символов")
            .notEmpty()
            .escape()
            .trim()
            .isLength({ min: 3 }),
        body("_email", "Некорректный логин (минимум 3 символа)")
            .notEmpty()
            .escape()
            .trim()
            .isLength({ min: 3 }),
        body("_password", "Пароль должен состоять минимум из 4 символов")
            .notEmpty()
            .trim()
            .isLength({ min: 4 }),
    ],
    register
);

router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        next(err);
    });
    res.redirect('/login');
});

module.exports = router;