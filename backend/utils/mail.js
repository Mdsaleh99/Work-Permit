import Mailgen from "mailgen"
import nodemailer from "nodemailer"
import { ApiError } from "./ApiError.js"


/**
 * @param {{email: string; subject: string; mailgenContent: Mailgen.Content; }} options
*/
export const sendEmail = async (options) => {
    const mailGenrator = new Mailgen({
        theme: "default",
        product: {
            name: "Work Permit System",
            link: "https://workpermit-system.com",
        }
    })

    const emailTextual = mailGenrator.generatePlaintext(options.mailgenContent)
    const emailHTML = mailGenrator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        }
    });

    const mail = {
        from: process.env.MAILTRAP_SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML,
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email service failed silently.", error);
        throw new ApiError(500, "Email service failed silently.", error)
    }

}


/**
 *
 * @param {string} name
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the email verification mail
*/
export const emailVerificationMailgenContent = (name, verificationUrl) => {
    return {
        body: {
            name: name,
            intro: "Welcome to Work Permit System! We're very excited to have you on board.",
            action: {
                instructions:
                    "To get started with your account, please verify email:",
                button: {
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
        },
        outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    };
};


/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the forgot password mail
 */
export const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset the password of our account",
            action: {
                instructions:
                    "To reset your password click on the following button or link:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Reset password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};