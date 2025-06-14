/* respuesta_usuario_modal.jsx */
/* -------------------*/
import React, { useState } from "react";
import PropTypes from "prop-types";

// Base URL para las imágenes de los usuarios
const BASE_IMG_URL = "/assets/img/";

// Función para generar un número aleatorio dentro de un rango
const generarNumeroAleatorio = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function RespuestaDeUsuarioModal({ usuario, onClose }) {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  // Generar valores aleatorios para los datos
  const presionBoton = generarNumeroAleatorio(1, 100);
  const numeroNotificaciones = generarNumeroAleatorio(0, 50);
  const numeroRespuestas = generarNumeroAleatorio(0, 50);
  const evaSOS = generarNumeroAleatorio(0, 50);
  const eva911 = generarNumeroAleatorio(0, 50);
  const innecesarias = generarNumeroAleatorio(0, 20);

  // Manejo de confirmación de eliminación
  const confirmarEliminacion = () => {
    setMostrarAlerta(false); // Cerrar la alerta flotante
    alert("El informe ha sido eliminado."); // Mostrar mensaje de eliminación
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} // Fondo oscuro para el modal
    >
      <div
        className="modal-dialog modal-lg"
        style={{ maxWidth: "1100px" }} // Aumentar el tamaño del cuadro del modal
        role="document"
      >
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header bg-dark text-white border-0">
            <h5
              className="modal-title text-truncate"
              style={{ maxWidth: "100%", fontSize: "14px" }}
            >
              Respuesta del Usuario:{" "}
              <strong>{usuario.nombre}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose} // Función para cerrar el modal
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body bg-white">
            {/* Imagen del Usuario */}
            <div className="text-center mb-4">
              <img
                src={`${BASE_IMG_URL}${usuario.imagen}`}
                alt={`Imagen de ${usuario.nombre}`}
                className="rounded-circle shadow"
                style={{
                  objectFit: "cover", // Asegura que la imagen cubra el círculo completamente
                  width: "250px", // Mayor tamaño de la imagen
                  height: "250px", // Mayor tamaño de la imagen
                }}
                loading="lazy" // Cargar la imagen de manera diferida
              />
            </div>

            {/* Contenedor de datos en filas */}
            <div className="d-flex flex-column align-items-center">
              {/* Fila de ID */}
              <div className="d-flex justify-content-between w-75 mb-3">
                <div className="fw-bold">ID:</div>
                <div>{usuario.id}</div>
              </div>
              {/* Fila de Presión del Botón */}
              <div className="d-flex justify-content-between w-75 mb-3">
                <div className="fw-bold">Presión del Botón:</div>
                <div>{presionBoton}</div>
              </div>
              {/* Fila de Número de Notificaciones */}
              <div className="d-flex justify-content-between w-75 mb-3">
                <div className="fw-bold">Número de Notificaciones:</div>
                <div>{numeroNotificaciones}</div>
              </div>
              {/* Fila de Número de Respuestas */}
              <div className="d-flex justify-content-between w-75 mb-3">
                <div className="fw-bold">Número de Respuestas:</div>
                <div>{numeroRespuestas}</div>
              </div>
              {/* Fila de Evaluación SOS */}
              <div className="d-flex justify-content-between w-75 mb-3">
                <div className="fw-bold">Evaluaciones SOS:</div>
                <div>{evaSOS}</div>
              </div>
              {/* Fila de Evaluación 911 */}
              <div className="d-flex justify-content-between w-75 mb-3">
                <div className="fw-bold">Evaluaciones 911:</div>
                <div>{eva911}</div>
              </div>
              {/* Fila de Respuestas Innecesarias */}
              <div className="d-flex justify-content-between w-75 mb-3">
                <div className="fw-bold">Respuestas Innecesarias:</div>
                <div>{innecesarias}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light justify-content-center">
            {/* Botón Eliminar */}
            <button
              className="btn btn-danger"
              onClick={() => setMostrarAlerta(true)} // Mostrar la alerta de eliminación
              style={{ fontSize: "16px" }}
            >
              <i className="fas fa-trash me-1"></i> Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Alerta flotante para confirmar eliminación */}
      {mostrarAlerta && (
        <div
          className="position-fixed top-50 start-50 translate-middle bg-white border rounded shadow-lg p-4"
          style={{ zIndex: 1055, width: "300px" }} // Ubicar la alerta en el centro
        >
          <p className="text-center fw-bold">
            ¿Desea eliminar este informe?
          </p>
          <div className="d-flex justify-content-between">
            {/* Botón para cancelar la eliminación */}
            <button
              className="btn btn-secondary"
              onClick={() => setMostrarAlerta(false)} // Cerrar la alerta sin eliminar
            >
              Cancelar
            </button>
            {/* Botón para confirmar la eliminación */}
            <button
              className="btn btn-danger"
              onClick={confirmarEliminacion} // Eliminar el informe y cerrar la alerta
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Validación de las propiedades que recibe el componente
RespuestaDeUsuarioModal.propTypes = {
  usuario: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ID
    nombre: PropTypes.string.isRequired, // Nombre del usuario
    imagen: PropTypes.string.isRequired, // Imagen del usuario
  }).isRequired,
  onClose: PropTypes.func.isRequired, // Función para cerrar el modal
};

export default RespuestaDeUsuarioModal;
