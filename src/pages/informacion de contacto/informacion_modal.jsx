/* informacion_contacto_usuario_modal.jsx */
/* -------------------*/
import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2"; // Importa SweetAlert

function InformacionModal({ informacion, onClose, setInformaciones }) {
  const [nombre, setNombre] = useState(informacion.nombre);
  const [numero, setNumero] = useState(informacion.numero);
  const [editando, setEditando] = useState(false);
  const [seleccionada, setSeleccionada] = useState(false); // Estado para marcar la tarjeta seleccionada

  const guardarCambios = async () => {
    const csrfToken = localStorage.getItem("csrfToken");

    try {
      const response = await axios.put(
        `http://localhost:9000/usuarios_numeros/${informacion.id}`, // Ruta corregida
        { nombre, numero },
        {
          headers: {
            "CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setInformaciones((prevInformaciones) =>
          prevInformaciones.map((info) =>
            info.id === informacion.id ? { ...info, nombre, numero } : info
          )
        );
        setEditando(false); // Salimos del modo de edición
        onClose(); // Cerramos el modal

        // Mostrar alerta de éxito al editar
        Swal.fire({
          icon: "success",
          title: "¡Edición exitosa!",
          text: "El contacto ha sido actualizado correctamente.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error al editar",
        text: "Hubo un error al guardar los cambios. Por favor, inténtelo de nuevo.",
      });
    }
  };

  const handleSeleccionar = () => {
    setSeleccionada(!seleccionada); // Al hacer clic, alternamos el estado de selección
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="modal-dialog"
        style={{
          maxWidth: "600px",
          borderRadius: "0", // Borde recto, sin curvas
          overflow: "hidden",
        }}
        role="document"
      >
        <div className="modal-content" style={{ borderRadius: "0", border: "none" }}>
          <div className="modal-header bg-dark text-white border-0" style={{ padding: "15px" }}>
            <h5 className="modal-title" style={{ fontSize: "1.05rem" }}>
              Detalles del Usuario: <strong>{informacion.nombre}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body bg-white" style={{ padding: "20px" }}>
            <div className="text-center mb-4" onClick={handleSeleccionar}>
              <img
                src="/assets/img/Pinteres.jpeg" // Ruta absoluta para la imagen
                alt={`Imagen de ${informacion.nombre}`}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: seleccionada ? "3px solid #007bff" : "2px solid #ddd", // Marca solo la tarjeta seleccionada
                }}
              />
            </div>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <th>Nombre:</th>
                  <td>
                    {editando ? (
                      <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    ) : (
                      <span>{informacion.nombre}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Número:</th>
                  <td>
                    {editando ? (
                      <input
                        type="text"
                        className="form-control"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                      />
                    ) : (
                      <span>{informacion.numero}</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="modal-footer bg-light d-flex justify-content-center">
            {!editando ? (
              <button
                className="btn btn-primary me-2"
                onClick={() => setEditando(true)}
              >
                Editar
              </button>
            ) : (
              <button
                className="btn btn-success me-2"
                onClick={guardarCambios}
              >
                Guardar Cambios
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

InformacionModal.propTypes = {
  informacion: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    numero: PropTypes.string.isRequired, // Asegúrate de que "numero" esté en el objeto
    imagen: PropTypes.string.isRequired,
    eliminado: PropTypes.bool.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  setInformaciones: PropTypes.func.isRequired, // Nueva prop para actualizar la lista de informaciones
};

export default InformacionModal;
