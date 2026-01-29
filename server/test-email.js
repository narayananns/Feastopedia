import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testGmail = async () => {
    console.log('--- Testing Gmail Configuration ---');
    console.log(`User: ${process.env.EMAIL_USER}`);
    console.log(`Pass length: ${process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0}`);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        logger: true,
        debug: true
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email from Debug Script',
            text: 'If you receive this, your Gmail App Password configuration works!'
        });
        console.log('✅ SUCCESS! Email sent.');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.log('❌ FAILED.');
        console.error('Error Code:', error.code);
        console.error('Error Command:', error.command);
        console.error('Response:', error.response);
        
        if (error.response && error.response.includes('Username and Password not accepted')) {
            console.log('\n--- DIAGNOSIS ---');
            console.log('Your password was rejected by Google.');
            console.log('1. You CANNOT use your regular Gmail login password.');
            console.log('2. You MUST use a 16-character App Password.');
            console.log('3. Go to https://myaccount.google.com/apppasswords');
            console.log('4. Create a new app password for "Mail" on your device.');
            console.log('5. Use THAT password in your .env file.');
        }
    }
};

testGmail();