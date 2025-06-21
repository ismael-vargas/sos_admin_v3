/* rol_modal.jsx */
/* -------------------*/
import React, { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import axios from "axios";

// Componente modal para mostrar información detallada del rol
function RolModal({ rol, onClose, onSave }) {
  const [nombreRol, setNombreRol] = useState(rol.nombre); // Estado para editar el nombre del rol
  const [editandoRol, setEditandoRol] = useState(false); // Estado para gestionar el modo de edición

  // Función para cerrar el modal
  const cerrarModal = () => {
    onClose(); // Cierra el modal
  };

  // Función para guardar los cambios
  const handleSave = async () => {
  const rolEditado = { ...rol, nombre: nombreRol };
  
  // Cerrar modal inmediatamente
  setEditandoRol(false);
  cerrarModal();
  
  try {
    // Mostrar carga mientras se actualiza
    Swal.fire({
      title: 'Guardando...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // Llamar a onSave (que ahora es optimista)
    onSave(rolEditado);

    // Llamada al backend
    await axios.put(`http://localhost:9000/roles/${rol.id}`, rolEditado, {
      headers: { "CSRF-Token": localStorage.getItem("csrfToken") },
      withCredentials: true
    });

    Swal.fire({
      icon: "success",
      title: "¡Actualizado el Rol con Exito!",
      text: "El rol se ha editado correctamente.",
      timer: 1500,
      showConfirmButton: false
    });

  } catch (error) {
    Swal.fire("Error", "No se pudo guardar", "error");
  }
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
          maxWidth: "800px",
          borderRadius: "0px",
          overflow: "hidden",
          border: "none",
        }}
        role="document"
      >
        <div className="modal-content" style={{ border: "none", boxShadow: "none" }}>
          {/* Encabezado del modal */}
          <div className="modal-header bg-dark text-white border-0" style={{ padding: "15px" }}>
            <h5
              className="modal-title"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Detalles del Rol: <strong>{rol.nombre}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={cerrarModal}
            ></button>
          </div>

          {/* Cuerpo del modal */}
          <div className="modal-body bg-white" style={{ padding: "20px" }}>
            <div className="text-center mb-4">
              <img
                src="/assets/img/usuario.jpg" // Ruta de la imagen del rol
                alt={`Imagen de ${rol.nombre}`}
                className="rounded-circle shadow"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
            </div>
            <table className="table table-borderless mx-auto" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left", width: "30%" }}>Nombre del Rol:</th>
                  <td style={{ textAlign: "left" }}>
                    {editandoRol ? (
                      <input
                        type="text"
                        value={nombreRol}
                        onChange={(e) => setNombreRol(e.target.value)}
                        className="form-control"
                      />
                    ) : (
                      <span>{rol.nombre}</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer del modal */}
          <div className="modal-footer bg-light d-flex justify-content-center">
            {!editandoRol ? (
              <button
                className="btn btn-primary me-2"
                onClick={() => setEditandoRol(true)}
              >
                Editar Rol
              </button>
            ) : (
              <button className="btn btn-primary me-2" onClick={handleSave}>
                Guardar Rol
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Validación de tipos de props
RolModal.propTypes = {
  rol: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default RolModal;
