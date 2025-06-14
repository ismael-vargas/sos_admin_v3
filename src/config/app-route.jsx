import React from 'react';
import App from './../app.jsx';
import Dashboard from './../pages/dashboard/dashboard.jsx';
import Error from './../pages/error/error.jsx';
import Usuarios from '../pages/gestion_usuarios/gestion_usuarios.jsx';
import Ubicaciones from '../pages/ubicaciones/ubicaciones.jsx';
import Rol from '../pages/roles/rol.jsx';
import GestionClientes from '../pages/gestion_clientes/gestion_cliente.jsx';
import InformacionContactosUsuarios from './../pages/informacion de contacto/informacion.jsx';
import InformacionContactosClientes from '../pages/informacion_contactos_clientes/informacion.jsx';
import ContactosEmergencia from '../pages/contactos_emergencia/contactos_emergencia.jsx';
import GestionGrupos from '../pages/grupos/grupos.jsx';
import RespuestaUsuario from '../pages/informes/respuesta_de_usuario.jsx';
import Login from '../pages/Login/login.jsx';
import Registro from '../pages/registro/registro.jsx'
import GestionBoton from '../pages/gestion_boton/gestion_boton.jsx'
import Notificaciones from '../pages/notificaciones/notificaciones.jsx'
import Dispositivos from '../pages/dispositivos/dispositivos.jsx';
import Perfil from '../pages/perfil/perfil.jsx';
import Estadisticas from '../pages/estadisticas/estadisticas.jsx'; 



const AppRoute = [
  {
    path: '*',
    element: <App />,
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'gestion-usuarios', element: <Usuarios /> },
      { path: 'gestion-clientes', element: <GestionClientes /> },
      { path: 'informacion-contacto-usuarios', element: <InformacionContactosUsuarios /> },
      { path: 'informacion-contacto-clientes', element: <InformacionContactosClientes /> },
      { path: 'contactos-emergencia', element: <ContactosEmergencia /> },
      { path: 'rol', element: <Rol /> },
      { path: 'grupos', element: <GestionGrupos /> },
      { path: 'ubicacion', element: <Ubicaciones /> },
      { path: 'gestion-boton', element: <GestionBoton /> },
      { path: 'respuesta-usuario', element: <RespuestaUsuario /> },
      { path: 'notificaciones', element: <Notificaciones/> },
      { path: 'dispositivos', element: <Dispositivos/> },
      { path: 'perfil', element: <Perfil/> },
      { path: '*', element: <Error /> },
      { path: 'estadisticas', element: <Estadisticas/> }, 
    ]
  },
  // Ruta específica para el Login, sin el layout principal
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/registro',
    element: <Registro />
  }
];

export default AppRoute;