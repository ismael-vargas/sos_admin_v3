/* contactos_emergencia.jsx */
/* -------------------*/
// Importación de librerías y componentes necesarios
import React, { useState } from "react"; // Importamos React y el hook useState para gestionar el estado local
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx"; // Importamos los componentes del panel
import { Search, PhoneCall } from "lucide-react"; // Importamos iconos de la librería lucide-react
import EmergenciaIcono from "../../assets/img/emergencia_icono.jpg"; // Importamos una imagen de ícono de emergencia
import Swal from "sweetalert2";
import ContactosEmergenciaModal from "./contactos_emergencia_modal.jsx";

// Componente de búsqueda para filtrar contactos
function Buscador({ busqueda, setBusqueda }) {
  return (
    <div className="input-group" style={{ maxWidth: "400px" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar servicio de emergencia..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        aria-label="Buscar servicio de emergencia"
      />
      <span className="input-group-text">
        <Search size={18} aria-hidden="true" />
      </span>
    </div>
  );
}

// Componente para representar cada tarjeta de contacto de emergencia
function EmergenciaCard({ emergencia, onSelect, isSelected, onCardClick, dataEmergenciaId }) {
  // El modal solo se abre con el botón 'Ver información', no al hacer click en la carta
  return (
    <div className="col">
      <div
        className="card border-0 shadow-sm rounded-3 overflow-hidden bg-dark text-white"
        data-emergencia-id={dataEmergenciaId}
        style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease, opacity 0.5s" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
        role="region"
        aria-label={`Tarjeta de ${emergencia.servicio}`}
      >
        {/* Imagen representativa del servicio de emergencia */}
        <img
          src={EmergenciaIcono}
          className="card-img-top"
          alt={`Ícono de ${emergencia.servicio}`}
          style={{ objectFit: "cover", height: "150px" }}
          loading="lazy"
        />
        <div className="card-body text-center">
          <h6 className="card-title mb-2">{emergencia.servicio}</h6>
          <p className="card-text">{emergencia.descripcion}</p>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <button
              className="btn btn-primary btn-sm d-flex justify-content-center align-items-center gap-2"
              onClick={() => onCardClick(emergencia)}
              aria-label={`Ver información de ${emergencia.servicio}`}
              tabIndex={-1}
            >
              Ver información
            </button>
            <input
              type="checkbox"
              className="form-check-input ms-2"
              checked={isSelected}
              onChange={e => { e.stopPropagation(); onSelect(emergencia.id); }}
              aria-label="Seleccionar para eliminar"
              tabIndex={-1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal que contiene la lista de contactos de emergencia
function ContactosEmergencia() {
  // Definimos la lista inicial de contactos de emergencia
  const contactosEmergenciaIniciales = [
    { id: 1, servicio: "Policía Nacional", telefono: "911", descripcion: "Emergencias policiales" },
    { id: 2, servicio: "Bomberos", telefono: "102", descripcion: "Incendios y rescates" },
    { id: 3, servicio: "Ambulancia", telefono: "103", descripcion: "Emergencias médicas" },
    { id: 4, servicio: "Cruz Roja", telefono: "104", descripcion: "Rescate y atención médica" },
    { id: 5, servicio: "Defensa Civil", telefono: "105", descripcion: "Emergencias generales" },
  ];

  const [busqueda, setBusqueda] = useState(""); // Estado para la barra de búsqueda
  const [contactos, setContactos] = useState(contactosEmergenciaIniciales); // Estado para almacenar los contactos
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [emergenciaSeleccionada, setEmergenciaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState({ servicio: "", descripcion: "", telefono: "" });

  // Filtrar los contactos según el término de búsqueda
  const contactosFiltrados = contactos.filter((contacto) =>
    contacto.servicio.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función que simula la acción de llamar a un número de emergencia
  const manejarLlamada = (telefono) => {
    alert(`Llamando al número de emergencia: ${telefono}`);
    console.log(`Realizando llamada al número: ${telefono}`);
  };

  const handleSelectServicio = (id) => {
    setServiciosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const handleCardClick = (emergencia) => {
    setEmergenciaSeleccionada(emergencia);
    setMostrarModal(true);
  };

  const handleAgregarServicio = async () => {
    if (!nuevoServicio.servicio.trim() || !nuevoServicio.telefono.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "El nombre del servicio y el teléfono son obligatorios.",
      });
      return;
    }
    // Aquí deberías hacer la petición al backend para guardar el nuevo servicio
    // Por ahora solo lo agregamos localmente
    setContactos(prev => [
      { id: Date.now(), ...nuevoServicio },
      ...prev
    ]);
    setMostrarFormulario(false);
    setNuevoServicio({ servicio: "", descripcion: "", telefono: "" });
    Swal.fire({
      icon: "success",
      title: "¡Servicio agregado!",
      text: "El servicio de emergencia se ha agregado correctamente.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Modal para ver detalles de emergencia
  {mostrarModal && (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      {/* Aquí se debe renderizar <ContactosEmergenciaModal emergencia={emergenciaSeleccionada} onClose={() => setMostrarModal(false)} /> */}
    </div>
  )}

  // Función para actualizar la emergencia editada
  const actualizarEmergencia = (emergenciaEditada) => {
    setContactos(prev => prev.map(e => e.id === emergenciaEditada.id ? emergenciaEditada : e));
  };

  // Lógica para eliminar servicios seleccionados con confirmación
  const handleEliminarServiciosSeleccionados = async () => {
    if (serviciosSeleccionados.length === 0) return;
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar ${serviciosSeleccionados.length > 1 ? 'estos servicios' : 'este servicio'} de emergencia?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<span style="font-size:1.1rem; font-weight:500;">Sí, eliminar</span>',
      cancelButtonText: '<span style="font-size:1.1rem; font-weight:500;">Cancelar</span>',
      background: 'rgba(255,255,255,0.95)',
      customClass: {
        popup: 'shadow',
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary ms-2'
      },
      buttonsStyling: false
    });
    if (result.isConfirmed) {
      // Efecto de "desvanecimiento" visual
      serviciosSeleccionados.forEach(id => {
        const card = document.querySelector(`[data-emergencia-id="${id}"]`);
        if (card) {
          card.style.transition = 'opacity 0.5s';
          card.style.opacity = 0.3;
        }
      });
      setTimeout(() => {
        setContactos(prev => prev.filter(e => !serviciosSeleccionados.includes(e.id)));
        setServiciosSeleccionados([]);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El servicio(s) de emergencia ha sido eliminado.',
          timer: 1200,
          showConfirmButton: false,
          background: 'rgba(255,255,255,0.95)'
        });
      }, 500);
    }
  };

  return (
    <div>
      {/* Encabezado de la página */}
      <h1 className="page-header">
        Contactos de Emergencia <small>Información útil</small>
      </h1>
      <Panel>
        <PanelHeader>
          <h4 className="panel-title">Lista de Contactos de Emergencia</h4>
        </PanelHeader>
        <PanelBody>
          {/* Sección del buscador */}
          <div className="row mb-3">
            <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-danger"
                  onClick={handleEliminarServiciosSeleccionados}
                  disabled={serviciosSeleccionados.length === 0}
                >
                  <i className="bi bi-trash"></i> Eliminar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setMostrarFormulario(true)}
                >
                  <i className="bi bi-plus-circle"></i> Agregar Servicio
                </button>
              </div>
            </div>
          </div>
          {/* Contenedor de las tarjetas de contactos */}
          <div className="container-fluid mt-5 p-4 bg-white rounded-3 shadow">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {/* Se renderizan dinámicamente las tarjetas de los contactos filtrados */}
              {contactosFiltrados.map((emergencia) => (
                <EmergenciaCard
                  key={emergencia.id}
                  emergencia={emergencia}
                  onSelect={handleSelectServicio}
                  isSelected={serviciosSeleccionados.includes(emergencia.id)}
                  onCardClick={handleCardClick}
                  dataEmergenciaId={emergencia.id}
                />
              ))}
            </div>
          </div>
          {/* Modal para ver detalles de emergencia */}
          {mostrarModal && (
            <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <ContactosEmergenciaModal
                emergencia={emergenciaSeleccionada}
                onClose={() => setMostrarModal(false)}
                onSave={actualizarEmergencia}
              />
            </div>
          )}
          {/* Modal para agregar servicio de emergencia */}
          {mostrarFormulario && (
            <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" style={{ fontSize: "17px", fontWeight: "bold" }}>
                      Agregar Servicio de Emergencia
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setMostrarFormulario(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre del servicio de emergencia</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoServicio.servicio}
                        onChange={e => setNuevoServicio({ ...nuevoServicio, servicio: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción del servicio de emergencia</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoServicio.descripcion}
                        onChange={e => setNuevoServicio({ ...nuevoServicio, descripcion: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Teléfono del servicio de emergencia</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoServicio.telefono}
                        onChange={e => setNuevoServicio({ ...nuevoServicio, telefono: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary d-flex align-items-center"
                      onClick={() => setMostrarFormulario(false)}
                    >
                      <i className="fas fa-times me-2"></i> Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary d-flex align-items-center"
                      onClick={handleAgregarServicio}
                      disabled={!nuevoServicio.servicio.trim() || !nuevoServicio.telefono.trim()}
                    >
                      <i className="fas fa-save me-2"></i> Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

// Exportamos el componente principal
export default ContactosEmergencia;
