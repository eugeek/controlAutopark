const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const dbConnection = require("../utils/dbConnection");
const { transporter } = require("../nodemailer");
const config = require('../config');

// Home Page
exports.homePage = async (req, res, next) => {
    const [row] = await dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID]);

    if (row.length !== 1) {
        return res.redirect('/logout');
    }

    res.render('home', {
        user: row[0]
    });
}

exports.checkPage = async  (req, res, next) => {
    const [row] = await dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID]);
    if (row.length !== 1) {
        return res.redirect('/logout');
    }

    res.render('test', {
        user: row[0]
    });
}

exports.check = async (req, res, next) => {
    const [row] = await dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID]);
    const errors = validationResult(req);
    req.body.option = req.body.option.map(item => (Array.isArray(item) && item[1]) || null);

    try {
        let message = `<h2 style="color: #0d6efd">Чек-лист водителя: ${row[0].name}</h2>\n`;
        message += `<h2 style="color: #0d6efd">Машина: ${config.config.cars[req.body.cars]}</h2>\n`;
        let props = config.config.props;
        let yes = '<span style="color: #20c997">Да</span>';
        let no = '<span style="color: #dc3545">Нет</span>';
        let propsNo = [];
        for (let i = 0; i < props.length; i++) {
            message += `<h3>${props[i]} [${req.body.option[i] !== null ? yes : no}]</h3>`;
            if (req.body.option[i] === null && i < props.length - 8) propsNo.push(props[i]);
        }
        message += `<hr><h3>Ещё следует взять с собой: ${propsNo.join(', ')}</h3>`;
        let hasAll = 'У меня все есть'
        let hasNotAll = 'У меня не хватает'
        let title = `[Водитель: ${row[0].name}] ${propsNo.length === 0 ? hasAll : hasNotAll}`;
        let mailOptions = {
            from: `"${config.config.email.emailName}"${config.config.email.emailFrom}`, // sender address
            to: `${config.config.email.emailTo}`, // list of receivers
            subject: title, // Subject line
            text: '', // plaintext body
            html: message // html body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
        });

        const [rows] = await dbConnection.execute("UPDATE `users` SET `last_date`= NOW() WHERE `id`=?", [req.session.userID]);
    }
    catch(e){
        next(e);
    }




    res.redirect('/');
}

// Register Page
exports.registerPage = async (req, res, next) => {
        const [row] = await dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID]);

        if(row[0].admin !== 1) {
            return res.redirect('/');
        }
        else return res.render("register");

};

// User Registration
exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('register', {
            error: errors.array()[0].msg
        });
    }

    try {

        const [row] = await dbConnection.execute(
            "SELECT * FROM `users` WHERE `email`=?",
            [body._email]
        );

        if (row.length >= 1) {
            return res.render('register', {
                error: 'Этот логин уже используется.'
            });
        }

        const hashPass = await bcrypt.hash(body._password, 12);

        const [rows] = await dbConnection.execute(
            "INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",
            [body._name, body._email, hashPass]
        );

        if (rows.affectedRows !== 1) {
            return res.render('register', {
                error: 'Вам не удалось зарегистрировать.'
            });
        }

        res.render("register", {
            msg: 'Вы успешно зарегистрировали аккаунт.'
        });

    } catch (e) {
        next(e);
    }
};

// Login Page
exports.loginPage = (req, res, next) => {
    res.render("login");
};

// Login User
exports.login = async (req, res, next) => {

    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('login', {
            error: errors.array()[0].msg
        });
    }

    try {

        const [row] = await dbConnection.execute('SELECT * FROM `users` WHERE `email`=?', [body._email]);

        if (row.length != 1) {
            return res.render('login', {
                error: 'Некорректный логин.'
            });
        }

        const checkPass = await bcrypt.compare(body._password, row[0].password);

        if (checkPass === true) {
            req.session.userID = row[0].id;
            return res.redirect('/');
        }

        res.render('login', {
            error: 'Некорректный пароль.'
        });


    }
    catch (e) {
        next(e);
    }
}
