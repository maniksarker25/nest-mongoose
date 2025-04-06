import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('smtp.host'),
      port: parseInt(this.configService.get<string>('smtp.port') as string, 10),
      auth: {
        user: this.configService.get<string>('smtp.mail'),
        pass: this.configService.get<string>('smtp.pass'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(options: { email: string; subject: string; html: string }) {
    const { email, subject, html } = options;

    const mailOptions = {
      from: `${this.configService.get<string>('smtp.name')} <${this.configService.get<string>('smtp.mail')}>`,
      to: email,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Email sending failed');
    }
  }
}
