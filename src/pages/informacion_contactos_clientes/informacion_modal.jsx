/* informacion_contacto_cliente_modal.jsx */
/* -------------------*/
import React, { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

function InformacionModal({ informacion, onClose }) {
    const [nombre, setNombre] = useState(informacion.nombre); // Estado para editar el nombre
    const [numero, setNumero] = useState(informacion.numero); // Estado para editar el número
    const [editando, setEditando] = useState(false);
    const [seleccionada, setSeleccionada] = useState(false); // Estado para marcar la tarjeta seleccionada

    const guardarCambios = () => {
        // Actualizamos la información sin necesidad de onSave
        informacion.nombre = nombre; // Guardamos los cambios en el nombre
        informacion.numero = numero; // Guardamos los cambios en el número
        setEditando(false); // Salimos del modo de edición
        onClose(); // Cerramos el modal
        // SweetAlert2 para éxito
        Swal.fire({
            icon: "success",
            title: "¡Edición exitosa!",
            text: "El contacto ha sido actualizado correctamente.",
            timer: 1500,
            showConfirmButton: false,
        });
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
                        <h5
              className="modal-title text-truncate"
              style={{ maxWidth: "100%", fontSize: "15px" }}
            >
                            Detalles del Cliente: <strong>{informacion.nombre}</strong>
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
                                src={informacion.imagen}
                                alt="Imagen del cliente"
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
                                className="btn me-2 d-flex align-items-center justify-content-center"
                                style={{ background: "#339cf6", color: "#fff", fontWeight: 600, fontSize: "1.08rem", padding: "10px 32px", borderRadius: "14px", boxShadow: "0 2px 8px #339cf622" }}
                                onClick={() => setEditando(true)}
                            >
                                <i className="fas fa-edit me-2"></i> Editar Estado
                            </button>
                        ) : (
                            <button
                                className="btn me-2 d-flex align-items-center justify-content-center"
                                style={{ background: "#339cf6", color: "#fff", fontWeight: 600, fontSize: "1.08rem", padding: "10px 32px", borderRadius: "14px", boxShadow: "0 2px 8px #339cf622" }}
                                onClick={guardarCambios}
                            >
                                <i className="fas fa-save me-2"></i> Guardar Cambios
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
};

export default InformacionModal;
