/* informacion_contacto_usuario.jsx */
/* -------------------*/
// Importación de bibliotecas y componentes necesarios
import React, { useState } from "react";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search } from "lucide-react";
import InformacionModal from "./informacion_modal.jsx";
import Pinteres from "../../assets/img/Pinteres.jpeg";
import "../../assets/scss/informacion.scss";

// Componente para la barra de búsqueda
function Buscador({ busqueda, setBusqueda }) {
  return (
    <div className="input-group" style={{ maxWidth: "400px" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar usuario..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <span className="input-group-text">
        <Search size={18} />
      </span>
    </div>
  );
}

// Componente para mostrar la tarjeta de información de cada usuario
function InformacionCard({ informacion, onFlechaClick, seleccionado, onSelect, eliminado }) {
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
            e.currentTarget.style.transform = "scale(1.1)";
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
          src={informacion.imagen}
          className="card-img-top"
          alt={`Imagen de ${informacion.nombre}`}
          style={{ objectFit: "cover", height: "200px" }}
          loading="lazy"
        />
        <div className="card-body bg-dark text-white text-center">
          <h6 className="card-title mb-1">{informacion.nombre}</h6>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onFlechaClick(informacion)}
              disabled={eliminado}
            >
              Ver Información
            </button>
          </div>
          <div className="form-check mt-2">
            <input
              type="checkbox"
              checked={seleccionado}
              onChange={() => onSelect(informacion.id)}
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

// Componente principal
function InformacionContactosUsuarios() {
  const initialInformaciones = [
    { id: 1, nombre: "Ismael Vera", numero: "123-456-789", imagen: Pinteres, eliminado: false },
    { id: 2, nombre: "Juan Pérez", numero: "987-654-321", imagen: Pinteres, eliminado: false },
    { id: 3, nombre: "María López", numero: "555-555-555", imagen: Pinteres, eliminado: false },
  ];

  const [busqueda, setBusqueda] = useState("");
  const [informaciones, setInformaciones] = useState(initialInformaciones);
  const [informacionSeleccionada, setInformacionSeleccionada] = useState(null);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({ id: "", nombre: "", numero: "" });

  const informacionesFiltradas = informaciones.filter((informacion) =>
    informacion.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminarInformacion = () => {
    const informacionesActualizadas = informaciones.map((informacion) =>
      usuariosSeleccionados.includes(informacion.id)
        ? { ...informacion, eliminado: true }
        : informacion
    );

    // Ordena las informaciones: las eliminadas irán al final
    const informacionesOrdenadas = informacionesActualizadas.sort((a, b) => {
      if (a.eliminado && !b.eliminado) return 1; // 'a' va al final
      if (!a.eliminado && b.eliminado) return -1; // 'b' va al final
      return 0; // No cambia el orden
    });

    setInformaciones(informacionesOrdenadas);
    setUsuariosSeleccionados([]);
  };


  const handleSeleccionarUsuario = (id) => {
    setUsuariosSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((usuarioId) => usuarioId !== id)
        : [...prevSeleccionados, id]
    );
  };

  const handleAgregarInformacion = () => {
    setMostrarFormulario(true);
  };

  const handleGuardarNuevoUsuario = () => {
    if (nuevoUsuario.nombre && nuevoUsuario.numero) {
      setInformaciones((prevInformaciones) => [
        { id: prevInformaciones.length + 1, ...nuevoUsuario, eliminado: false, imagen: Pinteres },
        ...prevInformaciones,
      ]);
      setNuevoUsuario({ id: "", nombre: "", numero: "" });
      setMostrarFormulario(false);
    } else {
      alert("Por favor complete todos los campos.");
    }
  };

  return (
    <div>

      <h1 className="page-header">
        Información de Contacto Usuario <small>administración</small>
      </h1>

      <Panel>
        <PanelHeader>
          <h4 className="panel-title">Información de Contacto del Usuario</h4>
        </PanelHeader>
        <PanelBody>
          <div className="row mb-3">
            <div className="col-12 col-lg-6 mb-2">
              <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
            </div>
            <div className="col-12 col-lg-6 d-flex flex-wrap justify-content-lg-end gap-2">
              <button
                className="btn btn-danger"
                onClick={handleEliminarInformacion}
                disabled={usuariosSeleccionados.length === 0}
              >
                <i className="bi bi-trash"></i> Eliminar
              </button>
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={handleAgregarInformacion}
              >
                <i className="bi bi-plus-circle"></i>Agregar
              </button>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {informacionesFiltradas.map((informacion) => (
              <InformacionCard
                key={informacion.id}
                informacion={informacion}
                onFlechaClick={setInformacionSeleccionada}
                seleccionado={usuariosSeleccionados.includes(informacion.id)}
                onSelect={handleSeleccionarUsuario}
                eliminado={informacion.eliminado}
              />
            ))}
          </div>
        </PanelBody>
      </Panel>

      {informacionSeleccionada && (
        <InformacionModal
          informacion={informacionSeleccionada}
          onClose={() => setInformacionSeleccionada(null)}
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
            className="modal-dialog modal-dialog-centered" // Esto centra el modal
            style={{
              zIndex: 1050,
              maxWidth: "500px", // Máximo tamaño
              width: "100%", // Siempre ocupa el 100% del ancho
            }}
          >
            <div
              className="modal-content"
              style={{
                border: "none", // Sin bordes
                borderRadius: "0", // Sin bordes redondeados
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Agregar Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarFormulario(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoUsuario.nombre}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Número</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoUsuario.numero}
                    onChange={(e) =>
                      setNuevoUsuario({ ...nuevoUsuario, numero: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGuardarNuevoUsuario}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}

export default InformacionContactosUsuarios;
