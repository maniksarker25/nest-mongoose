import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailService {
  private transporter;
  constructor(private configService: ConfigService) {
    // Initialize the transporter with dynamic SMTP details
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('smtp.host'),
      port: parseInt(this.configService.get<string>('smtp.port') as string, 10),
      auth: {
        user: this.configService.get<string>('smtp.mail'),
        pass: this.configService.get<string>('smtp.pass'),
      },
    });
  }
  private getFormattedDate(): string {
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  async sendEmail(options: { email: string; subject: string; html: string }) {
    const { email, subject, html } = options;

    const mailOptions = {
      from: `${this.configService.get<string>('smtp.name')} <${this.configService.get<string>('smtp.mail')}>`,
      to: email,
      date: this.getFormattedDate(),
      signed_by: 'bdCalling.com',
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
