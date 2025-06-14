/* dispositivos.jsx */
/* -------------------*/
import React, { useState } from "react";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search } from "lucide-react";
import DispositivosModal from "./dispositivos_modal.jsx";  // Actualizado
import Celular from "../../assets/img/celular.jpg"; // Imagen actualizada

// Componente para la barra de búsqueda
function Buscador({ busqueda, setBusqueda }) {
  return (
    <div className="input-group" style={{ maxWidth: "400px" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar dispositivo..."
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
          src={Celular}
          className="card-img-top"
          alt={`Imagen de ${dispositivo.id}`}
          style={{ objectFit: "cover", height: "200px" }}
          loading="lazy"
        />
        <div className="card-body bg-dark text-white text-center">
          <h6 className="card-title mb-1">ID Cliente: {dispositivo.clienteId}</h6> {/* Solo el ID Cliente */}
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onFlechaClick(dispositivo)}
              disabled={eliminado}
            >
              Ver Información
            </button>
          </div>
          <div className="form-check mt-2">
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
  const initialDispositivos = [
    { id: 1, clienteId: "505", tipoDispositivo: "Android", nombre: "Samsung Galaxy Tab S7", eliminado: false },
    { id: 2, clienteId: "909", tipoDispositivo: "iOS", nombre: "iPhone 13", eliminado: false },
    { id: 3, clienteId: "101", tipoDispositivo: "Android", nombre: "Google Pixel 6", eliminado: false },
  ];

  const [busqueda, setBusqueda] = useState("");
  const [dispositivos, setDispositivos] = useState(initialDispositivos);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);
  const [dispositivosSeleccionados, setDispositivosSeleccionados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoDispositivo, setNuevoDispositivo] = useState({ dispositivo: "", tipo: "", clienteId: "" });
  const [dispositivoEditando, setDispositivoEditando] = useState(null);

  const dispositivosFiltrados = dispositivos.filter((dispositivo) =>
    dispositivo.clienteId.toLowerCase().includes(busqueda.toLowerCase()) // Filtrar por el ID Cliente
  );

  const handleEliminarDispositivo = () => {
    const dispositivosActualizados = dispositivos.map((dispositivo) =>
      dispositivosSeleccionados.includes(dispositivo.id)
        ? { ...dispositivo, eliminado: true }
        : dispositivo
    );

    // Reordenar los dispositivos para que los eliminados vayan al final
    const dispositivosOrdenados = dispositivosActualizados.sort((a, b) =>
      a.eliminado === b.eliminado ? 0 : a.eliminado ? 1 : -1
    );

    setDispositivos(dispositivosOrdenados);  // Actualizar el estado con los dispositivos ordenados
    setDispositivosSeleccionados([]);  // Limpiar la selección de dispositivos
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
    setDispositivoEditando(null); // Asegurarse de que no se esté editando un dispositivo cuando se agrega uno nuevo
  };

  const handleEdit = (dispositivo) => {
    // Almacena el dispositivo seleccionado en el estado para editar
    setDispositivoEditando(dispositivo);
    setNuevoDispositivo({
      dispositivo: dispositivo.nombre,
      tipo: dispositivo.tipoDispositivo,
      clienteId: dispositivo.clienteId,
    });
    setMostrarFormulario(true);

    // Guardar el dispositivo editado en localStorage (por si es necesario para futuras consultas)
    localStorage.setItem("dispositivoEditando", JSON.stringify(dispositivo));
  };

  const handleGuardarNuevoDispositivo = () => {
    // Verificar que los campos no estén vacíos
    if (nuevoDispositivo.dispositivo && nuevoDispositivo.tipo) {
      if (dispositivoEditando) {
        // Editar dispositivo
        const dispositivosActualizados = dispositivos.map((dispositivo) =>
          dispositivo.id === dispositivoEditando.id
            ? { ...dispositivo, nombre: nuevoDispositivo.dispositivo, tipoDispositivo: nuevoDispositivo.tipo } // Actualizar solo los campos editados
            : dispositivo
        );
        setDispositivos(dispositivosActualizados); // Actualizar el estado con los dispositivos actualizados
      } else {
        // Agregar nuevo dispositivo
        const nuevoDispositivoConId = {
          id: dispositivos.length + 1, // Generar un ID único
          clienteId: `ID-${Math.floor(Math.random() * 1000000)}`, // Generar un ID cliente aleatorio
          nombre: nuevoDispositivo.dispositivo,
          tipoDispositivo: nuevoDispositivo.tipo,
          eliminado: false,
        };

        setDispositivos((prevDispositivos) => [nuevoDispositivoConId, ...prevDispositivos]); // Agregar el nuevo dispositivo
      }

      // Limpiar los campos y cerrar el formulario
      setNuevoDispositivo({ dispositivo: "", tipo: "", clienteId: "" });
      setMostrarFormulario(false);
      setDispositivoEditando(null);
    } else {
      alert("Por favor complete todos los campos.");
    }
  };



  return (
    <div className="container-fluid">
      {/* Encabezado de la página */}
      <h1 className="page-header">
        Dispositivos <small>Información útil</small>
      </h1>
      <Panel>
        <PanelHeader>
          <h4 className="panel-title">Dispositivos</h4>
        </PanelHeader>
        <PanelBody>
          <div className="row mb-3">
            <div className="col-12 col-lg-6 mb-2">
              <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
            </div>
            <div className="col-12 col-lg-6 d-flex flex-wrap justify-content-lg-end gap-2">
              <button
                className="btn btn-danger"
                onClick={handleEliminarDispositivo}
                disabled={dispositivosSeleccionados.length === 0}
              >
                <i className="bi bi-trash"></i> Eliminar
              </button>
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={handleAgregarDispositivo}
              >
                <i className="bi bi-plus-circle"></i>Agregar
              </button>
            </div>
          </div>

          {/* Renderiza las tarjetas de dispositivos */}
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
        </PanelBody>
      </Panel>

      {dispositivoSeleccionado && (
        <DispositivosModal
          dispositivo={dispositivoSeleccionado}
          onClose={() => setDispositivoSeleccionado(null)}
          onDelete={handleEliminarDispositivo}
          onEdit={handleEdit}
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
                  <label className="form-label">Dispositivo</label>
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
                  <label className="form-label">Sistema Operativo</label>
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
                  className="btn btn-secondary"
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGuardarNuevoDispositivo}
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

export default GestionDispositivos;
