import loggerService from "./loggerService";

class Horarios {

    private static instance: Horarios;
    private HoraScraperNotificacion: string;
    private HoraScraperHistorico: string;
    private HoraScraperSeeder: string;

    private constructor() {
        const horaActual = new Date().toLocaleTimeString();
        const minutosActuales = this.parseToMinutes(horaActual);
        const seisPMEnMinutos = this.parseToMinutes("6:00:00 PM");
        
        if (minutosActuales > seisPMEnMinutos) {
            // TODO: Revisar esta logica :v y el log
            loggerService.log('info',"La hora actual es mayor que las 6:00:00 PM, no se recomienda ejecutar los scrrappers");
            this.HoraScraperNotificacion = "12:00:00 AM";
            this.HoraScraperHistorico = "12:00:00 AM";
            this.HoraScraperSeeder = "12:00:00 AM";
            return;
        }

        const minutosEnUnDia = 24 * 60 - 1;
        const minutosRestantes = minutosEnUnDia - minutosActuales;

        const intervalo = Math.floor(minutosRestantes / 3);

        const tiempo1 = minutosActuales;
        const tiempo2 = tiempo1 + intervalo;
        const tiempo3 = tiempo2 + intervalo;
        const tiempo4 = minutosEnUnDia;

        this.HoraScraperSeeder = this.getRandomTimeBetween(tiempo1, tiempo2);
        this.HoraScraperHistorico = this.getRandomTimeBetween(this.parseToMinutes(this.HoraScraperSeeder) + 120, tiempo3);
        this.HoraScraperNotificacion = this.getRandomTimeBetween(this.parseToMinutes(this.HoraScraperHistorico) + 120, tiempo4);

        loggerService.log('info',`Hora de ejecucion del scraper Seeder: ${this.HoraScraperSeeder}`);
        loggerService.log('info',`Hora de ejecucion del scraper Historico: ${this.HoraScraperHistorico}`);
        loggerService.log('info',`Hora de ejecucion del scraper Expediente: ${this.HoraScraperNotificacion}`);
    }

    public static getInstance(): Horarios{
        if(!Horarios.instance){
            Horarios.instance = new Horarios();
        }
        return Horarios.instance;
      }

    private parseToMinutes(time: string): number {
        const [timePart, period] = time.split(' ');
        const [hour, minute] = timePart.split(':').map(Number);

        let hour24 = hour;
        if (period === 'AM' && hour === 12) {
            hour24 = 0; // Medianoche
        } else if (period === 'PM' && hour < 12) {
            hour24 = hour + 12; // Convierte PM a formato de 24 horas
        }

        return hour24 * 60 + minute; // Convierte todo a minutos desde la medianoche
    }

    private getRandomTimeBetween(startMinutes: number, endMinutes: number): string {
        const randomMinutes = Math.floor(Math.random() * (endMinutes - startMinutes)) + startMinutes;

        const hours = Math.floor(randomMinutes / 60);
        const minutes = randomMinutes % 60;
        const seconds = Math.floor(Math.random() * 60);

        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        const period = hours < 12 ? 'AM' : 'PM';
        const hourIn12 = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);

        return `${hourIn12}:${formattedMinutes}:${formattedSeconds} ${period}`;
    }

    private parseTimeToCron(time: string): string {
        const [timePart, period] = time.split(' ');
        const [hour, minute, second] = timePart.split(':').map(Number);

        let hour24 = hour;
        if (period === 'AM' && hour === 12) {
            hour24 = 0; // Medianoche
        } else if (period === 'PM' && hour < 12) {
            hour24 = hour + 12; // Convierte PM a formato de 24 horas
        }

        return `${second} ${minute} ${hour24} * * *`;
    }

    public makeNewHorarios(){
        Horarios.instance = new Horarios();
        return Horarios.instance
    }

    public getHorarioScrapperNotificacion(): string {
        return this.parseTimeToCron(this.HoraScraperNotificacion);
    }

    public getHorarioScrapperHistorico(): string {
        return this.parseTimeToCron(this.HoraScraperHistorico);
    }

    public getHorarioScrapperSeeder(): string {
        return this.parseTimeToCron(this.HoraScraperSeeder);
    }
}

export default Horarios.getInstance();
