/* notificaciones_modal.jsx */
/* -------------------*/
import React from "react";
import PropTypes from "prop-types";

// Componente modal para mostrar detalles de una notificación
function NotificacionModal({ notificacion, onClose, onDelete }) {
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
      <div
        className="modal-dialog"
        style={{
          maxWidth: "600px", // Tamaño máximo del modal
          borderRadius: "0px", // Sin bordes redondeados
          overflow: "hidden", // Evitar desbordamiento del contenido
          border: "none", // Sin bordes alrededor del modal
        }}
        role="document"
      >
        <div
          className="modal-content"
          style={{
            border: "none", // Sin bordes para el contenido
            boxShadow: "none", // Sin sombras
          }}
        >
          {/* Encabezado del modal */}
          <div className="modal-header bg-dark text-white border-0" style={{ padding: "15px" }}>
            <h5
              className="modal-title"
              style={{
                fontSize: "16px", // Tamaño de fuente para el título
                fontWeight: "bold", // Negrita para el título
              }}
            >
              Detalles de Notificación: <strong>{notificacion.presionBotonId}</strong>
            </h5>
            {/* Botón para cerrar el modal */}
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose} // Llama a la función onClose cuando se hace clic
            ></button>
          </div>

          {/* Cuerpo del modal */}
          <div className="modal-body bg-white" style={{ padding: "20px" }}>
            {/* Tabla centrada con filas sin bordes */}
            <table className="table table-borderless mx-auto" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  {/* Fila con ID */}
                  <th
                    style={{
                      textAlign: "left", // Alineación izquierda para las etiquetas
                      width: "30%", // Ancho fijo para las etiquetas
                    }}
                  >
                    ID:
                  </th>
                  <td style={{ textAlign: "left" }}>{notificacion.id}</td>
                </tr>
                <tr>
                  {/* Fila con Presión Botón ID */}
                  <th style={{ textAlign: "left", width: "30%" }}>Presión Botón ID:</th>
                  <td style={{ textAlign: "left" }}>{notificacion.presionBotonId}</td>
                </tr>
                <tr>
                  {/* Fila con Cliente Notificado ID */}
                  <th style={{ textAlign: "left", width: "30%" }}>Cliente Notificado ID:</th>
                  <td style={{ textAlign: "left" }}>{notificacion.clienteNotificadoId}</td>
                </tr>
                <tr>
                  {/* Fila con Notificaciones Recibidas */}
                  <th style={{ textAlign: "left", width: "30%" }}>Notificaciones Recibidas:</th>
                  <td style={{ textAlign: "left" }}>{notificacion.notificacionesRecibidas}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer del modal */}
          <div className="modal-footer bg-light d-flex justify-content-center">
            {/* Botón para eliminar la notificación */}
            <button
              className="btn btn-danger"
              onClick={() => {
                onDelete(); // Llama a la función onDelete cuando se hace clic
                onClose(); // Cierra el modal después de eliminar
              }}
            >
              Eliminar Notificación
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
