import { RouteInfo } from "../components/sidebar/sidebar.component";

export const administradorRoutes: RouteInfo[] = [
    {
        path: '/administrador/inicio',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
    },
    {
        path: '/administrador/parametros',
        title: 'Parámetros',
        type: 'sub',
        icontype: 'settings',
        collapse: 'parametros',
        children: [
            { path: 'Configuracion-global', title: 'Configuración Global', ab: 'CG'},
            { path: 'Reglas-activo', title: 'Reglas de Activo', ab: 'RA'},
            { path: 'ciudad', title: 'Ciudades', ab: 'CI'},
            { path: 'tarifas', title: 'Tarifas', ab: 'T'},
            { path: 'Ganacias', title: 'Ganacias', ab: 'G'},
            { path: 'Estados-Domicilios', title: 'Estados Domicilios', ab: 'ED'},
            { path: 'Equipamiento', title: 'Equipamiento', ab: 'EQ'},
            { path: 'Bonos-Mensajeria', title: 'Bonos Mensajeria', ab: 'BM'},
        ]
    },
    {
        path: '/administrador/Usuarios',
        title: 'Usuarios',
       
        type: 'sub',
        icontype: 'account_box',
        collapse: 'Usuarios',
        children: [
            { path: 'nuevo', title: 'Crear Usuario', ab: 'NU'},
            { path: 'lista', title: 'Listado de usuarios', ab: 'LU'},
            { path: 'seguimiento-activos', title: 'Seguimiento Activos', ab: 'SA'},

        ]
    },
    {
        path: '/administrador/solicitud',
        title: 'Solicitudes',
        
        type: 'sub',
        icontype: 'motorcycle',
        collapse: 'Reasignaciones',
        children: [
            /* { path: 'hacer-reasignacion', title: 'Reasignar Servicios', ab: 'RS'}, */
            { path: 'lista', title: 'Reajustar Servicios', ab: 'RJS'},
        ]
    },
    {
        path: '/administrador/reportes',
        title: 'Reportes',
        
        type: 'sub',
        icontype: 'equalizer',
        collapse: 'Reportes',
        children: [
            { path: 'clientes-servicios', title: 'Clientes Servicios', ab: 'CS'},

        ]
    },
    {
        path: '/administrador/mensajeria',
        title: 'Mensajeria',
        type: 'sub',
        icontype: 'mail',
        collapse: 'Mensajeria',
        children: [
            { path: 'nuevo', title: 'Mensajeria', ab: 'CS'},

        ]
    },
];

export const clientRoutes: RouteInfo[] = [
     {
        path: '/cliente/solicitud',
        title: 'Cargar Domicilio',
        type: 'link',
        icontype: 'motorcycle',
 
    },
    {
        path: '/cliente/mensajeria',
        title: 'Cargar Mensajeria',
        type: 'link',
        icontype: 'mail',
 
    },
];
export const personRoutes: RouteInfo[] = [
   {
       path: '/persona/mensajeria',
       title: 'Cargar Mensajeria',
       type: 'link',
       icontype: 'mail',

   },
];
export const operatorRoutes: RouteInfo[] = [
    {
        path: '/operador/inicio',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
    },
    {
        path: '/operador/parametros',
        title: 'Parámetros',
        type: 'sub',
        icontype: 'settings',
        collapse: 'parametros',
        children: [
            { path: 'Configuracion-global', title: 'Configuración Global', ab: 'CG'},
            { path: 'Reglas-activo', title: 'Reglas de Activo', ab: 'RA'},
            { path: 'ciudad', title: 'Ciudades', ab: 'CI'},
            { path: 'tarifas', title: 'Tarifas', ab: 'T'},
            { path: 'Ganacias', title: 'Ganacias', ab: 'G'},
            { path: 'Estados-Domicilios', title: 'Estados Domicilios', ab: 'ED'},
            { path: 'Equipamiento', title: 'Equipamiento', ab: 'EQ'},
        ]
    },
    {
        path: '/operador/Usuarios',
        title: 'Usuarios',
        type: 'sub',
        icontype: 'account_box',
        collapse: 'Usuarios',
        children: [
            { path: 'nuevo', title: 'Crear Usuario', ab: 'NU'},
            { path: 'lista', title: 'Listado de usuarios', ab: 'LU' },
            { path: 'seguimiento-activos', title: 'Seguimiento Activos', ab: 'SA'},

        ]
    },
    {
        path: '/operador/mensajeria',
        title: 'Mensajeria',
        type: 'sub',
        icontype: 'mail',
        collapse: 'Mensajeria',
        children: [
            { path: 'nuevo', title: 'Mensajeria', ab: 'CS'},

        ]
    },
    {
        path: '/operador/solicitud',
        title: 'Solicitudes',
    
        type: 'sub',
        icontype: 'motorcycle',
        collapse: 'Reasignaciones',
        children: [
            /* { path: 'hacer-reasignacion', title: 'Reasignar Servicios', ab: 'RS'}, */
            { path: 'lista', title: 'Reajustar Servicios', ab: 'RJS'},
        ]
    }
];