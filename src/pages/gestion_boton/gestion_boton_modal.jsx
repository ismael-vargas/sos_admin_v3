/* gestion_boton_modal.jsx */
/* -------------------*/
import React from "react";
import PropTypes from "prop-types";

// Lista de ubicaciones de ejemplo en Quito
const ubicacionesQuito = [
  "La Carolina",
  "Centro Histórico",
  "El Panecillo",
  "Cumbayá",
  "Los Chillos",
  "Mariscal Sucre",
  "Quitumbe",
  "La Mariscal",
  "Guápulo",
  "El Condado",
  "San Blas",
];

// Función para seleccionar una ubicación aleatoria
const obtenerUbicacionAleatoria = () =>
  ubicacionesQuito[Math.floor(Math.random() * ubicacionesQuito.length)];

// Función para generar una marca de tiempo aleatoria
const obtenerMarcaTiempoAleatoria = () => {
  const ahora = new Date(); // Fecha actual
  const diasAtras = Math.floor(Math.random() * 30); // Número aleatorio de días atrás
  const fechaAleatoria = new Date(ahora);
  fechaAleatoria.setDate(ahora.getDate() - diasAtras); // Restar días a la fecha actual

  // Opciones de formato para la fecha
  const opciones = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return fechaAleatoria.toLocaleString("es-EC", opciones); // Convertir a cadena legible
};

/**
 * Modal que muestra detalles del uso de un botón de emergencia.
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.usuario - Información del usuario seleccionada.
 * @param {Function} props.onClose - Función para cerrar el modal.
 */
function BotonModal({ usuario, onClose }) {
  const ubicacionAleatoria = obtenerUbicacionAleatoria(); // Obtener ubicación aleatoria
  const marcaTiempoAleatoria = obtenerMarcaTiempoAleatoria(); // Obtener marca de tiempo aleatoria

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} // Fondo oscuro semitransparente
    >
      <div
        className="modal-dialog modal-xl"
        style={{ maxWidth: "960px" }} // Tamaño del modal
        role="document"
      >
        <div className="modal-content">
          {/* Cabecera del modal */}
          <div className="modal-header bg-dark text-white border-0">
            <h5
              className="modal-title text-truncate"
              style={{ maxWidth: "100%", fontSize: "14px" }}
            >
              Detalles del Uso del Botón de Emergencia: <strong>{usuario.nombre}</strong>
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
            {/* Información del usuario en filas */}
            <div
              className="d-flex flex-column gap-3"
              style={{
                fontSize: "15px",
                paddingLeft: "20px", // Asegura que todo quede alineado a la izquierda
              }}
            >
              {/* Cada fila contiene una etiqueta y su valor */}
              <div className="d-flex">
                <strong className="me-3">ID:</strong> {/* Etiqueta */}
                <span>{usuario.id}</span> {/* Valor */}
              </div>
              <div className="d-flex">
                <strong className="me-3">Cliente:</strong> {/* Etiqueta */}
                <span>{usuario.nombre}</span> {/* Valor */}
              </div>
              <div className="d-flex">
                <strong className="me-3">Ubicación:</strong> {/* Etiqueta */}
                <span>{ubicacionAleatoria}</span> {/* Valor */}
              </div>
              <div className="d-flex">
                <strong className="me-3">Marca de Tiempo:</strong> {/* Etiqueta */}
                <span>{marcaTiempoAleatoria}</span> {/* Valor */}
              </div>
            </div>
          </div>

          {/* Pie de página del modal */}
          <div className="modal-footer bg-light justify-content-center">
            {/* Botón de eliminación */}
            <button
              className="btn btn-danger"
              onClick={() => {
                console.log("Eliminando al usuario", usuario.id); // Simula la eliminación del usuario
                onClose(); // Cierra el modal
              }}
              style={{ fontSize: "16px" }}
            >
              <i className="fas fa-trash me-1"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Validación de propiedades con PropTypes
BotonModal.propTypes = {
  usuario: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ID del usuario
    nombre: PropTypes.string.isRequired, // Nombre del usuario
  }).isRequired,
  onClose: PropTypes.func.isRequired, // Función para cerrar el modal
};

export default BotonModal;
