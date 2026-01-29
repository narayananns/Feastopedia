// server/services/brevo.js
import axios from 'axios';

export const sendBrevoEmail = async (toEmail, subject, htmlContent) => {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.warn('Brevo API Key is missing (BREVO_API_KEY). Email skipped.');
    return;
  }

  const data = {
    sender: {
      name: "FeastoPedia Team",
      email: process.env.SENDER_EMAIL || "no-reply@feastopedia.com"
    },
    to: [
      {
        email: toEmail
      }
    ],
    subject: subject,
    htmlContent: htmlContent
  };

  console.log(`[Brevo] Attempting to send email to ${toEmail} from ${data.sender.email}`);

  try {
    // Official Brevo Transactional Email Endpoint
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      }
    });

    console.log(`Email sent to ${toEmail} | MessageId: ${response.data.messageId}`);
    return response.data;
  } catch (error) {
    console.error('Error sending Brevo email:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    // Don't throw, just log. We don't want to break the user flow if email fails.
  }
};
