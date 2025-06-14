/* grupos_modal.jsx */
/* -------------------*/
import React from "react";
import PropTypes from "prop-types";

// Componente modal para mostrar información detallada de un grupo
function GrupoModal({ grupo, onClose }) {
    // Función para cerrar el modal y realizar acciones adicionales
    const cerrarModal = () => {
        alert("Información del grupo eliminada");
        onClose();
    };

    return (
        <div
            className="modal fade show d-flex justify-content-center align-items-center"
            tabIndex="-1"
            role="dialog"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo oscuro para el modal
                display: "flex", // Flexbox para centrar el modal
                justifyContent: "center", // Centrado horizontal
                alignItems: "center", // Centrado vertical
            }}
        >
            <div
                className="modal-dialog"
                style={{
                    maxWidth: "800px", // Tamaño máximo del modal
                    borderRadius: "0px", // Sin bordes redondeados
                    overflow: "hidden", // Evita el desbordamiento del contenido
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
                            Detalles del Grupo: <strong>{grupo.nombre}</strong>
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            aria-label="Close"
                            onClick={onClose} // Cierra el modal
                        ></button>
                    </div>

                    {/* Cuerpo del modal */}
                    <div className="modal-body bg-white" style={{ padding: "20px" }}>
                        {/* Tabla centrada con filas */}
                        <table className="table table-borderless mx-auto" style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <th
                                        style={{
                                            textAlign: "left", // Alineación izquierda para etiquetas
                                            width: "30%", // Ancho fijo para las etiquetas
                                        }}
                                    >
                                        ID:
                                    </th>
                                    <td style={{ textAlign: "left" }}>{grupo.id}</td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: "left", width: "30%" }}>Nombre del Grupo:</th>
                                    <td style={{ textAlign: "left" }}>{grupo.nombre}</td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: "left", width: "30%" }}>Número de Miembros:</th>
                                    <td style={{ textAlign: "left" }}>{grupo.miembros}</td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: "left", width: "30%" }}>Estado:</th>
                                    <td style={{ textAlign: "left" }}>{grupo.estado ? "Activo" : "Inactivo"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer del modal */}
                    <div className="modal-footer bg-light d-flex justify-content-center">
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => alert("Información del grupo editada")} // Acción para editar
                        >
                            <i className="fas fa-edit me-1"></i> Editar Grupo
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={cerrarModal} // Llama a la función de cierre
                        >
                            <i className="fas fa-trash me-1"></i> Eliminar Grupo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Validación de tipos de props
GrupoModal.propTypes = {
    grupo: PropTypes.shape({
        id: PropTypes.string.isRequired, // ID del grupo
        nombre: PropTypes.string.isRequired, // Nombre del grupo
        miembros: PropTypes.number.isRequired, // Número de miembros en el grupo
        estado: PropTypes.bool.isRequired, // Estado activo/inactivo
    }).isRequired,
    onClose: PropTypes.func.isRequired, // Función para cerrar el modal
};

export default GrupoModal;
