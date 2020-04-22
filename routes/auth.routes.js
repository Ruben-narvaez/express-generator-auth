const express = require("express")
const router = express.Router()
const passport = require("passport")

const mailer = require('../configs/nodemailer.config')

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10


// User signup
router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    const { username, password, email } = req.body

    if (!username || !password || !email) {
        res.render("auth/signup", { errorMsg: "Rellena el usuario y la contraseña" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario ya existe en la BBDD" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
            //const confirmationCode
            const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let confirmationCode = '';
            for (let i = 0; i < 25; i++) {
                confirmationCode += characters[Math.floor(Math.random() * characters.length)];
            }

            User.create({ username, email, password: hashPass, confirmationCode })
                .then(() => res.redirect("/"))
                .then(() => console.log("HeY"))
                .catch(() => res.render("auth/signup", { errorMsg: "No se pudo crear el usuario" }))
                
            mailer.sendMail({
                from: '<terryhall666@hotmail.com>',
                to: email,
                subject: "Confirmation code",
                text: "hey",
                html: `<b>${"hey"}</b>`
            })
                .then(info => res.render('email-sent', { email, subject, message, info }))
                .catch(error => console.log(error));
        })
        .catch(error => next(error))
})




// User login
router.get('/login', (req, res) => res.render('auth/login', { "errorMsg": req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos'
}))


// User logout
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router