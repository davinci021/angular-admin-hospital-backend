
const getMenuFrontEnd = (role) => {

    const menu = [
        {
          titulo: 'Principal',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Dashboard', url: '/'},
            { titulo: 'Progreso', url: 'progress'},
            { titulo: 'Gráficas', url: 'grafica1'},
            { titulo: 'Perfil', url: 'perfil'},
          ]
    
        },
        {
          titulo: 'Mantenimientos',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            
            { titulo: 'Hospitales', url: 'hospitales'},
            { titulo: 'Medicos', url: 'medicos'},
          ]
        }
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: 'usuarios'})
    }

    return menu;

}

module.exports = {
    getMenuFrontEnd
}