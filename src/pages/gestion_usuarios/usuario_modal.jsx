/*usuario_modal.jsx */
/* -------------------*/
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../assets/scss/usuario_modal.scss";

// Base URL para las imágenes de los usuarios
const BASE_IMG_URL = "/assets/img/";

function UsuarioModal({ usuario, onClose }) {
  // Estado para manejar el estado del usuario (Activo/Inactivo)
  const [estado, setEstado] = useState(usuario.estado || "Activo");
  // Estado para determinar si se está editando el estado del usuario
  const [editandoEstado, setEditandoEstado] = useState(false);

  // Función para manejar cambios en el estado del usuario
  const handleEstadoChange = (e) => setEstado(e.target.value);

  // Función para guardar el estado actualizado del usuario
  const guardarEstado = () => {
    alert(`Estado guardado como: ${estado}`);
    setEditandoEstado(false);
  };

  // Función para cerrar el modal y eliminar al usuario
  const cerrarModal = () => {
    alert("Usuario eliminado");
    onClose();
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div
        className="modal-dialog modal-xl"
        style={{ maxWidth: "960px" }}
        role="document"
      >
        <div className="modal-content">
          {/* Encabezado del modal */}
          <div className="modal-header bg-dark text-white border-0">
            <h5
              className="modal-title text-truncate"
              style={{ maxWidth: "100%", fontSize: "14px" }}
            >
              Detalles del Usuario: <strong>{usuario.nombre}</strong>
            </h5>
            {/* Botón para cerrar el modal */}
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Cuerpo del modal */}
          <div className="modal-body bg-white">
            {/* Imagen del usuario */}
            <div className="text-center mb-4">
              <img
                src={`${BASE_IMG_URL}${usuario.imagen}`}
                alt={`Imagen de ${usuario.nombre}`}
                className="rounded-circle shadow"
                style={{
                  objectFit: "cover",
                  width: "220px", // Tamaño circular
                  height: "220px", // Tamaño circular
                }}
                loading="lazy"
              />
            </div>

            {/* Información en formato de filas (responsivo) */}
            <div>
              {/* Fila: ID */}
              <div className="row mb-2">
                <div className="col-6 text-end fw-bold">ID:</div>
                <div className="col-6">{usuario.id}</div>
              </div>
              {/* Fila: Nombre */}
              <div className="row mb-2">
                <div className="col-6 text-end fw-bold">Nombre:</div>
                <div className="col-6">{usuario.nombre}</div>
              </div>
              {/* Fila: Correo */}
              <div className="row mb-2">
                <div className="col-6 text-end fw-bold">Correo:</div>
                <div className="col-6">{usuario.correo || "N/A"}</div>
              </div>
              {/* Fila: Teléfono */}
              <div className="row mb-2">
                <div className="col-6 text-end fw-bold">Teléfono:</div>
                <div className="col-6">{usuario.telefono || "N/A"}</div>
              </div>
              {/* Fila: Cédula */}
              <div className="row mb-2">
                <div className="col-6 text-end fw-bold">Cédula:</div>
                <div className="col-6">{usuario.cedula || "N/A"}</div>
              </div>
              {/* Fila: Dirección */}
              <div className="row mb-2">
                <div className="col-6 text-end fw-bold">Dirección:</div>
                <div className="col-6">{usuario.direccion || "N/A"}</div>
              </div>
              {/* Fila: Estado */}
              <div className="row mb-2">
                <div className="col-6 text-end fw-bold">Estado:</div>
                <div className="col-6">
                  {!editandoEstado ? (
                    <span className="badge bg-primary">{estado}</span>
                  ) : (
                    <select
                      className="form-select"
                      value={estado}
                      onChange={handleEstadoChange}
                      style={{ fontSize: "16px" }}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  )}
                </div>
              </div>
              {/* Fila: Rol */}
              <div className="row mb-2">
                <div className="col-6 text-end fw-bold">Rol:</div>
                <div className="col-6">{usuario.rol || "1"}</div>
              </div>
            </div>
          </div>

          {/* Pie del modal */}
          <div className="modal-footer bg-light justify-content-center">
            {/* Botón para editar estado */}
            {!editandoEstado ? (
              <button
                className="btn btn-primary me-2"
                onClick={() => setEditandoEstado(true)}
                style={{ fontSize: "16px" }}
              >
                <i className="fas fa-edit me-1"></i> Editar Estado
              </button>
            ) : (
              <button
                className="btn btn-primary me-2"
                onClick={guardarEstado}
                style={{ fontSize: "16px" }}
              >
                <i className="fas fa-save me-1"></i> Guardar Estado
              </button>
            )}
            {/* Botón para eliminar usuario */}
            <button
              className="btn btn-danger"
              onClick={cerrarModal}
              style={{ fontSize: "16px" }}
            >
              <i className="fas fa-trash-alt me-1"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Validación de las propiedades que recibe el componente
UsuarioModal.propTypes = {
  usuario: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    correo: PropTypes.string,
    telefono: PropTypes.string,
    cedula: PropTypes.string,
    direccion: PropTypes.string,
    estado: PropTypes.string,
    rol: PropTypes.string,
    imagen: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UsuarioModal;
