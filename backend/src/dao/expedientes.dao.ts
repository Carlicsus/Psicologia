import { Op } from 'sequelize';
import loggerService from '../helpers/loggerService';
import { xd, IExpedientesAtrributes, IExpedientesCreationAttributes, IExpedientesOnlyNoExpediente, IExpedientesUpdateAttributes } from '../interfaces/expedientes.interface';
import { Expedientes, Gacetas, Institutos, Inventores, Notificaciones, Secciones, TemporalesNotificaciones } from '../models/index.model';
import { InventorData } from '../interfaces/email.interface';
import { IExpedienteLastNotificaiones, IExpedientesWithLastNotifications, IExpedientesWithNotifications } from '../interfaces/notificaciones.interface';

class ExpedientesDAO {

  private static instance: ExpedientesDAO;

  private constructor() { }

  public static getInstance(): ExpedientesDAO {
    if (!ExpedientesDAO.instance) {
      ExpedientesDAO.instance = new ExpedientesDAO();
    }
    return ExpedientesDAO.instance;
  }

  public async findOneExpedienteByNoExpediente(noExpediente: string): Promise<IExpedientesOnlyNoExpediente | null> {
    const expediente = await Expedientes.findOne({
      attributes: ['noExpediente'],
      raw: true,
      where: {
        noExpediente: noExpediente,
      },
    });
    return expediente as IExpedientesOnlyNoExpediente | null;
  }

  public async createOneExpediente(data: IExpedientesCreationAttributes): Promise<boolean> {
    await Expedientes.create(data);
    return true;
  }

  public async getAllExpedientesPendientes(): Promise<IExpedientesOnlyNoExpediente[]> {
    const expedientesPendientes = await Expedientes.findAll({
      where: {
        [Op.or]: [
          { fechaPresentacion: null },
          { titulo: null },
          { resumen: null },
        ],
        [Op.and]: [
          { status: true }
        ]
      },
      attributes: ['noExpediente'],
      raw: true,
    });
    return expedientesPendientes as IExpedientesOnlyNoExpediente[];
  }

  public async findAllExpedientes(): Promise<xd[]> {
    const expedientes = await Expedientes.findAll({
      include: [
        {
          model: Institutos,
          attributes: ['razonSocial'],
          through: { attributes: [] }
        },
        {
          model: Inventores,
          attributes: ['nombreCompleto'],
          through: { attributes: [] }
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      nest: true
    });
    return expedientes as unknown as xd[];
  }

  public async deleteExpedeintesNoEncontrados(fechaLimite: Date): Promise<void> {
    const expedientesNoEncontrados = await Expedientes.findAll({
      where: {
        [Op.and]: [
          { fechaPresentacion: null },
          { titulo: null },
          { resumen: null },
        ],
        createdAt: {
          [Op.lt]: fechaLimite,
        },
      },
      raw: true,
    });

    if (expedientesNoEncontrados.length > 0) {
      await Expedientes.destroy({
        where: {
          noExpediente: expedientesNoEncontrados.map((expediente) => expediente.noExpediente),
        },
      });
      loggerService.log('info', 'Expedientes no encontrados por el scrapper eliminados con éxito.');
      return;
    }

    loggerService.log('info', 'No se encontraron Expedientes que están pendientes por más de 6 meses');
    return;
  }

  public async updateExpedientesPendientes(expedientes: IExpedientesUpdateAttributes[]): Promise<void> {
    for (const expediente of expedientes) {
      const { noExpediente, fechaPresentacion, titulo, resumen } = expediente;
      const expedienteUpdate = await Expedientes.findOne({ where: { noExpediente: noExpediente } });
      await expedienteUpdate!.update({
        fechaPresentacion,
        titulo,
        resumen,
      });
      await expedienteUpdate!.save();
      loggerService.log('info', `Se actualizó la información del expediente ${noExpediente}`);
    }
    return;
  }

  public async getAllNoExpedientes(): Promise<IExpedientesOnlyNoExpediente[]> {
    const expedientes = await Expedientes.findAll({
      where: { status: true },
      attributes: ['noExpediente'],
      raw: true
    })

    return expedientes as IExpedientesOnlyNoExpediente[];
  }

  public async updateStatus(noExpediente: string, status: boolean): Promise<boolean> {
    const expediente = await Expedientes.findOne({ where: { noExpediente: noExpediente } });
    if (expediente) {
      await expediente.update({
        status: status
      })
      await expediente.save();
      return true;
    }
    return false;
  }

  public async getOneAllInventores(noExpediente: string): Promise<InventorData> {
    const expediente = await Expedientes.findOne({
      where: { noExpediente: noExpediente },
      include: [
        {
          model: Inventores,
          attributes: ['nombreCompleto', 'correo'],
          through: { attributes: [] }
        },
      ],
      attributes: ['noExpediente'],
      nest: true
    }) as unknown as InventorData;

    return expediente as InventorData
  }

  public async getAllLastNotificaciones(): Promise<IExpedientesWithLastNotifications[]> {
    const expedientes = await Expedientes.findAll({
      include: [
        {
          model: TemporalesNotificaciones,
          order: [['fechaCirculacion', 'DESC']],
          limit: 1,
          include: [
            {
              model: Gacetas,
              attributes: ['nombreGaceta'],
            },
            {
              model: Secciones,
              attributes: ['nombreSeccion']
            }
          ]
        },
        {
          model: Notificaciones,
          order: [['fechaCirculacion', 'DESC']],
          limit: 1,
          include: [
            {
              model: Gacetas,
              attributes: ['nombreGaceta']
            },
            {
              model: Secciones,
              attributes: ['nombreSeccion']
            }
          ]
        }
      ],
      order: [['noExpediente', 'ASC']],
      attributes: ['noExpediente'],
      nest: true
    }) as unknown as IExpedientesWithNotifications[];
    const transformedExpedientes = expedientes.map(expediente => {
      return {
        noExpediente: expediente.noExpediente,
        Notificaciones: expediente.Notificaciones[0] || null,
        TemporalesNotificaciones: expediente.TemporalesNotificaciones[0] || null
      };
    });
    return transformedExpedientes;
  }

  public async getOneAllNotificaciones(noExpediente: string): Promise<IExpedientesWithNotifications | null> {
    const expediente = await Expedientes.findOne({
      where: { noExpediente: noExpediente },
      include: [
        {
          model: TemporalesNotificaciones,
          include: [
            {
              model: Gacetas,
              attributes: ['nombreGaceta']
            },
            {
              model: Secciones,
              attributes: ['nombreSeccion']
            }
          ]
        },
        {
          model: Notificaciones,
          include: [
            {
              model: Gacetas,
              attributes: ['nombreGaceta']
            },
            {
              model: Secciones,
              attributes: ['nombreSeccion']
            }
          ]
        }
      ],
      attributes: ['noExpediente'],
      nest: true
    }) as unknown as IExpedientesWithNotifications || null;

    return expediente
  }

  public async getAllLastNotificaion(): Promise<IExpedienteLastNotificaiones[]> {
    const expedientes = await Expedientes.findAll({
      where: { status: true },
      include: [
        {
          model: TemporalesNotificaciones,
          order: [['fechaCirculacion', 'DESC']],
          attributes: ['numeroOficio', 'fechaCirculacion'],
          limit: 1,
        },
        {
          model: Notificaciones,
          order: [['fechaCirculacion', 'DESC']],
          attributes: ['numeroOficio', 'fechaCirculacion'],
          limit: 1,
        }
      ],
      attributes: ['noExpediente'],
      nest: true
    }) as unknown as IExpedienteLastNotificaiones[];

    // //Procesa los resultados para determinar la notificación más reciente
    // const ultimasNotificaciones = expedientes.map(expediente => {
    //   const temporal = expediente.TemporalesNotificaciones[0];
    //   const notificaion = expediente.Notificaciones[0];
    //   let lastNotificacion;
    //   if (!temporal && !notificaion) {
    //     return {
    //       noExpediente: expediente.noExpediente,
    //       numeroOficio: null,
    //       fechaCirculacion: null
    //     }
    //   }
    //   lastNotificacion = new Date(temporal.fechaCirculacion) > new Date(notificaion.fechaCirculacion) 
    //     ? temporal : notificaion
    //     return {
    //       noExpediente: expediente.noExpediente,
    //       numeroOficio: lastNotificacion.numeroOficio,
    //       fechaCirculacion: lastNotificacion.fechaCirculacion
    //     }
    // })

    // return ultimasNotificaciones;
    return expedientes
  }


}

export default ExpedientesDAO.getInstance();