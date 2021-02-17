import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: `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`
  }
}));

export default transporter;