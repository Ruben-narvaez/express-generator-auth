const express = require('express');
const router = express.Router();

const mailer = require('../configs/nodemailer.config')

router.post('/signup', (req, res) => {

    let { email } = req.body

    mailer.sendMail({
        from: '"Ironhacker Email 👻" <myawesome@project.com>',
        to: email,
        subject: "Confirmation code",
        text: "hey",
        html: `<b>${"hey"}</b>`
    })
        .then(info => res.render('email-sent', { email, subject, message, info }))
        .catch(error => console.log(error));
})


module.exports = router