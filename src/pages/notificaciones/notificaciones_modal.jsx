/* notificaciones_modal.jsx */
/* -------------------*/
import React from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Componente modal para mostrar detalles de una notificación
function NotificacionModal({ notificacion, onClose, onDelete }) {
  // Función para confirmar eliminación con SweetAlert
  const confirmarEliminacion = () => {
    Swal.fire({
      title: "¿Desea eliminar esta alerta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La alerta ha sido eliminada.",
          timer: 1200,
          showConfirmButton: false,
        });
        onClose();
      }
    });
  };

  return (
    // Modal contenedor centrado en la pantalla con fondo oscuro
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo oscuro con opacidad para el modal
        display: "flex", // Flexbox para centrar el modal
        justifyContent: "center", // Centrado horizontal
        alignItems: "center", // Centrado vertical
      }}
    >
      <div className="modal-dialog" style={{ maxWidth: 600 }} role="document">
        <div
          className="modal-content"
          style={{
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 4px 24px #00000022",
          }}
        >
          {/* Header */}
          <div className="modal-header bg-dark text-white border-0 d-flex flex-column align-items-start" style={{ padding: "15px" }}>
            <h5 className="modal-title text-truncate" style={{ maxWidth: "100%", fontSize: "16px" }}>
              Detalles de Notificación: <strong>{notificacion.presionBotonId}</strong>
            </h5>
            {/* Botón para cerrar el modal */}
            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 top-0 m-3"
              aria-label="Close"
              onClick={onClose} // Llama a la función onClose cuando se hace clic
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body bg-white">
            <div className="row g-2 mb-2">
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm">
                  <div className="text-muted mb-1" style={{ fontSize: ".98rem", fontWeight: 600 }}>
                    ID:
                  </div>
                  <div className="fw-semibold" style={{ fontSize: ".98rem" }}>{notificacion.id}</div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm">
                  <div className="text-muted mb-1" style={{ fontSize: ".98rem", fontWeight: 600 }}>
                    <i className="fas fa-hand-pointer me-2 text-primary"></i>Presión Botón ID:
                  </div>
                  <div className="fw-semibold" style={{ fontSize: ".98rem" }}>{notificacion.presionBotonId}</div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm">
                  <div className="text-muted mb-1" style={{ fontSize: ".98rem", fontWeight: 600 }}>
                    <i className="fas fa-user me-2 text-success"></i>Cliente Notificado ID:
                  </div>
                  <div className="fw-semibold" style={{ fontSize: ".98rem" }}>{notificacion.clienteNotificadoId}</div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm">
                  <div className="text-muted mb-1" style={{ fontSize: ".98rem", fontWeight: 600 }}>
                    <i className="fas fa-bell me-2 text-warning"></i>Notificaciones Recibidas:
                  </div>
                  <div className="fw-semibold" style={{ fontSize: ".98rem" }}>{notificacion.notificacionesRecibidas}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light justify-content-center">
            {/* Botón para eliminar la notificación */}
            <button
              className="btn btn-danger"
              onClick={confirmarEliminacion}
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

// PropTypes para validar las props del componente
NotificacionModal.propTypes = {
  notificacion: PropTypes.shape({
    id: PropTypes.number.isRequired, // ID de la notificación
    presionBotonId: PropTypes.string.isRequired, // ID del botón presionado
    clienteNotificadoId: PropTypes.string.isRequired, // ID del cliente notificado
    notificacionesRecibidas: PropTypes.number.isRequired, // Número de notificaciones recibidas
  }).isRequired,
  onClose: PropTypes.func.isRequired, // Función para cerrar el modal
  onDelete: PropTypes.func.isRequired, // Función para eliminar la notificación
};

export default NotificacionModal;
