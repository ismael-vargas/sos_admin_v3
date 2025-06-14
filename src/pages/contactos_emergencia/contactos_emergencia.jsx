/* contactos_emergencia.jsx */
/* -------------------*/
// Importación de librerías y componentes necesarios
import React, { useState } from "react"; // Importamos React y el hook useState para gestionar el estado local
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx"; // Importamos los componentes del panel
import { Search, PhoneCall } from "lucide-react"; // Importamos iconos de la librería lucide-react
import EmergenciaIcono from "../../assets/img/emergencia_icono.jpg"; // Importamos una imagen de ícono de emergencia

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
function EmergenciaCard({ emergencia, onLlamar }) {
  return (
    <div className="col">
      <div
        className="card border-0 shadow-sm rounded-3 overflow-hidden"
        style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
        role="button"
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
          {/* Botón para realizar una llamada al servicio de emergencia */}
          <button
            className="btn btn-danger btn-sm d-flex justify-content-center align-items-center gap-2"
            onClick={() => onLlamar(emergencia.telefono)}
            aria-label={`Llamar a ${emergencia.servicio}`}
          >
            <PhoneCall size={18} aria-hidden="true" />
            Llamar: {emergencia.telefono}
          </button>
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
  const [contactos] = useState(contactosEmergenciaIniciales); // Estado para almacenar los contactos

  // Filtrar los contactos según el término de búsqueda
  const contactosFiltrados = contactos.filter((contacto) =>
    contacto.servicio.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función que simula la acción de llamar a un número de emergencia
  const manejarLlamada = (telefono) => {
    alert(`Llamando al número de emergencia: ${telefono}`);
    console.log(`Realizando llamada al número: ${telefono}`);
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
            <div className="col-12 d-flex justify-content-between align-items-center">
              <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
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
                  onLlamar={manejarLlamada}
                />
              ))}
            </div>
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}

// Exportamos el componente principal
export default ContactosEmergencia;
