/*cliente_modal.jsx */
/* -------------------*/
import React, { useState } from "react";
import PropTypes from "prop-types";

const BASE_IMG_URL = "/assets/img/"; // URL base para las imágenes del cliente

function ClienteModal({ cliente, onClose }) {
  // Estado inicial del cliente, si no se encuentra, se asigna "Activo"
  const [estado, setEstado] = useState(cliente.estado || "Activo");
  const [editandoEstado, setEditandoEstado] = useState(false); // Estado para habilitar/deshabilitar la edición del estado

  // Maneja el cambio de estado en el formulario
  const handleEstadoChange = (e) => setEstado(e.target.value);

  // Guarda el estado cuando el usuario termina de editar
  const guardarEstado = () => {
    alert(`Estado guardado como: ${estado}`);
    setEditandoEstado(false); // Se detiene la edición
  };

  // Cierra el modal y simula la eliminación del cliente
  const cerrarModal = () => {
    alert("Cliente eliminado");
    onClose(); // Llama la función onClose pasada por la prop
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} // Fondo oscuro para el modal
    >
      <div
        className="modal-dialog modal-xl"
        style={{ maxWidth: "960px" }} // Ancho máximo del modal
        role="document"
      >
        <div className="modal-content">
          {/* Cabecera del Modal */}
          <div className="modal-header bg-dark text-white border-0">
            <h5
              className="modal-title text-truncate"
              style={{ maxWidth: "100%", fontSize: "14px" }}
            >
              {/* Muestra el nombre del cliente en el encabezado */}
              Detalles del Cliente: <strong>{cliente.nombre}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose} // Llama a la función onClose pasada por la prop para cerrar el modal
            ></button>
          </div>

          {/* Cuerpo del Modal */}
          <div className="modal-body bg-white">
            {/* Imagen del Cliente */}
            <div className="text-center mb-4">
              <img
                src={`${BASE_IMG_URL}${cliente.imagen}`}
                alt={`Imagen de ${cliente.nombre}`}
                className="rounded-circle shadow"
                style={{
                  objectFit: "cover",
                  width: "220px", // Tamaño de la imagen
                  height: "220px", // Mantén el tamaño circular
                }}
                loading="lazy"
              />
            </div>

            {/* Vista en filas (para todos los dispositivos, no solo móviles) */}
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">ID:</div>
              <div className="col-6">{cliente.id}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Nombre:</div>
              <div className="col-6">{cliente.nombre}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Correo:</div>
              <div className="col-6">{cliente.correo || "N/A"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Teléfono:</div>
              <div className="col-6">{cliente.telefono || "N/A"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Cédula:</div>
              <div className="col-6">{cliente.cedula || "N/A"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Dirección:</div>
              <div className="col-6">{cliente.direccion || "N/A"}</div>
            </div>
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

          </div>

          {/* Footer del Modal */}
          <div className="modal-footer bg-light justify-content-center">
            {!editandoEstado ? (
              <button
                className="btn btn-primary me-2"
                onClick={() => setEditandoEstado(true)} // Activa la edición del estado
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
            <button
              className="btn btn-danger"
              onClick={cerrarModal} // Llama a la función cerrarModal
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

// Definición de las props que el componente espera recibir
ClienteModal.propTypes = {
  cliente: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    correo: PropTypes.string,
    telefono: PropTypes.string,
    cedula: PropTypes.string,
    direccion: PropTypes.string,
    estado: PropTypes.string,
    tipo: PropTypes.string,
    imagen: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired, // Función para cerrar el modal
};

export default ClienteModal;
