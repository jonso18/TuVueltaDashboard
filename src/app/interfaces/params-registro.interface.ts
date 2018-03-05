import { ICiudad } from "./ciudad.interface";

export interface IParamsRegistro {
    Ciudades: ICiudad[];
    ComoNosConocio: string[];
    TiempoDispParaHacer: string[];
    TiempoDispParaHacerServicio: string[];
    TieneCelAndroidYDatos: string[];
    TieneEPS: string[];
    TipoVehiculo: string[];
}