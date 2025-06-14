/* rol_modal.jsx */
/* -------------------*/
import React, { useState } from "react";
import PropTypes from "prop-types";

// Componente modal para mostrar información detallada del rol
function RolModal({ rol, onClose, onSave }) {
    const [nombreRol, setNombreRol] = useState(rol.rol); // Estado para editar el nombre del rol
    const [editandoRol, setEditandoRol] = useState(false); // Estado para gestionar el modo de edición

    // Función para cerrar el modal
    const cerrarModal = () => {
        onClose(); // Cierra el modal
    };

    // Función para manejar la edición del rol
    const handleEdit = () => {
        onSave({
            id: rol.id,
            rol: nombreRol,
            rol_id: rol.rol_id,
            nombre: rol.nombre,
            imagen: rol.imagen,
            eliminado: rol.eliminado,
        });
        setEditandoRol(false); // Desactiva el modo de edición
        cerrarModal(); // Cierra el modal después de guardar
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
                            Detalles del Rol: <strong>{rol.rol}</strong>
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
                                src={rol.imagen}
                                alt="Imagen del usuario"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "2px solid #ddd",
                                }}
                            />
                        </div>
                        <table className="table table-borderless mx-auto" style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <th style={{ textAlign: "left", width: "30%" }}>Nombre del Usuario:</th>
                                    <td style={{ textAlign: "left" }}>{rol.nombre}</td>
                                </tr>
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
                                            <span>{rol.rol}</span>
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
                                <i className="fas fa-edit me-1"></i> Editar Rol
                            </button>
                        ) : (
                            <button className="btn btn-primary me-2" onClick={handleEdit}>
                                <i className="fas fa-save me-1"></i> Guardar Rol
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
        rol: PropTypes.string.isRequired,
        rol_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        imagen: PropTypes.string.isRequired,
        eliminado: PropTypes.bool.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default RolModal;
