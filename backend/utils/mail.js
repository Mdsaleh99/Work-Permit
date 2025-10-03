import Mailgen from "mailgen"
import nodemailer from "nodemailer"
import { ApiError } from "./ApiError.js"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)


/**
 * @param {{email: string; subject: string; mailgenContent: Mailgen.Content; }} options
*/
export const sendEmail = async (options) => {
    const mailGenrator = new Mailgen({
        theme: "default",
        product: {
            name: "Zero1",
            link: "https://zeros1.com",
        }
    })

    const emailTextual = mailGenrator.generatePlaintext(options.mailgenContent)
    const emailHTML = mailGenrator.generate(options.mailgenContent)

    // const transporter = nodemailer.createTransport({
    //     host: process.env.MAILTRAP_SMTP_HOST,
    //     port: process.env.MAILTRAP_SMTP_PORT,
    //     auth: {
    //         user: process.env.MAILTRAP_SMTP_USER,
    //         pass: process.env.MAILTRAP_SMTP_PASS,
    //     }
    // });
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        logger: process.env.NODE_ENV === "production",
        debug: process.env.NODE_ENV === "production",
    });

    const mail = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML,
    }

    try {
        await transporter.sendMail(mail)
        // await resend.emails.send(mail)
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

/**
 *
 * @param {string} superAdminName
 * @param {string} memberName
 * @param {string} permitTitle
 * @param {string} permitNo
 * @param {string} permitDetailsUrl
 * @returns {Mailgen.Content}
 * @description It designs the permit submission notification email for Super Admins
 */
export const permitSubmissionNotificationMailgenContent = (superAdminName, memberName, permitTitle, permitNo, permitDetailsUrl) => {
    return {
        body: {
            name: superAdminName,
            intro: `A new work permit submission requires your attention!`,
            table: {
                data: [
                    {
                        item: "Submitted by",
                        description: memberName,
                    },
                    {
                        item: "Permit Type",
                        description: permitTitle,
                    },
                    {
                        item: "Permit Number",
                        description: permitNo || "Not assigned",
                    },
                    {
                        item: "Submission Date",
                        description: new Date().toLocaleDateString(),
                    },
                ],
                columns: {
                    // Customize which column is visible
                    customWidth: {
                        item: "20%",
                        description: "80%",
                    },
                    // Customize which column is hidden
                    customAlignment: {
                        item: "left",
                    },
                },
            },
            action: {
                instructions:
                    "Please review and approve this work permit submission by clicking the button below:",
                button: {
                    color: "#007bff",
                    text: "Review Permit Details",
                    link: permitDetailsUrl,
                },
            },
            outro: "This permit is pending your approval. Please review the submission and take appropriate action. Contact the submitter if you need additional information.",
        },
    };
};