
import nodemailer from 'nodemailer';

export = async (email: any, subject: any, text: any) => {

    try {

        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })


        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        })
        console.log('Email sent successfully!');
    } catch (error) {
        console.log("Error sending email: ");
        console.log(error);
    }

}