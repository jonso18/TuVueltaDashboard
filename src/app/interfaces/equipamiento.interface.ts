export interface IEquipamiento {
    Mensaje: string;
    MontoParaTrabajarHoy: number;
    Requisitos: {
        ChaquetaMensajero: IRequisitoEquip;
        EquipoMensajero: IRequisitoEquip;
        EquipoMoto: IRequisitoEquip;
    }
}

export interface IRequisitoEquip {
    Etiqueta: string;
    Opciones: string[];
}