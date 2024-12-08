import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { IEmailRegistro, InventorData } from '../interfaces/email.interface';
import juice from 'juice';
import { Inventore } from '../interfaces/expedientes.interface';
import {} from '../models/index.model';

class EmailService {

  private static instance: EmailService;

  private static transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sicomsito@gmail.com',
      pass: 'lbwv tbdn lsaf nity'
    }
  });

  private cssContent: string;

  private constructor() {
    this.cssContent = this.getCssContent();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private getCssContent(): string {
    const cssPath = path.join(__dirname, '../common/styles/styles.css');
    return fs.readFileSync(cssPath, 'utf8');
  }

  public async sendEmailRegistro(datos: IEmailRegistro): Promise<void> {
    const { usuario, token } = datos;

    const htmlContent = `
      <style>
        ${this.cssContent}
      </style>
      <div class="email-container">
        <div class="email-header">
          <h1>Confirmación de Cuenta</h1>
        </div>
        <div class="email-body">
          <p>Hola, ${process.env.EMAIL_ADMIN}</p>
          <p>Alguien con el nombre <strong>${usuario}</strong> ha solicitado acceso a su cuenta.</p>
          <p>Para confirmar la cuenta, haga clic en el siguiente enlace:</p>
          <div class="email-button">
            <a href="http://${process.env.APP_URL}:${process.env.APP_PORT ?? 3050}/backend/api/users/confirmar/${token}">Confirmar Cuenta</a>
          </div>
          <p>Si no solicitó esta acción, puede ignorar este mensaje.</p>
        </div>
        <div class="email-footer">
          <p>Este es un correo generado automáticamente, por favor no responda a este mensaje.</p>
        </div>
      </div>
    `;

    const htmlWithStyles = juice(htmlContent);

    await EmailService.transport.sendMail({
      from: 'patentes.com',
      to: process.env.EMAIL_ADMIN || "carlicsus3@gmail.com",
      subject: 'Confirmar nueva cuenta',
      text: `Hola, alguien con el nombre ${usuario} solicita acceso a su cuenta. Para confirmar la cuenta, haga clic en el siguiente enlace: ${process.env.APP_URL}:${process.env.APP_PORT ?? 3050}/backend/api/users/confirmar/${token}. Si no solicitó esta acción, puede ignorar este mensaje.`,
      html: htmlWithStyles
    });
  }

}

export default EmailService.getInstance();
