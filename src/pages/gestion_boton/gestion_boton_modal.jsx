/* gestion_boton_modal.jsx */
/* -------------------*/
import React from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

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
  const ubicacionAleatoria = obtenerUbicacionAleatoria();
  const marcaTiempoAleatoria = obtenerMarcaTiempoAleatoria();

  const handleEliminar = () => {
    Swal.fire({
      title: "¿Desea eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El registro ha sido eliminado.",
          timer: 1200,
          showConfirmButton: false,
        });
        onClose();
      }
    });
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div className="modal-dialog" style={{ maxWidth: 500 }} role="document">
        <div
          className="modal-content"
          style={{
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 4px 24px #00000022",
          }}
        >
          {/* Header */}
          <div
            className="modal-header bg-dark text-white border-0 d-flex flex-column align-items-start"
            style={{ padding: "15px" }}
          >
            <h5 className="modal-title" style={{ fontSize: "15px" }}>
              Informe botón de Emergencia:{" "}
              <strong>{usuario.nombre}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 top-0 m-3"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body bg-white">
            <div className="text-center mb-3">
              <img
                src="/assets/img/boton.jpg"
                alt="Botón de emergencia"
                className="rounded-circle shadow"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "cover",
                  border: "3px solid #e0e0e0",
                }}
                loading="lazy"
              />
            </div>
            <h4
              className="text-center fw-bold mb-3"
              style={{ fontSize: "1.08rem" }}
            >
              {usuario.nombre}
            </h4>
            <div className="row g-2 mb-2">
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm">
                  <div
                    className="text-muted mb-1"
                    style={{ fontSize: ".98rem", fontWeight: 600 }}
                  >
                    ID:
                  </div>
                  <div
                    className="fw-semibold"
                    style={{ fontSize: ".98rem" }}
                  >
                    {usuario.id}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm d-flex align-items-center gap-2">
                  <div
                    className="text-muted mb-1 d-flex align-items-center"
                    style={{ fontSize: ".98rem", fontWeight: 600 }}
                  >
                    <i className="fas fa-map-marker-alt text-danger me-2"></i>
                    Ubicación:
                  </div>
                  <div
                    className="fw-semibold"
                    style={{ fontSize: ".98rem" }}
                  >
                    {ubicacionAleatoria}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm d-flex flex-column align-items-center justify-content-center">
                  <div className="text-muted mb-1 d-flex align-items-center justify-content-center w-100" style={{ fontSize: ".98rem", fontWeight: 600 }}>
                    <i className="far fa-clock text-primary me-2"></i>
                    Marca de Tiempo:
                  </div>
                  <div className="fw-semibold text-center w-100" style={{ fontSize: ".98rem" }}>
                    {marcaTiempoAleatoria}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light justify-content-center">
            <button
              className="btn btn-danger"
              onClick={handleEliminar}
              style={{ fontSize: "15px" }}
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
