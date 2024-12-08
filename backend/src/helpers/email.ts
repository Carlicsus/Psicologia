import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { IEmailNotificacion, IEmailRegistro, InventorData } from '../interfaces/email.interface';
import { IScrapersErrorData } from '../interfaces/workers/scrapersWorkers.interface';
import juice from 'juice';
import { INotificacionesAttributes, INotificacionesCreationAttributes } from '../interfaces/notificaciones.interface';
import { ITemporalesNotificacionesAttributes } from '../interfaces/temporalesNotificaciones.interface';
import { Inventore } from '../interfaces/expedientes.interface';
import { Gacetas, Secciones } from '../models/index.model';

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

  public async sendEmailScrapersError(datos: IScrapersErrorData): Promise<void> {
    const { code, error, scraperName } = datos;

    const htmlContent = `
      <style>
        ${this.cssContent}
      </style>
      <div class="email-container">
        <div class="email-header">
          <h1>Error en el ${scraperName}</h1>
        </div>
        <div class="email-body">
          <p>Hola, ${process.env.EMAIL_ADMIN}</p>
          <p>Ha ocurrido un problema con el ${scraperName}.</p>
          <p><strong>Código de error:</strong> ${code}</p>
          <p><strong>Descripción:</strong> ${error}</p>
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
      subject: `Error en el ${scraperName}`,
      html: htmlWithStyles
    });
  }

  public async sendEmailNotificacion(data: IEmailNotificacion) {
    const { inventoresData, temporales, notificaciones } = data;
    const regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  
    const generateTableRows = async (data: INotificacionesAttributes[] | ITemporalesNotificacionesAttributes[]) => {
      if (data.length > 0) {
        const rows = await Promise.all(data.map(async (item) => {
          const gaceta = await Gacetas.findOne({ where: { idGaceta: item.idGaceta }, attributes: ['nombreGaceta'], raw: true });
          const seccion = await Secciones.findOne({ where: { idSeccion: item.idSeccion }, attributes: ['nombreSeccion'], raw: true });
          return `
            <div class="card">
              <div class="card-content">
                <p><strong>Ejemplar:</strong> ${item.ejemplar}</p>
                <p><strong>Gaceta:</strong> ${gaceta!.nombreGaceta}</p>
                <p><strong>Sección:</strong> ${seccion!.nombreSeccion}</p>
                <p><strong>Fecha Circulación:</strong> ${item.fechaCirculacion}</p>
                <p><strong>Descripción:</strong> <div class="overflow-y-auto">${item.descripcionGeneralAsunto}</div></p>
                <p><strong>Fecha Oficio:</strong> ${!item.fechaOficio ? 'Sin fecha Oficio' : item.fechaOficio}</p>
                <p><strong>No. Oficio:</strong> ${!item.numeroOficio ? 'Sin número Oficio' : item.numeroOficio}</p>
              </div>
            </div>
          `;
        }));
        return rows.join('');
      } else {
        return `<div class="card"><div class="card-content"><p>No hay novedad</p></div></div>`;
      }
    }
    
    const generateFooter = (data: INotificacionesAttributes[] | ITemporalesNotificacionesAttributes[]) => {
      if (data.length > 0) {
        let htmlContent = '<div class="email-footer-grid">';
        data.forEach((item) => {
          htmlContent += ('noDocumento' in item) ? 
            `<p class="footer-item"><strong>Se adjunta el pdf ${item.descripcionGeneralAsunto}</strong></p>` : 
            `<p class="footer-item"><strong>${item.descripcionGeneralAsunto} no cuenta con un pdf</strong></p>`;
        });
        htmlContent += '</div>';
        return htmlContent;
      } else {
        return '<p><strong>No hay novedad</strong></p>';
      }
    };
    
    const generateAttachments = (data: INotificacionesAttributes[]): { filename: string, path: string }[] => {
      let attachments: { filename: string, path: string }[] = data.reduce((acc, item) => {
        const filePath = path.join(__dirname, `../common/PDFS/historico/${item.noExpediente.replace(/\//g, '_')}/${item.noDocumento.replace(/\//g, '_')}.pdf`);
        console.log(`Checking file path: ${filePath}`); // Add log for debugging
        if (fs.existsSync(filePath)) {
          console.log(`File exists: ${filePath}`); // Add log for debugging
          acc.push({ filename: `${item.descripcionGeneralAsunto}.pdf`, path: filePath });
        } else {
          console.log(`File does not exist: ${filePath}`); // Add log for debugging
        }
        return acc;
      }, [] as { filename: string, path: string }[]);
    
      return attachments;
    }
    
    const htmlContent = async (data: Inventore) => {
      const tableRowsNotificaciones = await generateTableRows(notificaciones);
      const tableRowsTemporales = await generateTableRows(temporales);
    
      return juice(`
        <style>
          ${this.cssContent}
        </style>
        <div class="email-container">
          <div class="email-header">
            <h1>${notificaciones[0].noExpediente?notificaciones[0].noExpediente:temporales[0].noExpediente}</h1>
          </div>
          <div class="email-body">
            <p>Hola, ${data.nombreCompleto}, tienes una nueva notificación</p>
            <div class="card-container">
              ${tableRowsNotificaciones}
              ${tableRowsTemporales}
            </div>
            <div style="display: flex; justify-content: center; flex-wrap: wrap;">
              ${notificaciones.length>0?generateFooter(notificaciones):''}
              ${temporales.length>0?generateFooter(temporales):''}
            </div>
          </div>
          <div class="email-footer">
            <p>Este es un correo generado automáticamente, por favor no responda a este mensaje.</p>
          </div>
        </div>
      `);
    }

    for (let inventorData of inventoresData.Inventores) {
      if (regexEmail.test(inventorData.correo)) {
        await EmailService.transport.sendMail({
          from: 'patentes.com',
          to: inventorData.correo,
          subject: `${inventoresData.noExpediente} Nuevas notificaciones`,
          html: await htmlContent(inventorData),
          attachments: generateAttachments(notificaciones)
        });
      }
    }
  }
}

export default EmailService.getInstance();
