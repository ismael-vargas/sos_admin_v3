/* rol.jsx */
/* -------------------*/
import React, { useState } from "react";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search } from "lucide-react";
import RolModal from "./rolModal.jsx";

// Definimos la constante que contiene la base de la URL para las imágenes
const BASE_IMG_URL = "./assets/img";

// Componente para la barra de búsqueda
function Buscador({ busqueda, setBusqueda }) {
  return (
    <div className="input-group" style={{ maxWidth: "400px" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar roles..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <span className="input-group-text">
        <Search size={18} />
      </span>
    </div>
  );
}

// Componente para las tarjetas de rol
function RolCard({ rol, onFlechaClick, onSelectRol, isSelected }) {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div
        className={`card border-0 shadow-sm rounded-3 overflow-hidden ${rol.eliminado ? "bg-light text-danger" : ""}`}
        style={{
          transition: rol.eliminado ? "none" : "transform 0.3s ease, box-shadow 0.3s ease",
          opacity: rol.eliminado ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!rol.eliminado) {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <img
          src={rol.imagen}
          className="card-img-top"
          alt={`Imagen de ${rol.nombre}`}
          style={{ objectFit: "cover", height: "200px", width: "100%" }}
          loading="lazy"
        />
        <div className="card-body bg-dark text-white text-center">
          <h6 className="card-title mb-2" style={{ fontSize: "1rem" }}>{rol.nombre}</h6>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-primary btn-sm d-flex justify-content-center align-items-center"
              onClick={() => onFlechaClick(rol)}
            >
              Ver Información
            </button>

          </div>
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isSelected}
              onChange={() => onSelectRol(rol.id)}
              id={`select-${rol.id}`}
            />
            <label className="form-check-label" htmlFor={`select-${rol.id}`}></label>
          </div>
        </div>


      </div>
    </div>
  );
}

// Modal para agregar un nuevo rol
function AgregarRolModal({ show, onClose, onSave }) {
  const [nombre, setNombre] = useState(""); // Estado para el nombre del rol
  const [imagen, setImagen] = useState(null); // Estado para la imagen del rol

  const handleSave = () => {
    if (nombre && imagen) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onSave({ nombre, imagen: e.target.result });
        onClose();
      };
      reader.readAsDataURL(imagen);
    } else {
      alert("Por favor ingrese un nombre y seleccione una imagen para el rol");
    }
  };

  if (!show) return null; // No renderiza el modal si no está visible

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Rol</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Formulario para nombre del rol */}
            <div className="form-group">
              <label className="form-label d-block">Nombre del Rol</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese el nombre del rol"
              />
            </div>
            {/* Formulario para imagen del rol */}
            <div className="form-group mt-2">
              <label className="form-label d-block">Imagen del Rol</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setImagen(e.target.files[0])}
                accept="image/*"
              />
            </div>
          </div>
          <div className="modal-footer">
            {/* Botones para cerrar o guardar */}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal
function Rol() {
  const initialRoles = [
    { id: 1, nombre: "Daniel Perez", rol: "Administrador", imagen: `${BASE_IMG_URL}/admin.jpg`, eliminado: false },
    { id: 2, nombre: "Erick Peña", rol: "Administrador", imagen: `${BASE_IMG_URL}/admin.jpg`, eliminado: false },
    { id: 3, nombre: "Omar Carvajal", rol: "Usuario", imagen: `${BASE_IMG_URL}/usuario.jpg`, eliminado: false },
    { id: 4, nombre: "Oscar Mendoza", rol: "Usuario", imagen: `${BASE_IMG_URL}/usuario.jpg`, eliminado: false },
  ];

  const [busqueda, setBusqueda] = useState("");
  const [roles, setRoles] = useState(initialRoles);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const rolesFiltrados = roles.filter((rol) =>
    rol.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminarRolesSeleccionados = () => {
    setRoles((prevRoles) => {
      const rolesActualizados = prevRoles.map((rol) =>
        rolesSeleccionados.includes(rol.id) ? { ...rol, eliminado: true } : rol
      );

      return [
        ...rolesActualizados.filter((rol) => !rol.eliminado),
        ...rolesActualizados.filter((rol) => rol.eliminado),
      ];
    });
    setRolesSeleccionados([]);
  };

  const handleSelectRol = (id) => {
    setRolesSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((rolId) => rolId !== id)
        : [...prevSeleccionados, id]
    );
  };

  const handleAgregarRol = (nuevoRol) => {
    setRoles((prevRoles) => {
      // Encuentra el índice del primer rol eliminado
      const indexEliminado = prevRoles.findIndex((rol) => rol.eliminado);

      // Crea un nuevo rol con un ID único
      const nuevoRolConId = { ...nuevoRol, id: prevRoles.length + 1, eliminado: false };

      if (indexEliminado === -1) {
        // Si no hay roles eliminados, agrega al final
        return [...prevRoles, nuevoRolConId];
      } else {
        // Inserta el nuevo rol antes del primer eliminado
        return [
          ...prevRoles.slice(0, indexEliminado),
          nuevoRolConId,
          ...prevRoles.slice(indexEliminado),
        ];
      }
    });
  };

  const handleAbrirModal = (rol) => {
    setRolSeleccionado({ ...rol });
  };

  const handleCerrarModal = () => {
    setRolSeleccionado(null);
  };

  const handleGuardarRol = (rolEditado) => {
    setRoles((prevRoles) =>
      prevRoles.map((rol) => (rol.id === rolEditado.id ? { ...rolEditado } : rol))
    );
    setRolSeleccionado(null);
  };

  return (
    <div>
      <h1 className="page-header">
        Gestión de Roles <small>administración de roles </small>
      </h1>
      <Panel>
        <PanelHeader>
          <h4 className="panel-title"> Gestión de Roles</h4>
        </PanelHeader>
        <PanelBody>
          <div className="row mb-3">
            <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-danger"
                  onClick={handleEliminarRolesSeleccionados}
                  disabled={rolesSeleccionados.length === 0}
                >
                  <i className="bi bi-trash"></i> Eliminar
                </button>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setModalVisible(true)}>
                  <i className="bi bi-plus-circle"></i> Agregar
                </button>
              </div>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {rolesFiltrados.map((rol) => (
              <RolCard
                key={rol.id}
                rol={rol}
                onFlechaClick={handleAbrirModal}
                onSelectRol={handleSelectRol}
                isSelected={rolesSeleccionados.includes(rol.id)}
              />
            ))}
          </div>
        </PanelBody>
      </Panel>

      {rolSeleccionado && (
        <RolModal
          rol={rolSeleccionado}
          onClose={handleCerrarModal}
          onSave={handleGuardarRol}
        />
      )}

      <AgregarRolModal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAgregarRol}
      />
    </div>
  );
}

export default Rol;
