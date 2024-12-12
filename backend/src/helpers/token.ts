import Jwt from "jsonwebtoken";
import { IJwtInputAtrributes } from "../interfaces/auth/token.interface";
import { v4 as uuidv4 } from 'uuid'; // Importa uuid


class TokenService {

    private static instance : TokenService

    private constructor(){}

    public static getInstance(): TokenService{
        if(!TokenService.instance){
            TokenService.instance = new TokenService();
        }
        return TokenService.instance;
      }

    public generarJWT(data: IJwtInputAtrributes): string {
        return Jwt.sign({ usuario: data.usuario }, process.env.SECRET_KEY || "pepito123", { expiresIn: '1d' });
    }

    public generarId(): string {
        return uuidv4();
    }
}

export default TokenService.getInstance();
