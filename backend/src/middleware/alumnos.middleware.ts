import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

class AlumnosMiddleware{

  private static instance: AlumnosMiddleware;

  private constructor () {}

  public static getInstance(): AlumnosMiddleware{
    if(!AlumnosMiddleware.instance){
      AlumnosMiddleware.instance = new AlumnosMiddleware();
    }
    return AlumnosMiddleware.instance;
  }

}

export default AlumnosMiddleware.getInstance();