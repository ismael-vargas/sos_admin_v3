/* dispositivos_modal.jsx */
/* -------------------*/
import React from "react";
import PropTypes from "prop-types";

// Componente modal para mostrar información de un dispositivo
function DispositivoModal({ dispositivo, onClose, onDelete, onEdit }) {
  const handleDelete = () => {
    if (window.Swal) {
      window.Swal.fire({
        title: "¿Desea eliminar este dispositivo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          onDelete(dispositivo.id);
          window.Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El dispositivo ha sido eliminado.",
            timer: 1200,
            showConfirmButton: false,
          });
          onClose();
        }
      });
    } else {
      // Fallback si SweetAlert2 no está disponible
      if (window.confirm("¿Desea eliminar este dispositivo?")) {
        onDelete(dispositivo.id);
        onClose();
      }
    }
  };

  const handleEdit = () => {
    onEdit(dispositivo);
    onClose();
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo oscuro translúcido
        display: "flex", // Centrado horizontal y vertical
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 1050, // Encima de otros elementos
      }}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "600px", border: "none", boxShadow: "none" }}
        role="document"
      >
        <div
          className="modal-content"
          style={{
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 4px 24px #00000022",
          }}
        >
          <div
            className="modal-header bg-dark text-white border-0 d-flex flex-column align-items-start"
            style={{ padding: "15px" }}
          >
             <h5
              className="modal-title text-truncate"
              style={{ maxWidth: "100%", fontSize: "15px" }}
            >
              Detalles del Dispositivo: <strong>{dispositivo.nombre}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 top-0 m-3"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body bg-white">
            <div className="text-center mb-3">
              <i className="fas fa-mobile-alt fa-3x text-primary mb-2"></i>
            </div>
            <div className="row g-2 mb-2 justify-content-center">
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm d-flex align-items-center gap-2">
                  {/* Sin ícono */}
                  <div>
                    <div
                      className="text-muted mb-1"
                      style={{ fontSize: ".98rem", fontWeight: 600 }}
                    >
                      ID:
                    </div>
                    <div className="fw-semibold" style={{ fontSize: ".98rem" }}>
                      {dispositivo.id}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm d-flex align-items-center gap-2">
                  {/* Sin ícono */}
                  <div>
                    <div
                      className="text-muted mb-1"
                      style={{ fontSize: ".98rem", fontWeight: 600 }}
                    >
                      ID Cliente:
                    </div>
                    <div className="fw-semibold" style={{ fontSize: ".98rem" }}>
                      {dispositivo.clienteId}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm d-flex align-items-center gap-2">
                  <i className="fas fa-mobile-alt text-primary"></i>
                  <div>
                    <div
                      className="text-muted mb-1"
                      style={{ fontSize: ".98rem", fontWeight: 600 }}
                    >
                      Dispositivo:
                    </div>
                    <div className="fw-semibold" style={{ fontSize: ".98rem" }}>
                      {dispositivo.nombre}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="bg-light rounded-3 p-2 h-100 shadow-sm d-flex align-items-center gap-2">
                  <i className="fas fa-microchip text-secondary"></i>
                  <div>
                    <div
                      className="text-muted mb-1"
                      style={{ fontSize: ".98rem", fontWeight: 600 }}
                    >
                      Tipo:
                    </div>
                    <div className="fw-semibold" style={{ fontSize: ".98rem" }}>
                      {dispositivo.tipoDispositivo}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light justify-content-center">
            <button
              className="btn btn-primary d-flex align-items-center gap-1 me-2"
              onClick={handleEdit}
            >
              <i className="fas fa-edit"></i> Editar Dispositivo
            </button>
            <button
              className="btn btn-danger d-flex align-items-center gap-1"
              onClick={handleDelete}
            >
              <i className="fas fa-trash"></i> Eliminar Dispositivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DispositivoModal.propTypes = {
  dispositivo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    clienteId: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    tipoDispositivo: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default DispositivoModal;
