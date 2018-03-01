export interface ISolicitud {
    $key: string;
    Apellidos?: string
    Celular?: string | number
    Ciudad?: string
    Descripcion?: string
    DescripcionDomicilio?: string
    DistanciaTotal?: string | number
    EnProceso?: boolean
    Estado?: string
    GananciaMensajero?: number
    Motorratoner_id?: string
    Nombres?: string
    Telefono?: number | string
    TipoServicio?: string
    TotalAPagar?: number
    ValorDomicilio?: number
    codigoCiudad?: string
    distanciaIda?: any
    duracionIda?: any
    esPagoConTarjeta?: boolean
    fechaCompra?: number | string
    puntoFinal?: string
    puntoFinalCoors?: string
    puntoInicialCoors?: string
    puntoInicio?: string
    user_id?: string
    BonoRelanzamiento?: number;
}