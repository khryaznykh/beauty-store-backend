const nodemailer = require("nodemailer");
const resetPasswordEmailTemplate = require("../template/resetPasswordEmailTemplate");
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CLIENT_PORT = process.env.CLIENT_PORT;



//The constructor runs automatically when a new object is created.
// Later you do new MailService() and constructor runs immideatly
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
                            ///port    465 -> secure: true
                            ///        587 -> secure: false
    port: SMTP_PORT,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {         /// require login credentials
        user: SMTP_USER,
        pass: SMTP_PASS,        //also can be written process.env.SMTP_PASS  no need to import then
                                ///Notice that credentials are stored in environment variables 
                                ///rather than directly in the source code. 
                                ///This helps keep sensitive information out of the codebase.
    },
});


const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_ADMIN, // sender address
            to: email, // list of recipients
            subject: "Password Reset", // subject line
            html: resetPasswordEmailTemplate(resetToken, CLIENT_PORT) //using template from separate file
            
            
            //also can be done here like this instead of template
            //text: "Hllo world?", // plain text body
            //html: "<b>Hello world?</b>", // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

module.exports = { sendResetPasswordEmail }

//on success object returns
//messageId - The Message-ID header value assigned to the email.
//envelope - An object containing the SMTP envelope addresses (from and to).
//accepted - 	An array of recipient addresses that the server accepted.
//rejected
//rejectedErrors - 	An array of recipient addresses that the server accepted.
//responce - The final response string received from the SMTP server.