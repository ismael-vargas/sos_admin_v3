/* grupos_modal.jsx */
/* -------------------*/
import React, { useState } from "react";
import PropTypes from "prop-types";

// Componente modal para mostrar información detallada de un grupo
function GrupoModal({ grupo, onClose }) {
    const [editandoEstado, setEditandoEstado] = useState(false);
    const [estado, setEstado] = useState(grupo.estado ? "Activo" : "Inactivo");

    // Función para manejar el cambio de estado
    const handleEstadoChange = (e) => setEstado(e.target.value);

    // Función para guardar el estado editado
    const guardarEstado = () => {
        // Aquí podrías hacer una petición para guardar el estado si lo deseas
        setEditandoEstado(false);
    };

    // Función para cerrar el modal y realizar acciones adicionales
    const cerrarModal = () => {
        onClose();
    };

    return (
        <div
            className="modal fade show d-flex justify-content-center align-items-center"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content" style={{ border: "none", borderRadius: "16px", boxShadow: "0 4px 24px #00000022" }}>
                    {/* Header del modal */}
                    <div className="modal-header bg-dark text-white border-0 d-flex flex-column align-items-start" style={{ padding: "15px" }}>
                      <h5
              className="modal-title text-truncate"
              style={{ maxWidth: "100%", fontSize: "15px" }}
            >
                            Detalles del Grupo: <strong>{grupo.nombre}</strong>
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white position-absolute end-0 top-0 m-3"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>

                    {/* Cuerpo del modal */}
                    <div className="modal-body bg-white">
                        <div className="text-center mb-4">
                            <img
                                src={grupo.imagen ? `/assets/img/${grupo.imagen}` : "/assets/img/911.jpg"}
                                alt={`Imagen de ${grupo.nombre}`}
                                className="rounded-circle shadow"
                                style={{ width: "120px", height: "120px", objectFit: "cover", border: "4px solid #e0e0e0" }}
                                loading="lazy"
                            />
                        </div>
                        <h3 className="text-center fw-bold mb-4" style={{ fontSize: "1.18rem" }}>{grupo.nombre}</h3>
                        <div className="row g-3 mb-2">
                            <div className="col-12 col-md-6">
                                <div className="bg-light rounded-3 p-3 h-100 shadow-sm">
                                    <div className="text-muted mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>ID:</div>
                                    <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{grupo.id}</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="bg-light rounded-3 p-3 h-100 shadow-sm">
                                    <div className="text-muted mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>Miembros:</div>
                                    <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{grupo.miembros}</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="bg-light rounded-3 p-3 h-100 shadow-sm">
                                    <div className="text-muted mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>Descripción del Grupo:</div>
                                    <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{grupo.descripcion || "Sin descripción"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="bg-light rounded-3 p-3 h-100 shadow-sm w-100 d-flex flex-column align-items-center justify-content-center">
                                    <div className="text-muted mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>Estado:</div>
                                    {!editandoEstado ? (
                                        <span className="badge d-flex align-items-center justify-content-center gap-2" style={{ background: "#0891b2", color: "#fff", fontSize: "1.05rem", padding: "10px 32px", borderRadius: "24px", fontWeight: 700, letterSpacing: 1, boxShadow: "0 2px 8px #0891b233", minWidth: 120 }}>
                                            <span style={{ display: "inline-block", width: 14, height: 14, background: "#fff", borderRadius: "50%", marginRight: 6, boxShadow: "0 0 0 2px #0891b2" }}></span>
                                            {estado}
                                        </span>
                                    ) : (
                                        <select className="form-select w-auto" value={estado} onChange={handleEstadoChange}>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer del modal */}
                    <div className="modal-footer bg-light justify-content-center">
                        {!editandoEstado ? (
                            <button
                                className="btn btn-primary me-2 d-flex align-items-center justify-content-center"
                                onClick={() => setEditandoEstado(true)}
                            >
                                <i className="fas fa-edit me-1"></i> Editar Estado
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary me-2 d-flex align-items-center justify-content-center"
                                onClick={guardarEstado}
                            >
                                <i className="fas fa-save me-1"></i> Guardar Estado
                            </button>
                        )}
                        <button
                            className="btn btn-danger d-flex align-items-center justify-content-center"
                            onClick={cerrarModal}
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
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ID del grupo
        nombre: PropTypes.string.isRequired, // Nombre del grupo
        miembros: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Número de miembros
        estado: PropTypes.bool.isRequired, // Estado activo/inactivo
        descripcion: PropTypes.string, // Descripción del grupo
        imagen: PropTypes.string, // Imagen del grupo
    }).isRequired,
    onClose: PropTypes.func.isRequired, // Función para cerrar el modal
};

export default GrupoModal;
