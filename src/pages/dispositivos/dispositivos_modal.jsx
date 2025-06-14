/* dispositivos_modal.jsx */
/* -------------------*/
import React from "react";
import PropTypes from "prop-types";

// Componente modal para mostrar información de un dispositivo
function DispositivoModal({ dispositivo, onClose, onDelete, onEdit }) {
  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este dispositivo?")) {
      onDelete(dispositivo.id); // Llama a la función de eliminación
    }
    onClose(); // Cierra el modal después de eliminar
  };

  const handleEdit = () => {
    onEdit(dispositivo); // Llama a la función de edición
    onClose(); // Cierra el modal después de editar
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
        style={{
          maxWidth: "850px", // Ancho máximo
          border: "none",
          boxShadow: "none",
        }}
        role="document"
      >
        <div
          className="modal-content"
          style={{
            border: "none",
            boxShadow: "none",
          }}
        >
          <div
            className="modal-header bg-dark text-white border-0"
            style={{ padding: "15px" }}
          >
            <h5 className="modal-title">
              Detalles del Dispositivo: <strong>{dispositivo.nombre}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body bg-white" style={{ padding: "20px" }}>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <th style={{ textAlign: "left", width: "35%" }}>ID:</th>
                  <td style={{ textAlign: "left" }}>{dispositivo.id}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", width: "35%" }}>ID Cliente:</th>
                  <td style={{ textAlign: "left" }}>{dispositivo.clienteId}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", width: "35%" }}>Dispositivo:</th>
                  <td style={{ textAlign: "left" }}>{dispositivo.nombre}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", width: "35%" }}>Tipo:</th>
                  <td style={{ textAlign: "left" }}>{dispositivo.tipoDispositivo}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="modal-footer bg-light d-flex justify-content-center">
            <button
              className="btn btn-primary me-2"
              onClick={handleEdit}
            >
              Editar Dispositivo
            </button>
            <button
              className="btn btn-danger me-2"
              onClick={handleDelete}
            >
              Eliminar Dispositivo
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
