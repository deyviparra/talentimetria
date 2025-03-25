import { createTransport } from "nodemailer";
import myOAuth2Client from "./gauth";

export const sendEmailService = async (
    to,
    subject,
    html,
    attachments
) => {
    try {
        myOAuth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });
        const accessToken = await myOAuth2Client.getAccessToken();
        const transportOptions = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GOOGLE_EMAIL,
                clientId: process.env.GOOGLE_CLIENT_ID,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        };
        const smtpTransport = createTransport(transportOptions);
        const mailOptions = {
            from: {
                name: "Talentimetria <administrador@talentimetria.com>",
                address: process.env.GOOGLE_EMAIL,
            },
            to,
            subject,
            html,
            attachments,
        };
        await smtpTransport.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
    }
};