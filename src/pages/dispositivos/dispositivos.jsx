/* dispositivos.jsx */
/* -------------------*/
import React, { useState, useEffect } from "react";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search } from "lucide-react";
import DispositivosModal from "./dispositivos_modal.jsx";
import Celular from "../../assets/img/celular.jpg";
import axios from 'axios';

// Obtener la URL base desde variables de entorno o usar un valor por defecto
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.31:9000';

// Componente para la barra de búsqueda
function Buscador({ busqueda, setBusqueda }) {
  return (
    <div className="input-group" style={{ maxWidth: "400px" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por ID cliente, dispositivo o tipo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <span className="input-group-text">
        <Search size={18} />
      </span>
    </div>
  );
}

// Componente para mostrar la tarjeta de información de cada dispositivo
function DispositivoCard({ dispositivo, onFlechaClick, seleccionado, onSelect, eliminado }) {
  return (
    <div className="col">
      <div
        className={`card border-0 shadow-sm rounded-3 overflow-hidden ${eliminado ? "opacity-50" : ""}`}
        style={{
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: eliminado ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!eliminado) {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
          }
        }}
        onMouseLeave={(e) => {
          if (!eliminado) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        <img
          src={Celular}
          className="card-img-top"
          alt={`Imagen de ${dispositivo.nombre}`}
          style={{ objectFit: "cover", height: "200px" }}
          loading="lazy"
        />
        <div className="card-body bg-dark text-white text-center" style={{ padding: "0.5rem 0.25rem" }}>
          <h6 className="card-title mb-1 d-flex align-items-center justify-content-center gap-2" style={{ fontWeight: 700, fontSize: "1.08rem" }}>
            <i className="fas fa-mobile-alt text-primary"></i> {dispositivo.nombre}
          </h6>
          <div className="mb-1 d-flex align-items-center justify-content-center gap-2">
            <i className="fas fa-microchip text-secondary"></i>
            <span style={{ fontSize: ".98rem", fontWeight: 600 }}>{dispositivo.tipoDispositivo}</span>
          </div>
          <div className="mb-1 d-flex align-items-center justify-content-center gap-2">
            <i className="fas fa-user text-info"></i>
            <span style={{ fontSize: ".85rem", fontWeight: 500 }}>ID: {dispositivo.clienteId}</span>
          </div>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-1"
              onClick={() => onFlechaClick(dispositivo)}
              disabled={eliminado}
            >
              Ver Información
            </button>
          </div>
          
          <div className="form-check mt-2 d-flex justify-content-center">
            <input
              type="checkbox"
              checked={seleccionado}
              onChange={() => onSelect(dispositivo.id)}
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                transform: "scale(1.2)",
              }}
              disabled={eliminado}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GestionDispositivos() {
  const [busqueda, setBusqueda] = useState("");
  const [dispositivos, setDispositivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);
  const [dispositivosSeleccionados, setDispositivosSeleccionados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoDispositivo, setNuevoDispositivo] = useState({ dispositivo: "", tipo: "", clienteId: "" });
  const [dispositivoEditando, setDispositivoEditando] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  // Obtener token CSRF al cargar el componente
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        console.log('Obteniendo token CSRF...');
        
        // Configurar axios para incluir credenciales
        const response = await axios.get(`${API_BASE_URL}/csrf-token`, {
          withCredentials: true
        });
        
        const token = response.data.csrfToken;
        console.log('Token CSRF obtenido:', token);
        setCsrfToken(token);
        
        // Configurar axios globalmente para incluir credenciales
        axios.defaults.withCredentials = true;
        
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error.response?.data || error.message);
        // Reintentar obtener el token después de 3 segundos
        setTimeout(() => {
          console.log('Reintentando obtener token CSRF...');
          fetchCsrfToken();
        }, 3000);
      }
    };
    fetchCsrfToken();
  }, []);

  // Cargar dispositivos desde la API
  useEffect(() => {
    const fetchDispositivos = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/dispositivos`);
        
        // Transformar los datos de la API al formato que espera el frontend
        const dispositivosTransformados = response.data.map(dispositivo => ({
          id: dispositivo.id,
          clienteId: dispositivo.cliente_id,
          tipoDispositivo: dispositivo.tipo_dispositivo,
          nombre: dispositivo.modelo_dispositivo,
          tokenDispositivo: dispositivo.token_dispositivo,
          estado: dispositivo.estado,
          fechaCreacion: dispositivo.fecha_creacion,
          eliminado: dispositivo.estado === 'eliminado'
        }));
        
        setDispositivos(dispositivosTransformados);
      } catch (error) {
        console.error('Error al cargar dispositivos:', error);
        // Mantener datos por defecto en caso de error
        setDispositivos([
          { id: 1, clienteId: "505", clienteNombre: "Cliente Demo", tipoDispositivo: "Android", nombre: "Samsung Galaxy Tab S7", tokenDispositivo: "token_demo", eliminado: false },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDispositivos();
  }, []);

  const dispositivosFiltrados = dispositivos.filter((dispositivo) =>
    dispositivo.clienteId.toString().toLowerCase().includes(busqueda.toLowerCase()) ||
    dispositivo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    dispositivo.tipoDispositivo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminarDispositivo = async (dispositivoIds = null, mostrarConfirmacion = true, actualizarSoloLocal = false) => {
    const idsAEliminar = dispositivoIds || dispositivosSeleccionados;
    const cantidad = Array.isArray(idsAEliminar) ? idsAEliminar.length : 1;
    const idsArray = Array.isArray(idsAEliminar) ? idsAEliminar : [idsAEliminar];

    if (idsArray.length === 0) return;

    // Validar que todos los IDs son números válidos
    const idsValidos = idsArray.filter(id => id && !isNaN(id) && typeof id !== 'object');
    if (idsValidos.length === 0) {
      console.error('No se encontraron IDs válidos para eliminar:', idsArray);
      return;
    }

    console.log('Eliminando dispositivos con IDs:', idsValidos);

    // Mostrar confirmación con SweetAlert2 solo si se solicita
    if (mostrarConfirmacion) {
      if (window.Swal) {
        const result = await window.Swal.fire({
          title: `¿Desea eliminar ${cantidad > 1 ? `estos ${cantidad} dispositivos` : 'este dispositivo'}?`,
          text: "Esta acción no se puede deshacer",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        });

        if (!result.isConfirmed) {
          return;
        }
      } else {
        // Fallback si SweetAlert2 no está disponible
        if (!window.confirm(`¿Desea eliminar ${cantidad > 1 ? `estos ${cantidad} dispositivos` : 'este dispositivo'}?`)) {
          return;
        }
      }
    }

    try {
      // Solo hacer llamadas a la API si no es actualización local
      if (!actualizarSoloLocal) {
        // Verificar que tenemos el token CSRF
        if (!csrfToken) {
          throw new Error('Token CSRF no disponible');
        }

        // Eliminar dispositivos seleccionados en la API
        for (const dispositivoId of idsValidos) {
          console.log(`Eliminando dispositivo ${dispositivoId} con token ${csrfToken}`);
          await axios.delete(`${API_BASE_URL}/dispositivos/${dispositivoId}`, {
            headers: { 
              'X-CSRF-Token': csrfToken,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          });
        }
      }

      // Actualizar la lista local
      const dispositivosActualizados = dispositivos.map((dispositivo) =>
        idsValidos.includes(dispositivo.id)
          ? { ...dispositivo, eliminado: true, estado: 'eliminado' }
          : dispositivo
      );

      // Reordenar los dispositivos para que los eliminados vayan al final
      const dispositivosOrdenados = dispositivosActualizados.sort((a, b) =>
        a.eliminado === b.eliminado ? 0 : a.eliminado ? 1 : -1
      );

      setDispositivos(dispositivosOrdenados);
      setDispositivosSeleccionados([]);

      // Mostrar mensaje de éxito solo si se mostró confirmación (no viene del modal)
      if (mostrarConfirmacion && window.Swal) {
        window.Swal.fire({
          icon: "success",
          title: "Eliminados",
          text: `${cantidad} dispositivo(s) eliminado(s) correctamente.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error al eliminar dispositivos:', error);
      // Solo mostrar error si no viene del modal (para evitar doble mensaje)
      if (mostrarConfirmacion && window.Swal) {
        window.Swal.fire({
          icon: "error",
          title: "Error",
          text: `Hubo un error al eliminar los dispositivos: ${error.message}`,
        });
      }
      throw error; // Re-lanzar el error para que el modal lo maneje
    }
  };

  const handleSeleccionarDispositivo = (id) => {
    setDispositivosSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((dispositivoId) => dispositivoId !== id)
        : [...prevSeleccionados, id]
    );
  };

  const handleAgregarDispositivo = () => {
    setMostrarFormulario(true);
    setDispositivoEditando(null);
  };

  const handleEdit = (dispositivo) => {
    setDispositivoEditando(dispositivo);
    setNuevoDispositivo({
      dispositivo: dispositivo.nombre,
      tipo: dispositivo.tipoDispositivo,
      clienteId: dispositivo.clienteId,
    });
    setMostrarFormulario(true);

    localStorage.setItem("dispositivoEditando", JSON.stringify(dispositivo));
  };

  const handleGuardarNuevoDispositivo = () => {
    if (nuevoDispositivo.dispositivo && nuevoDispositivo.tipo) {
      if (dispositivoEditando) {
        // Editar dispositivo existente
        const dispositivosActualizados = dispositivos.map((dispositivo) =>
          dispositivo.id === dispositivoEditando.id
            ? {
                ...dispositivo,
                nombre: nuevoDispositivo.dispositivo,
                tipoDispositivo: nuevoDispositivo.tipo,
                clienteId: nuevoDispositivo.clienteId,
              }
            : dispositivo
        );
        setDispositivos(dispositivosActualizados);
      } else {
        // Agregar nuevo dispositivo
        const nuevoId = Math.max(...dispositivos.map((d) => d.id)) + 1;
        const dispositivoNuevo = {
          id: nuevoId,
          clienteId: nuevoDispositivo.clienteId,
          clienteNombre: `Cliente ${nuevoDispositivo.clienteId}`,
          tipoDispositivo: nuevoDispositivo.tipo,
          nombre: nuevoDispositivo.dispositivo,
          tokenDispositivo: "nuevo_token",
          eliminado: false,
        };
        setDispositivos([...dispositivos, dispositivoNuevo]);
      }

      setNuevoDispositivo({ dispositivo: "", tipo: "", clienteId: "" });
      setMostrarFormulario(false);
      setDispositivoEditando(null);
    } else {
      alert("Por favor complete todos los campos.");
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="page-header">
        Dispositivos <small>Información útil</small>
      </h1>
      <Panel>
        <PanelHeader>
          <h4 className="panel-title">Dispositivos</h4>
        </PanelHeader>
        <PanelBody>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted">Cargando dispositivos...</p>
            </div>
          ) : (
            <>
              <div className="row mb-3">
                <div className="col-12 col-lg-6 mb-2">
                  <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
                </div>
                <div className="col-12 col-lg-6 d-flex flex-wrap justify-content-lg-end gap-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleEliminarDispositivo()}
                    disabled={dispositivosSeleccionados.length === 0}
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>

              {dispositivosFiltrados.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-mobile-alt fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No se encontraron dispositivos</h5>
                  <p className="text-muted">
                    {busqueda ? "Intenta con otros términos de búsqueda" : "No hay dispositivos registrados"}
                  </p>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                  {dispositivosFiltrados.map((dispositivo) => (
                    <DispositivoCard
                      key={dispositivo.id}
                      dispositivo={dispositivo}
                      onFlechaClick={setDispositivoSeleccionado}
                      seleccionado={dispositivosSeleccionados.includes(dispositivo.id)}
                      onSelect={handleSeleccionarDispositivo}
                      eliminado={dispositivo.eliminado}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </PanelBody>
      </Panel>

      {dispositivoSeleccionado && (
        <DispositivosModal
          dispositivo={dispositivoSeleccionado}
          onClose={() => setDispositivoSeleccionado(null)}
          onDelete={(id) => {
            // Solo actualizar localmente, el modal ya hizo la llamada a la API
            const dispositivosActualizados = dispositivos.map((dispositivo) =>
              dispositivo.id === id
                ? { ...dispositivo, eliminado: true, estado: 'eliminado' }
                : dispositivo
            );
            const dispositivosOrdenados = dispositivosActualizados.sort((a, b) =>
              a.eliminado === b.eliminado ? 0 : a.eliminado ? 1 : -1
            );
            setDispositivos(dispositivosOrdenados);
            setDispositivosSeleccionados([]);
          }}
          csrfToken={csrfToken}
        />
      )}

      {mostrarFormulario && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              zIndex: 1050,
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <div
              className="modal-content"
              style={{
                border: "none",
                borderRadius: "0",
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">{dispositivoEditando ? "Editar Dispositivo" : "Agregar Dispositivo"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarFormulario(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label d-flex align-items-center gap-2">
                    <i className="fas fa-mobile-alt text-primary"></i> Dispositivo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoDispositivo.dispositivo}
                    onChange={(e) =>
                      setNuevoDispositivo({ ...nuevoDispositivo, dispositivo: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label d-flex align-items-center gap-2">
                    <i className="fas fa-microchip text-secondary"></i> Tipo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoDispositivo.tipo}
                    onChange={(e) =>
                      setNuevoDispositivo({ ...nuevoDispositivo, tipo: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center gap-1"
                  onClick={() => setMostrarFormulario(false)}
                >
                  <i className="fas fa-times"></i> Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-1"
                  onClick={handleGuardarNuevoDispositivo}
                >
                  <i className="fas fa-save"></i> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionDispositivos;
