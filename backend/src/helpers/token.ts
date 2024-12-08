import Jwt from "jsonwebtoken";
import { IJwtInputAtrributes } from "../interfaces/auth/token.interface";

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
        return Math.random().toString(32).substring(2) + Date.now().toString(32);
    }
}

export default TokenService.getInstance();
