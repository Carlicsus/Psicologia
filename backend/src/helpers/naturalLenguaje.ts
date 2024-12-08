import { JaroWinklerDistance } from 'natural';

class NaturalLenguajesService {

  private static instance: NaturalLenguajesService;

  private constructor() {}

  public static getInstance(): NaturalLenguajesService{
    if(!NaturalLenguajesService.instance){
      NaturalLenguajesService.instance = new NaturalLenguajesService();
    }
    return NaturalLenguajesService.instance;
  }

  public calculateSimilarity(text1: string, text2: string): number {
    // Utilizamos Jaro-Winkler Distance para calcular la similitud entre los textos
    return JaroWinklerDistance(text1, text2);
  }
}

export default NaturalLenguajesService.getInstance();
