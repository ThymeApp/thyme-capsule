// @flow

import mg from 'mailgun-js';

const domain = process.env.MAILGUN_DOMAIN;
const apiKey = process.env.MAILGUN_API_KEY;

const mailgun = mg({ apiKey, domain });

export default function sendMessage(to: string, subject: string, text: string) {
  const data = {
    from: 'Thyme Capsule <support@usethyme.com>',
    to,
    subject,
    text,
  };

  mailgun.messages().send(data, (error) => {
    if (error) {
      console.error(error.message);
    }
  });
}
