import React, { useState, useEffect } from "react"; // Import useEffect
import PropTypes from "prop-types";
import axios from "axios"; // Import axios

const BASE_IMG_URL = "/assets/img/"; // URL base para las imágenes del cliente

function ClienteModal({ cliente, onClose, onUpdateCliente }) {
  // Use the actual client's 'estado' and 'estado_eliminado' from props
  // Ensure these fields exist on the client object, if not, provide a default
  const [estadoLocal, setEstadoLocal] = useState(cliente.estado || "activo");
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [isDeletedLocally, setIsDeletedLocally] = useState(cliente.eliminado); // Track deleted state
  const [csrfToken, setCsrfToken] = useState(''); // State for CSRF token

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        axios.defaults.withCredentials = true; // Ensure cookies are sent
        const response = await axios.get('http://192.168.1.31:9000/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error al obtener el token CSRF en ClienteModal:', error.response?.data || error.message);
        alert('Error de seguridad: No se pudo obtener el token CSRF.');
      }
    };
    fetchCsrfToken();
  }, []);

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
    if (!window.confirm(`¿Estás seguro de que quieres eliminar a ${cliente.nombre}?`)) {
      return;
    }

    try {
      const response = await axios.put(
        `http://192.168.1.31:9000/clientes/${cliente.id}/estado`, // Endpoint to update status
        { estado_eliminado: 'eliminado' }, // Assuming this field marks deletion
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      if (response.status === 200) {
        alert("Cliente marcado como eliminado.");
        setIsDeletedLocally(true); // Update local modal state
        onUpdateCliente({ ...cliente, eliminado: true, estado_eliminado: 'eliminado' }); // Update parent state
        onClose(); // Close the modal
      } else {
        alert("Error al eliminar cliente.");
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error.response?.data || error.message);
      alert("Error al eliminar cliente.");
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
                style={{
                  objectFit: "cover",
                  width: "220px",
                  height: "220px",
                }}
                loading="lazy"
              />
            </div>

            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">ID:</div>
              <div className="col-6">{cliente.id}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Nombre:</div>
              <div className="col-6">{cliente.nombre}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Correo:</div>
              <div className="col-6">{cliente.correo || cliente.correo_electronico || "N/A"}</div>
            </div>
            
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Cédula:</div>
              <div className="col-6">{cliente.cedula || cliente.cedula_identidad || "N/A"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Dirección:</div>
              <div className="col-6">{cliente.direccion || "N/A"}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Estado del Cliente:</div>
              <div className="col-6">
                {!editandoEstado ? (
                  <span className={`badge ${estadoLocal === 'activo' ? 'bg-success' : 'bg-warning'}`}>
                    {estadoLocal.charAt(0).toUpperCase() + estadoLocal.slice(1)}
                  </span>
                ) : (
                  <select
                    className="form-select"
                    value={estadoLocal}
                    onChange={handleEstadoChange}
                    style={{ fontSize: "16px" }}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                )}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6 text-end fw-bold">Número de Ayudas:</div>
              <div className="col-6">{cliente.numero_ayudas || 0}</div>
            </div>
            <div className="row mb-2">
            
         
            </div>
          </div>

          <div className="modal-footer bg-light justify-content-center">
            {!editandoEstado ? (
              <button
                className="btn btn-primary me-2"
                onClick={() => setEditandoEstado(true)}
                style={{ fontSize: "16px" }}
                disabled={isDeletedLocally} // Cannot edit state if deleted
              >
                <i className="fas fa-edit me-1"></i> Editar Estado
              </button>
            ) : (
              <button
                className="btn btn-primary me-2"
                onClick={guardarEstado}
                style={{ fontSize: "16px" }}
              >
                <i className="fas fa-save me-1"></i> Guardar Estado
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={handleEliminarCliente}
              style={{ fontSize: "16px" }}
              disabled={isDeletedLocally} // Cannot delete if already deleted
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