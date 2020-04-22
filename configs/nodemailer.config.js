const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'terryhall666@hotmail.com',
        pass: 'culocaca1'
    }
})

module.exports = transporter