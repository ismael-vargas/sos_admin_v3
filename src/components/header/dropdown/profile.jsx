import React, { useContext, useEffect, useState } from "react";
import { UserCircle, LogOut, Moon } from "lucide-react";
import { AppSettings } from "../../../config/app-settings.js";
import { logout } from "../../../config/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Importar axios
import Swal from "sweetalert2"; // Importar SweetAlert2

function DropdownProfile() {
  const context = useContext(AppSettings);
  const navigate = useNavigate();
  const [usuarioId, setUsuarioId] = useState(null); // Estado para almacenar el usuarioId
  // Nuevo estado para almacenar las preferencias del usuario
  const [userPreferences, setUserPreferences] = useState(null); 

  // Obtener usuarioId del localStorage al montar el componente
  useEffect(() => {
    const id = localStorage.getItem("usuario_id");
    if (id) {
      setUsuarioId(id);
    }
  }, []);

  // Nuevo useEffect para cargar las preferencias del usuario al montar el componente
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!usuarioId) return; // No intentar cargar si no hay ID de usuario

      const csrfToken = localStorage.getItem("csrfToken");
      if (!csrfToken) {
        console.warn("CSRF token no disponible al cargar preferencias.");
        return;
      }

      try {
        // Ruta GET para obtener las preferencias del usuario
        const response = await axios.get(
          `http://localhost:1000/usuarios/preferencias/listar/${usuarioId}`, 
          {
            headers: {
              "CSRF-Token": csrfToken,
            },
            withCredentials: true,
          }
        );
        // Almacenar las preferencias obtenidas
        setUserPreferences(response.data.preferencias); 
        // Si hay preferencias y un tema guardado, actualizar el modo oscuro de la app
        if (response.data.preferencias && response.data.preferencias.tema) {
          context.handleSetAppDarkMode(response.data.preferencias.tema === 'oscuro');
        }
      } catch (error) {
        // Si las preferencias no se encuentran (404), es la primera vez, no es un error crítico
        if (error.response && error.response.status === 404) {
          console.info("No se encontraron preferencias para el usuario. Se crearán al primer cambio.");
          setUserPreferences(null); // Asegurarse de que el estado sea nulo si no se encuentran
        } else {
          console.error("Error al cargar preferencias del usuario:", error.response?.data?.message || error.message);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las preferencias del usuario.",
          });
        }
      }
    };

    fetchUserPreferences();
  }, [usuarioId, context]); // Depende de usuarioId y context para recargar si cambian

  const handleDarkMode = async (e) => {
    const isDarkMode = e.target.checked;
    context.handleSetAppDarkMode(isDarkMode); // Actualiza el estado global de la aplicación inmediatamente

    if (!usuarioId) {
      console.warn("Usuario no identificado para guardar preferencias.");
      return;
    }

    const csrfToken = localStorage.getItem("csrfToken");
    if (!csrfToken) {
      Swal.fire({
        icon: "error",
        title: "Error de seguridad",
        text: "Token CSRF no disponible. Recargue la página.",
      });
      // Revertir el estado del toggle si no hay token
      context.handleSetAppDarkMode(!isDarkMode);
      return;
    }

    try {
      const preferenceData = { 
        tema: isDarkMode ? 'oscuro' : 'claro',
        // Si tu backend espera sidebarMinimizado, asegúrate de pasarlo también
        // Por ejemplo: sidebarMinimizado: context.appSidebarMinify 
      };

      if (userPreferences) {
        // Si las preferencias ya existen, actualizarlas (PUT)
        await axios.put(
          `http://localhost:1000/usuarios/preferencias/actualizar/${usuarioId}`, // Ruta PUT corregida
          preferenceData,
          {
            headers: {
              "CSRF-Token": csrfToken,
            },
            withCredentials: true,
          }
        );
        console.log("Preferencia de modo oscuro actualizada.");
      } else {
        // Si no existen preferencias, crearlas (POST)
        await axios.post(
          `http://localhost:1000/usuarios/preferencias/registrar/${usuarioId}`, // Ruta POST para registrar
          preferenceData,
          {
            headers: {
              "CSRF-Token": csrfToken,
            },
            withCredentials: true,
          }
        );
        console.log("Preferencia de modo oscuro registrada por primera vez.");
        // Actualizar el estado local de preferencias para futuras actualizaciones
        setUserPreferences(preferenceData); 
      }
      
      // Opcional: Mostrar un mensaje de éxito si es necesario
      // Swal.fire({
      //   icon: "success",
      //   title: "Preferencia guardada",
      //   text: "El modo oscuro ha sido actualizado.",
      //   timer: 1500,
      //   showConfirmButton: false,
      // });

    } catch (error) {
      console.error("Error al guardar preferencia de modo oscuro:", error.response?.data?.message || error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la preferencia del modo oscuro.",
      });
      // Revertir el estado del toggle si la API falla
      context.handleSetAppDarkMode(!isDarkMode);
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <AppSettings.Consumer>
      {({ appDarkMode }) => (
        <div className="navbar-item navbar-user dropdown">
          <button
            type="button"
            className="navbar-link dropdown-toggle d-flex align-items-center border-0 bg-transparent"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div className="image image-icon bg-gray-800 text-gray-600">
              <i className="fa fa-user" aria-hidden="true"></i>
            </div>
            <span>
              <span className="d-none d-md-inline">Administrador</span>
            </span>
          </button>
          <div className="dropdown-menu dropdown-menu-end me-1" role="menu">
            <a href="/perfil" className="dropdown-item d-flex align-items-center gap-2">
              <UserCircle size={18} aria-hidden="true" />
              <span>Perfil</span>
            </a>

            <div className="dropdown-divider"></div>

            <div className="dropdown-item d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Moon size={18} aria-hidden="true" />
                <span>Modo Oscuro</span>
              </div>
              <div className="form-check form-switch ms-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={handleDarkMode}
                  checked={appDarkMode}
                  id="headerDarkMode"
                  aria-label="Activar modo oscuro"
                />
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <button
              type="button"
              className="dropdown-item d-flex align-items-center gap-2 border-0 bg-transparent"
              onClick={handleLogout}
            >
              <LogOut size={18} aria-hidden="true" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </AppSettings.Consumer>
  );
}

export default DropdownProfile;
