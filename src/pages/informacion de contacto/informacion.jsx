/* informacion_contacto_usuario.jsx */
/* -------------------*/
// Importación de bibliotecas y componentes necesarios
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search } from "lucide-react";
import InformacionModal from "./informacion_modal.jsx";
import Swal from "sweetalert2"; // Importa SweetAlert
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
          transition: "transform 0.2s ease",
          cursor: eliminado ? "not-allowed" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!eliminado) {
            e.currentTarget.style.transform = "scale(1.05)"; // Efecto de zoom reducido
          }
        }}
        onMouseLeave={(e) => {
          if (!eliminado) {
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        <img
          src="/assets/img/Pinteres.jpeg" // Ruta absoluta
          alt={`Imagen de ${informacion.nombre}`}
          className="card-img-top"
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
  const [busqueda, setBusqueda] = useState("");
  const [informaciones, setInformaciones] = useState([]);
  const [informacionSeleccionada, setInformacionSeleccionada] = useState(null);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", numero: "", usuario_id: "" });

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("http://localhost:9000/csrf-token", { withCredentials: true });
        localStorage.setItem("csrfToken", response.data.csrfToken); // Almacenar el token CSRF
      } catch (error) {
        console.error("Error al obtener el token CSRF:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error al cargar token CSRF",
          text: "Hubo un error al obtener el token de seguridad. Por favor, inténtelo de nuevo.",
        });
      }
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const fetchInformaciones = async () => {
      try {
        const response = await axios.get("http://localhost:9000/usuarios_numeros", {
          withCredentials: true,
        });

        const datos = response.data.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          numero: item.numero,
          eliminado: item.estado === "eliminado",
        }));

        setInformaciones(datos);
      } catch (error) {
        console.error("Error al obtener la información:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error al cargar datos",
          text: "Hubo un error al obtener la información. Por favor, inténtelo de nuevo.",
        });
      }
    };

    fetchInformaciones();
  }, []);
const handleEliminarInformacion = async () => {
  const csrfToken = localStorage.getItem("csrfToken");

  try {
    // Actualizamos el estado local para eliminar las tarjetas inmediatamente
    setInformaciones((prevInformaciones) =>
      prevInformaciones.filter((info) => !usuariosSeleccionados.includes(info.id))
    );

    // Luego hacemos las llamadas al backend
    for (const id of usuariosSeleccionados) {
      await axios.put(
        `http://localhost:9000/usuarios_numeros/${id}`,
        { estado: "eliminado" },
        {
          headers: {
            "CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );
    }

    setUsuariosSeleccionados([]);

    // Mostrar alerta de eliminación exitosa
    Swal.fire({
      icon: "success",
      title: "¡Eliminación exitosa!",
      text: "Los números seleccionados han sido eliminados correctamente.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error al eliminar la información:", error.message);

    // Si hay un error, revertimos los cambios en el estado local
    Swal.fire({
      icon: "error",
      title: "Error al eliminar",
      text: "Hubo un error al eliminar la información. Por favor, inténtelo de nuevo.",
    });

    // Recuperamos las tarjetas eliminadas en caso de error
    const response = await axios.get("http://localhost:9000/usuarios_numeros", {
      withCredentials: true,
    });
    setInformaciones(response.data);
  }
};

  const handleGuardarNuevoUsuario = async () => {
    const csrfToken = localStorage.getItem("csrfToken"); // Asegúrate de que el token esté almacenado

    if (!nuevoUsuario.nombre || !nuevoUsuario.numero || !nuevoUsuario.usuario_id) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos antes de guardar.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/usuarios_numeros",
        {
          nombre: nuevoUsuario.nombre,
          numero: nuevoUsuario.numero,
          usuario_id: nuevoUsuario.usuario_id,
        },
        {
          headers: {
            "CSRF-Token": csrfToken, // Enviar el token CSRF en el encabezado
          },
          withCredentials: true, // Asegúrate de enviar las cookies
        }
      );

      setInformaciones((prevInformaciones) => [
        {
          id: response.data.usuarioNumero.id,
          nombre: nuevoUsuario.nombre,
          numero: nuevoUsuario.numero,
          eliminado: false,
        },
        ...prevInformaciones,
      ]);

      setNuevoUsuario({ nombre: "", numero: "", usuario_id: "" });
      setMostrarFormulario(false);

      Swal.fire({
        icon: "success",
        title: "¡Número agregado!",
        text: "El número ha sido agregado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al guardar el nuevo usuario:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Hubo un error al guardar el usuario. Por favor, inténtelo de nuevo.",
      });
    }
  };

  const usuariosFiltrados = informaciones.filter((info) =>
    info.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

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
                onClick={() => setMostrarFormulario(true)}
              >
                <i className="bi bi-plus-circle"></i>Agregar
              </button>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {usuariosFiltrados.map((informacion) => (
              <InformacionCard
                key={informacion.id}
                informacion={informacion}
                onFlechaClick={setInformacionSeleccionada}
                seleccionado={usuariosSeleccionados.includes(informacion.id)}
                onSelect={(id) =>
                  setUsuariosSeleccionados((prevSeleccionados) =>
                    prevSeleccionados.includes(id)
                      ? prevSeleccionados.filter((usuarioId) => usuarioId !== id)
                      : [...prevSeleccionados, id]
                  )
                }
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
          setInformaciones={setInformaciones} // Pasar setInformaciones al modal
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
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
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Número</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoUsuario.numero}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, numero: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Usuario ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoUsuario.usuario_id}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, usuario_id: e.target.value })}
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
