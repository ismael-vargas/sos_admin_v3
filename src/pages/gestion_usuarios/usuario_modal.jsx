import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2"; // Importamos SweetAlert2
import "../../assets/scss/usuario_modal.scss";

const DEFAULT_IMG = "/assets/img/foto3.jpg"; // Imagen por defecto si no hay imagen definida

// Mapeo del estado que viene del backend ("activo", "eliminado") a texto legible
const mapEstadoBackToFront = (estadoBack) =>
  estadoBack === "eliminado" ? "Inactivo" : "Activo";

// Mapeo del estado del frontend ("Activo", "Inactivo") al formato del backend
const mapEstadoFrontToBack = (estadoFront) =>
  estadoFront === "Inactivo" ? "eliminado" : "activo";

// Componente del modal
function UsuarioModal({ usuario, onClose, onEstadoActualizado }) {
  const [estado, setEstado] = useState(mapEstadoBackToFront(usuario.estado || "activo"));
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Obtener token CSRF al cargar el componente
  useEffect(() => {
    axios
      .get("http://localhost:9000/csrf-token", { withCredentials: true })
      .then((res) => setCsrfToken(res.data.csrfToken))
      .catch((err) => console.error("Error al obtener CSRF token:", err));
  }, []);

  // Actualizar el estado temporal mientras se edita
  const handleEstadoChange = (e) => setEstado(e.target.value);

  // Guardar el estado en el backend
  const guardarEstado = async () => {
    const estadoParaBackend = mapEstadoFrontToBack(estado);

    try {
      await axios.put(
        `http://localhost:9000/usuarios/${usuario.id}`,
        { estado: estadoParaBackend },
        {
          headers: {
            "csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (estadoParaBackend === "eliminado") {
        Swal.fire({
          icon: "info",
          title: "Usuario Inactivado",
          text: `El usuario ${usuario.nombre} ha sido marcado como inactivo.`,
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Usuario Activado",
          text: `El usuario ${usuario.nombre} está activo.`,
          confirmButtonText: "OK",
        });
      }

      // Actualizamos el estado en tiempo real
      if (onEstadoActualizado) {
        onEstadoActualizado(usuario.id, estadoParaBackend);
      }

      setEditandoEstado(false);
      onClose();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al actualizar el estado.",
      });
    }
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          {/* Header del modal */}
          <div className="modal-header bg-dark text-white border-0">
            <h5 className="modal-title">
              Detalles del Usuario: <strong>{usuario.nombre}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Cuerpo del modal */}
          <div className="modal-body bg-white">
            <div className="text-center mb-4">
              <img
                src={usuario.imagen ? `/assets/img/${usuario.imagen}` : DEFAULT_IMG}
                alt={`Imagen de ${usuario.nombre}`}
                className="rounded-circle shadow"
                style={{ width: "220px", height: "220px", objectFit: "cover" }}
                loading="lazy"
              />
            </div>

            {/* Detalles */}
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">ID:</div>
              <div className="col-6">{usuario.id}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Nombre:</div>
              <div className="col-6">{usuario.nombre}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Correo:</div>
              <div className="col-6">{usuario.correo_electronico || "N/A"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Cédula:</div>
              <div className="col-6">{usuario.cedula_identidad || "N/A"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Dirección:</div>
              <div className="col-6">{usuario.direccion || "N/A"}</div>
            </div>

            {/* Estado con selector */}
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Estado:</div>
              <div className="col-6">
                {!editandoEstado ? (
                  <span className={`badge ${estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                    {estado}
                  </span>
                ) : (
                  <select className="form-select" value={estado} onChange={handleEstadoChange}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                )}
              </div>
            </div>

            {/* Rol del usuario */}
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Rol:</div>
              <div className="col-6">{usuario.rol || "N/A"}</div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="modal-footer bg-light justify-content-center">
            {!editandoEstado ? (
              <button className="btn btn-primary me-2" onClick={() => setEditandoEstado(true)}>
                <i className="fas fa-edit me-1"></i> Editar Estado
              </button>
            ) : (
              <button className="btn btn-primary me-2" onClick={guardarEstado}>
                <i className="fas fa-save me-1"></i> Guardar Estado
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              <i className="fas fa-times me-1"></i> Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Validación de props
UsuarioModal.propTypes = {
  usuario: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    correo_electronico: PropTypes.string,
    cedula_identidad: PropTypes.string,
    direccion: PropTypes.string,
    estado: PropTypes.string,
    rol: PropTypes.string,
    imagen: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onEstadoActualizado: PropTypes.func.isRequired, // Nueva prop
};

export default UsuarioModal;
