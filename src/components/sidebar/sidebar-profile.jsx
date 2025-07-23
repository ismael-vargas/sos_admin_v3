import React, { useContext, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { AppSettings } from "../../config/app-settings.js";
import { slideToggle } from "../../composables/slideToggle.js";
import { logout } from "../../config/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Importar axios
import Swal from "sweetalert2"; // Importar SweetAlert2

function SidebarProfile() {
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

  function handleProfileExpand(e) {
    e.preventDefault();

    var targetSidebar = document.querySelector(".app-sidebar:not(.app-sidebar-end)");
    var targetMenu = e.target.closest(".menu-profile");
    var targetProfile = document.querySelector("#appSidebarProfileMenu");
    var expandTime = targetSidebar && targetSidebar.getAttribute("data-disable-slide-animation") ? 0 : 250;

    if (targetProfile) {
      if (targetProfile.style.display === "block") {
        targetMenu.classList.remove("active");
      } else {
        targetMenu.classList.add("active");
      }
      slideToggle(targetProfile, expandTime);
      targetProfile.classList.toggle("expand");
    }
  }

  async function handleDarkMode(e) {
    const isDarkMode = e.target.checked;
    context.handleSetAppDarkMode(isDarkMode); // Actualiza el estado global de la aplicación

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
        sidebarMinimizado: context.appSidebarMinify // Asumiendo que esta es la preferencia de minimización
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
      
      // Opcional: Mostrar un mensaje de éxito si es necesario, aunque el cambio es visual inmediato
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
  }

  function handleLogout() {
    logout(navigate);
  }

  return (
    <AppSettings.Consumer>
      {({ appSidebarMinify, appDarkMode }) => (
        <div className="menu">
          <div className="menu-profile">
            <a href="/" onClick={handleProfileExpand} className="menu-profile-link">
              <div className="menu-profile-cover with-shadow"></div>
              <div className="menu-profile-image menu-profile-image-icon bg-gray-900 text-gray-600">
                <i className="fa fa-user"></i>
              </div>
              <div className="menu-profile-info">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">Bienvenido</div>
                  <div className="menu-caret ms-auto"></div>
                </div>
                <small></small>
              </div>
            </a>
          </div>
          <div id="appSidebarProfileMenu" className="collapse">
            <div className="menu-item">
              <a href="/perfil" className="menu-link">
                <div className="menu-icon">
                  <i className="fa fa-user"></i>
                </div>
                <div className="menu-text">Perfil</div>
              </a>
            </div>

            <div className="menu-item pt-5px">
              <div className="menu-link">
                <div className="menu-icon">
                  <i className="fa fa-moon"></i>
                </div>
                <div className="menu-text">Modo Oscuro</div>
                <div className="form-check form-switch ms-auto">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="app-theme-dark-mode"
                    onChange={handleDarkMode}
                    id="sidebarDarkMode"
                    checked={appDarkMode}
                    value="1"
                  />
                </div>
              </div>
            </div>

            <div className="menu-divider m-0"></div>

            <div className="menu-item pt-5px">
              <button
                type="button"
                className="menu-link border-0 bg-transparent"
                onClick={handleLogout}
              >
                <div className="menu-icon">
                  <LogOut size={18} aria-hidden="true" />
                </div>
                <div className="menu-text">Cerrar Sesión</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </AppSettings.Consumer>
  );
}

export default SidebarProfile;
