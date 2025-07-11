import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2"; // Importamos SweetAlert2
import { FaEnvelope, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';
import { FiUser, FiMail, FiCreditCard, FiMapPin } from "react-icons/fi";
import "../../assets/scss/usuario_modal.scss";

const DEFAULT_IMG = "/assets/img/foto3.jpg"; // Imagen por defecto si no hay imagen definida

// Mapeo del estado que viene del backend ("activo", "eliminado") a texto legible
const mapEstadoBackToFront = (estadoBack) =>
  estadoBack === "eliminado" ? "Inactivo" : "Activo";

// Mapeo del estado del frontend ("Activo", "Inactivo") al formato del backend
const mapEstadoFrontToBack = (estadoFront) =>
  estadoFront === "Inactivo" ? "eliminado" : "activo";

// Componente del modal
function UsuarioModal({ usuario, onClose, onEstadoActualizado }) {
  const [estado, setEstado] = useState(mapEstadoBackToFront(usuario.estado || "activo"));
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Obtener token CSRF al cargar el componente
  useEffect(() => {
    axios
      .get("http://localhost:9000/csrf-token", { withCredentials: true })
      .then((res) => setCsrfToken(res.data.csrfToken))
      .catch((err) => console.error("Error al obtener CSRF token:", err));
  }, []);

  // Actualizar el estado temporal mientras se edita
  const handleEstadoChange = (e) => setEstado(e.target.value);

  // Guardar el estado en el backend
  const guardarEstado = async () => {
    const estadoParaBackend = mapEstadoFrontToBack(estado);

    try {
      await axios.put(
        `http://localhost:9000/usuarios/${usuario.id}`,
        { estado: estadoParaBackend },
        {
          headers: {
            "csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (estadoParaBackend === "eliminado") {
        Swal.fire({
          icon: "info",
          title: "Usuario Inactivado",
          text: `El usuario ${usuario.nombre} ha sido marcado como inactivo.`,
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Usuario Activado",
          text: `El usuario ${usuario.nombre} está activo.`,
          confirmButtonText: "OK",
        });
      }

      // Actualizamos el estado en tiempo real
      if (onEstadoActualizado) {
        onEstadoActualizado(usuario.id, estadoParaBackend);
      }

      setEditandoEstado(false);
      onClose();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al actualizar el estado.",
      });
    }
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div className="modal-dialog modal-xl" role="document">
        <div 
          className="modal-content"
          style={{
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2)",
            overflow: 'hidden',
          }}
        >
          {/* Header del modal */}
          <div 
            className="modal-header border-0" 
            style={{ 
              background: "#0891b2",
              color: "white",
              padding: "20px 30px",
              borderRadius: "20px 20px 0 0"
            }}
          >
            <h5 
              className="modal-title" 
              style={{ 
                fontSize: "18px", 
                fontWeight: "600",
                margin: 0
              }}
            >
              <i className="fas fa-user-cog me-2"></i>
              Detalles del Usuario: <strong>{usuario.nombre}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              style={{
                opacity: "0.8",
                fontSize: "1.2rem"
              }}
            ></button>
          </div>

          {/* Cuerpo del modal */}
          <div className="modal-body bg-white" style={{ padding: "30px" }}>
            <div className="text-center mb-4">
              <img
                src={usuario.imagen ? `/assets/img/${usuario.imagen}` : DEFAULT_IMG}
                alt={`Imagen de ${usuario.nombre}`}
                className="rounded-circle shadow"
                style={{ 
                  width: "120px", 
                  height: "120px", 
                  objectFit: "cover", 
                  border: "3px solid #ddd",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)"
                }}
                loading="lazy"
              />
            </div>
            <h3 className="text-center fw-bold mb-4" style={{ fontSize: "1.18rem" }}>{usuario.nombre}</h3>
            <div className="row g-3 mb-2">
              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100 shadow-sm" style={{ borderRadius: "10px", border: "1px solid #e9ecef" }}>
                  <div className="text-muted mb-1 d-flex align-items-center" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    <FiUser className="me-2" style={{ color: '#0891b2', fontSize: '1.2em' }} /> ID:
                  </div>
                  <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{usuario.id}</div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100 shadow-sm" style={{ borderRadius: "10px", border: "1px solid #e9ecef" }}>
                  <div className="text-muted mb-1 d-flex align-items-center" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    <FiMail className="me-2" style={{ color: '#0891b2', fontSize: '1.2em' }} /> Correo:
                  </div>
                  <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{usuario.correo_electronico || "N/A"}</div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100 shadow-sm" style={{ borderRadius: "10px", border: "1px solid #e9ecef" }}>
                  <div className="text-muted mb-1 d-flex align-items-center" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    <FiCreditCard className="me-2" style={{ color: '#0891b2', fontSize: '1.2em' }} /> Cédula:
                  </div>
                  <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{usuario.cedula_identidad || "N/A"}</div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100 shadow-sm" style={{ borderRadius: "10px", border: "1px solid #e9ecef" }}>
                  <div className="text-muted mb-1 d-flex align-items-center" style={{ fontSize: "1rem", fontWeight: 600 }}>
                    <FiMapPin className="me-2" style={{ color: '#0891b2', fontSize: '1.2em' }} /> Dirección:
                  </div>
                  <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{usuario.direccion || "N/A"}</div>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12 d-flex justify-content-center">
                {!editandoEstado ? (
                  <span className="badge d-flex align-items-center justify-content-center gap-2" style={{ background: "#0891b2", color: "#fff", fontSize: "1.05rem", padding: "10px 32px", borderRadius: "24px", fontWeight: 700, letterSpacing: 1, boxShadow: "0 2px 8px #0891b233", minWidth: 120 }}>
                    <span style={{ display: "inline-block", width: 14, height: 14, background: "#fff", borderRadius: "50%", marginRight: 6, boxShadow: "0 0 0 2px #0891b2" }}></span>
                    {estado}
                  </span>
                ) : (
                  <select 
                    className="form-select w-auto" 
                    value={estado} 
                    onChange={handleEstadoChange}
                    style={{ 
                      borderRadius: "8px", 
                      border: "2px solid #0891b2",
                      fontSize: "1.05rem",
                      padding: "8px 16px"
                    }}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div 
            className="modal-footer bg-light justify-content-center"
            style={{ 
              padding: "20px 30px",
              borderRadius: "0 0 20px 20px",
              borderTop: "1px solid #dee2e6"
            }}
          >
            {!editandoEstado ? (
              <button 
                className="btn btn-primary me-2" 
                onClick={() => setEditandoEstado(true)}
                style={{ 
                  fontWeight: 600, 
                  fontSize: "1.08rem", 
                  padding: "10px 32px", 
                  borderRadius: "14px" 
                }}
              >
                <i className="fas fa-edit me-1"></i> Editar Estado
              </button>
            ) : (
              <button 
                className="btn btn-primary me-2" 
                onClick={guardarEstado}
                style={{ 
                  fontWeight: 600, 
                  fontSize: "1.08rem", 
                  padding: "10px 32px", 
                  borderRadius: "14px" 
                }}
              >
                <i className="fas fa-save me-1"></i> Guardar Estado
              </button>
            )}
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              style={{ 
                fontWeight: 600, 
                fontSize: "1.08rem", 
                padding: "10px 32px", 
                borderRadius: "14px" 
              }}
            >
              <i className="fas fa-times me-1"></i> Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Validación de props
UsuarioModal.propTypes = {
  usuario: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    correo_electronico: PropTypes.string,
    cedula_identidad: PropTypes.string,
    direccion: PropTypes.string,
    estado: PropTypes.string,
    rol: PropTypes.string,
    imagen: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onEstadoActualizado: PropTypes.func.isRequired, // Nueva prop
};

export default UsuarioModal;
