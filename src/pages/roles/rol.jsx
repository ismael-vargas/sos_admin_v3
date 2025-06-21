/* rol.jsx */
/* -------------------*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search } from "lucide-react";
import RolModal from "./rolModal.jsx";
import Swal from "sweetalert2";

const BASE_IMG_URL = "/assets/img/usuario.jpg"; // Ruta de la imagen predeterminada

// Componente para la barra de búsqueda
function Buscador({ busqueda, setBusqueda }) {
  return (
    <div className="input-group" style={{ maxWidth: "400px" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar roles..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <span className="input-group-text">
        <Search size={18} />
      </span>
    </div>
  );
}

// Componente para las tarjetas de rol
function RolCard({ rol, onFlechaClick, onSelectRol, isSelected }) {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div
        className={`card border-0 shadow-sm rounded-3 overflow-hidden ${rol.estado === "eliminado" ? "bg-light text-danger" : ""}`}
        style={{
          transition: rol.estado === "eliminado" ? "none" : "transform 0.2s ease, box-shadow 0.2s ease",
          opacity: rol.estado === "eliminado" ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (rol.estado !== "eliminado") {
            e.currentTarget.style.transform = "scale(1.05)"; // Reducir el zoom
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)"; // Reducir la sombra
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <img
          src={BASE_IMG_URL}
          className="card-img-top"
          alt={`Imagen de ${rol.nombre}`}
          style={{ objectFit: "cover", height: "200px", width: "100%" }}
          loading="lazy"
        />
        <div className="card-body bg-dark text-white text-center">
          <h6 className="card-title mb-2" style={{ fontSize: "1rem" }}>{rol.nombre}</h6>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-primary btn-sm d-flex justify-content-center align-items-center"
              onClick={() => onFlechaClick(rol)}
            >
              Ver Información
            </button>
          </div>
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isSelected}
              onChange={() => onSelectRol(rol.id)}
              id={`select-${rol.id}`}
            />
            <label className="form-check-label" htmlFor={`select-${rol.id}`}></label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal
function Rol() {
  const [busqueda, setBusqueda] = useState("");
  const [roles, setRoles] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoRol, setNuevoRol] = useState({ nombre: "", usuario_id: "" });

  // Obtener roles desde el backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:9000/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error al obtener los roles:", error.message);
      }
    };

    fetchRoles();
  }, []);

  const rolesFiltrados = roles.filter((rol) =>
    rol.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminarRolesSeleccionados = async () => {
    const csrfToken = localStorage.getItem("csrfToken"); // Asegúrate de que el token esté almacenado

    try {
      for (const id of rolesSeleccionados) {
        await axios.delete(`http://localhost:9000/roles/${id}`, {
          headers: {
            "CSRF-Token": csrfToken, // Enviar el token CSRF en el encabezado
          },
          withCredentials: true, // Asegúrate de enviar las cookies
        });
      }
      setRoles((prevRoles) =>
        prevRoles.filter((rol) => !rolesSeleccionados.includes(rol.id))
      );
      setRolesSeleccionados([]);

      Swal.fire({
        icon: "success",
        title: "¡Roles eliminados!",
        text: "Los roles seleccionados han sido eliminados correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar roles:", error.message);

      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: "Hubo un error al eliminar los roles. Por favor, inténtelo de nuevo.",
      });
    }
  };

  const handleSelectRol = (id) => {
    setRolesSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((rolId) => rolId !== id)
        : [...prevSeleccionados, id]
    );
  };

  const handleAbrirModal = (rol) => {
    setRolSeleccionado(rol);
  };

  const handleCerrarModal = () => {
    setRolSeleccionado(null);
  };

const handleGuardarRol = async (rolEditado) => {
  // Guardar copia del estado original por si falla
  const rolOriginal = roles.find(r => r.id === rolEditado.id);
  
  // 1. Actualización optimista (UI primero)
  setRoles(prev => prev.map(r => r.id === rolEditado.id ? rolEditado : r));
  setRolSeleccionado(null);

  try {
    // 2. Llamada al backend (en segundo plano)
    await axios.put(`http://localhost:9000/roles/${rolEditado.id}`, rolEditado, {
      headers: { "CSRF-Token": localStorage.getItem("csrfToken") },
      withCredentials: true
    });

    // 3. (Opcional) Verificación con el backend
    const { data } = await axios.get(`http://localhost:9000/roles/${rolEditado.id}`);
    setRoles(prev => prev.map(r => r.id === data.id ? data : r));

  } catch (error) {
    console.error("Error:", error);
    // Revertir si hay error
    setRoles(prev => prev.map(r => r.id === rolOriginal.id ? rolOriginal : r));
    Swal.fire("Error", "No se pudo guardar", "error");
  }
};

  const handleAgregarRol = async () => {
    const csrfToken = localStorage.getItem("csrfToken"); // Asegúrate de que el token esté almacenado

    try {
      const response = await axios.post(
        "http://localhost:9000/roles",
        nuevoRol,
        {
          headers: {
            "CSRF-Token": csrfToken, // Enviar el token CSRF en el encabezado
          },
          withCredentials: true, // Asegúrate de enviar las cookies
        }
      );
      setRoles((prevRoles) => [response.data, ...prevRoles]);
      setNuevoRol({ nombre: "", usuario_id: "" });
      setMostrarFormulario(false);

      Swal.fire({
        icon: "success",
        title: "¡Rol agregado!",
        text: "El rol se ha agregado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al agregar el rol:", error.message);

      Swal.fire({
        icon: "error",
        title: "Error al agregar",
        text: "Hubo un error al agregar el rol. Por favor, inténtelo de nuevo.",
      });
    }
  };

  return (
    <div>
      <h1 className="page-header">
        Gestión de Roles <small>administración de roles</small>
      </h1>
      <Panel>
        <PanelHeader>
          <h4 className="panel-title">Gestión de Roles</h4>
        </PanelHeader>
        <PanelBody>
          <div className="row mb-3">
            <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-danger"
                  onClick={handleEliminarRolesSeleccionados}
                  disabled={rolesSeleccionados.length === 0}
                >
                  <i className="bi bi-trash"></i> Eliminar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setMostrarFormulario(true)}
                >
                  <i className="bi bi-plus-circle"></i> Agregar Rol
                </button>
              </div>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {rolesFiltrados.map((rol) => (
              <RolCard
                key={rol.id}
                rol={rol}
                onFlechaClick={handleAbrirModal}
                onSelectRol={handleSelectRol}
                isSelected={rolesSeleccionados.includes(rol.id)}
              />
            ))}
          </div>
        </PanelBody>
      </Panel>

      {rolSeleccionado && (
        <RolModal
          rol={rolSeleccionado}
          onClose={handleCerrarModal}
          onSave={handleGuardarRol}
        />
      )}

      {mostrarFormulario && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Rol</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarFormulario(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre del Rol</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoRol.nombre}
                    onChange={(e) => setNuevoRol({ ...nuevoRol, nombre: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">ID del Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoRol.usuario_id}
                    onChange={(e) => setNuevoRol({ ...nuevoRol, usuario_id: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAgregarRol}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rol;
