export interface ITarifasMensajeria {
    Cancelacion: number;
    KmAdicional: number;
    ParadaAdicional: number;
    SobreCostoFueraCiudad: number;
    PrimerosKm: {
        Costo: number;
        Km: number;
    }
}