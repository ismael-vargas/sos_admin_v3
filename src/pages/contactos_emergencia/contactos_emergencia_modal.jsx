import React, { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { FaPhoneAlt, FaRegIdBadge, FaRegStickyNote } from "react-icons/fa";

function ContactosEmergenciaModal({ emergencia, onClose, onSave }) {
  const [form, setForm] = useState({
    servicio: emergencia.servicio || "",
    descripcion: emergencia.descripcion || "",
    telefono: emergencia.telefono || ""
  });
  const [editando, setEditando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.servicio.trim() || !form.telefono.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "El nombre del servicio y el teléfono son obligatorios."
      });
      return;
    }
    if (onSave) onSave({ ...emergencia, ...form });
    setEditando(false);
    onClose();
    Swal.fire({
      icon: "success",
      title: "¡Servicio actualizado!",
      text: "El servicio de emergencia se ha editado correctamente.",
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex" }}
    >
      <div className="modal-dialog" style={{ maxWidth: "500px" }} role="document">
        <div className="modal-content p-0">
          <div className="modal-header bg-dark text-white border-0" style={{padding: '18px 24px 12px 24px'}}>
            <h5 className="modal-title" style={{ fontSize: "14px", marginLeft: -10, textAlign: 'left', width: '100%' }}>
              Detalles del Servicio de Emergencia
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body bg-white d-flex flex-column align-items-center justify-content-center">
            <div className="w-100 d-flex flex-column gap-3 justify-content-center align-items-center">
              <div className="w-100">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="d-flex flex-column align-items-center bg-light p-3 mb-2 shadow-sm">
                      <FaRegIdBadge className="mb-2 text-primary" size={22} />
                      <label className="form-label mb-0 text-center">Nombre del servicio de emergencia</label>
                      {editando ? (
                        <input
                          type="text"
                          name="servicio"
                          className="form-control mt-1 text-center"
                          value={form.servicio}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="fw-bold mt-1 text-center w-100">{form.servicio}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex flex-column align-items-center bg-light p-3 mb-2 shadow-sm">
                      <FaRegStickyNote className="mb-2 text-warning" size={22} />
                      <label className="form-label mb-0 text-center">Descripción del servicio de emergencia</label>
                      {editando ? (
                        <input
                          type="text"
                          name="descripcion"
                          className="form-control mt-1 text-center"
                          value={form.descripcion}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="mt-1 text-center w-100">{form.descripcion}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex flex-column align-items-center bg-light p-3 mb-2 shadow-sm">
                      <FaPhoneAlt className="mb-2 text-success" size={22} />
                      <label className="form-label mb-0 text-center">Teléfono del servicio de emergencia</label>
                      {editando ? (
                        <input
                          type="text"
                          name="telefono"
                          className="form-control mt-1 text-center"
                          value={form.telefono}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="mt-1 text-center w-100">{form.telefono}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer bg-light d-flex justify-content-center">
            {!editando ? (
              <button
                className="btn btn-primary me-2 d-flex align-items-center justify-content-center"
                onClick={() => setEditando(true)}
              >
                <i className="fas fa-edit me-2"></i> Editar Servicio
              </button>
            ) : (
              <button
                className="btn btn-primary me-2 d-flex align-items-center justify-content-center"
                onClick={handleSave}
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

ContactosEmergenciaModal.propTypes = {
  emergencia: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    servicio: PropTypes.string,
    descripcion: PropTypes.string,
    telefono: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func
};

export default ContactosEmergenciaModal;
