import React, { useContext } from "react";
import { UserCircle, LogOut, Moon } from "lucide-react";
import { AppSettings } from "../../../config/app-settings.js";
import { logout } from "../../../config/auth";
import { useNavigate } from "react-router-dom"; // Para redirigir al login

function DropdownProfile() {
  const context = useContext(AppSettings);
  const navigate = useNavigate(); // Inicializa navigate

  const handleDarkMode = (e) => {
    context.handleSetAppDarkMode(e.target.checked);
  };

  const handleLogout = () => {
    logout(navigate); // Llama a la función logout
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
              onClick={handleLogout} // Llama a la función handleLogout
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