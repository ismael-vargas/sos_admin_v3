import React, { useState, useEffect } from "react"; // Import useEffect
import PropTypes from "prop-types";
import axios from "axios"; // Import axios
import Swal from "sweetalert2";
import { FaPhoneAlt, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaHandsHelping } from 'react-icons/fa'; // Iconos

const BASE_IMG_URL = "/assets/img/"; // URL base para las imágenes del cliente

function ClienteModal({ cliente, onClose, onUpdateCliente }) {
  // Use the actual client's 'estado' and 'estado_eliminado' from props
  // Ensure these fields exist on the client object, if not, provide a default
  const [estadoLocal, setEstadoLocal] = useState(cliente.estado || "activo");
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [isDeletedLocally, setIsDeletedLocally] = useState(cliente.eliminado); // Track deleted state
  const [csrfToken, setCsrfToken] = useState(''); // State for CSRF token
  const [numerosCliente, setNumerosCliente] = useState([]);
  const [loadingNumeros, setLoadingNumeros] = useState(true);

  // Fetch CSRF token y números de cliente al montar
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get('http://192.168.1.31:9000/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error al obtener el token CSRF en ClienteModal:', error.response?.data || error.message);
        alert('Error de seguridad: No se pudo obtener el token CSRF.');
      }
    };
    fetchCsrfToken();
  }, []);

  // Obtener los números del cliente
  useEffect(() => {
    const fetchNumeros = async () => {
      setLoadingNumeros(true);
      try {
        const res = await axios.get(`http://192.168.1.31:9000/clientes_numeros/cliente/${cliente.id}`);
        setNumerosCliente(res.data);
      } catch (err) {
        setNumerosCliente([]);
      }
      setLoadingNumeros(false);
    };
    if (cliente.id) fetchNumeros();
  }, [cliente.id]);

  const handleEstadoChange = (e) => setEstadoLocal(e.target.value);

  const guardarEstado = async () => {
    try {
      const response = await axios.put(
        `http://192.168.1.31:9000/clientes/${cliente.id}/estado`, // Assuming this endpoint
        { estado: estadoLocal },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      if (response.status === 200) {
        alert(`Estado actualizado a: ${estadoLocal}`);
        onUpdateCliente({ ...cliente, estado: estadoLocal }); // Update parent state
        setEditandoEstado(false);
      } else {
        alert("Error al actualizar el estado.");
      }
    } catch (error) {
      console.error("Error al guardar estado:", error.response?.data || error.message);
      alert("Error al guardar estado.");
    }
  };

  const handleEliminarCliente = async () => {
    try {
      const response = await axios.put(
        `http://192.168.1.31:9000/clientes/${cliente.id}/estado`,
        { estado_eliminado: 'eliminado' },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      if (response.status === 200) {
        setIsDeletedLocally(true);
        onUpdateCliente({ ...cliente, eliminado: true, estado_eliminado: 'eliminado' });
        // No cerrar el modal aquí, para que el usuario vea el mensaje de éxito
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al eliminar cliente.' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al eliminar cliente.' });
    }
  };

  return (
    <div
      className="modal fade show d-flex justify-content-center align-items-center"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div
        className="modal-dialog modal-xl"
        style={{ maxWidth: "960px" }}
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header bg-dark text-white border-0">
            <h5
              className="modal-title text-truncate"
              style={{ maxWidth: "100%", fontSize: "14px" }}
            >
              Detalles del Cliente: <strong>{cliente.nombre}</strong>
              {isDeletedLocally && <span className="ms-2 badge bg-danger">ELIMINADO</span>}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body bg-white">
            <div className="text-center mb-4">
              <img
                src={`${BASE_IMG_URL}${cliente.imagen || 'default_user.jpg'}`}
                alt={`Imagen de ${cliente.nombre}`}
                className="rounded-circle shadow"
                style={{ width: "120px", height: "120px", objectFit: "cover", border: "4px solid #e0e0e0" }}
                loading="lazy"
              />
            </div>
            <h3 className="text-center fw-bold mb-4" style={{ fontSize: "1.18rem" }}>{cliente.nombre}</h3>
            <div className="row g-3 mb-2">
              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100 shadow-sm d-flex align-items-center gap-2">
                  <FaIdCard style={{ color: '#6366f1', fontSize: '1.25rem' }} />
                  <div>
                    <div className="text-muted mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>ID:</div>
                    <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{cliente.id}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100 shadow-sm d-flex align-items-center gap-2">
                  <FaEnvelope style={{ color: '#0891b2', fontSize: '1.25rem' }} />
                  <div>
                    <div className="text-muted mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>Correo:</div>
                    <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{cliente.correo || cliente.correo_electronico || "N/A"}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100 shadow-sm d-flex align-items-center gap-2">
                  <FaIdCard style={{ color: '#6366f1', fontSize: '1.25rem' }} />
                  <div>
                    <div className="text-muted mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>Cédula:</div>
                    <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{cliente.cedula || cliente.cedula_identidad || "N/A"}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="bg-light rounded-3 p-3 h-100 shadow-sm d-flex align-items-center gap-2">
                  <FaMapMarkerAlt style={{ color: '#f59e42', fontSize: '1.25rem' }} />
                  <div>
                    <div className="text-muted mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>Dirección:</div>
                    <div className="fw-semibold" style={{ fontSize: "1.08rem" }}>{cliente.direccion || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Número de Ayudas y Números de cliente, ambos centrados y en cuadraditos */}
            <div className="row mb-2 justify-content-center">
              <div className="col-12 col-md-6 d-flex flex-column align-items-center mx-auto">
                <div className="bg-light rounded-3 p-3 mb-2 shadow-sm d-flex align-items-center gap-2 justify-content-center w-100" style={{ minHeight: 60 }}>
                  <FaHandsHelping style={{ color: '#6366f1', fontSize: '1.25rem' }} />
                  <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 600 }}>Número de Ayudas:</span>
                  <span className="fw-bold text-primary" style={{ fontSize: '1.08rem' }}>{cliente.numero_ayudas || 0}</span>
                </div>
                {loadingNumeros ? (
                  <div className="bg-light rounded-3 p-3 shadow-sm w-100 text-center" style={{ minHeight: 60 }}>
                    <span className="text-muted">Cargando números...</span>
                  </div>
                ) : (
                  numerosCliente.length === 0 ? (
                    <div className="bg-light rounded-3 p-3 shadow-sm w-100 text-center" style={{ minHeight: 60 }}>
                      <span className="text-muted">Sin números</span>
                    </div>
                  ) : (
                    <div className="bg-light rounded-3 p-3 shadow-sm w-100 text-center d-flex flex-wrap justify-content-center align-items-center gap-2" style={{ minHeight: 60 }}>
                      {numerosCliente.map((n, idx) => (
                        <span key={n.id} className="badge mx-1" style={{ background: '#e0f7fa', color: '#0891b2', fontWeight: 700, fontSize: '1.01rem', border: '1px solid #10b981', borderRadius: 16, padding: '7px 16px' }}>
                          <span style={{ color: '#6366f1', fontWeight: 700 }}>Número principal:</span> <span style={{ color: '#0891b2', fontWeight: 700 }}>{n.numero}</span>
                        </span>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light justify-content-center">
            {/* Eliminar botón Editar Estado, solo dejar Eliminar Cliente centrado */}
            <button
              className="btn btn-danger d-flex align-items-center justify-content-center"
              onClick={async () => {
                const result = await Swal.fire({
                  title: `¿Eliminar cliente?`,
                  html: `<b>${cliente.nombre}</b> será eliminado. Esta acción no se puede deshacer.`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#d33",
                  cancelButtonColor: "#3085d6",
                  confirmButtonText: "Sí, eliminar",
                  cancelButtonText: "Cancelar"
                });
                if (result.isConfirmed) {
                  await handleEliminarCliente();
                  await Swal.fire({
                    icon: "success",
                    title: "Cliente Eliminado",
                    text: `El cliente ha sido eliminado correctamente.`,
                    timer: 1200,
                    showConfirmButton: false
                  });
                  onClose(); // Ahora sí cerramos el modal después del mensaje de éxito
                }
              }}
              style={{ fontSize: "1.08rem", padding: "10px 32px", borderRadius: "24px" }}
              disabled={isDeletedLocally}
            >
              <i className="fas fa-trash-alt me-1"></i> {isDeletedLocally ? 'Cliente Eliminado' : 'Eliminar Cliente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ClienteModal.propTypes = {
  cliente: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    correo: PropTypes.string, // Optional, depending on backend response
    correo_electronico: PropTypes.string, // For consistency with mobile app
    telefono: PropTypes.string,
    cedula: PropTypes.string, // Optional
    cedula_identidad: PropTypes.string, // For consistency with mobile app
    direccion: PropTypes.string,
    estado: PropTypes.string, // e.g., 'activo', 'inactivo'
    numero_ayudas: PropTypes.number,
    eliminado: PropTypes.bool, // For frontend representation of estado_eliminado
    estado_eliminado: PropTypes.string, // For backend representation ('activo', 'eliminado')
    imagen: PropTypes.string, // Made optional for default fallback
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateCliente: PropTypes.func.isRequired, // New prop to update client in parent
};

export default ClienteModal;