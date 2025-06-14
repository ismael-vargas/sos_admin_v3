/* gestion_usuarios.jsx */
/* -------------------*/
// Importación React, hooks y librerías necesarias
import React, { useState } from "react";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search, Trash } from "lucide-react";
import UsuarioModal from "./usuario_modal.jsx";
import "../../assets/scss/gestion_usuarios.scss";


// Definimos la constante que contiene la base de la URL para las imágenes
const BASE_IMG_URL = "/assets/img/";

// Componente UsuarioCard: Representa una tarjeta individual de usuario
function UsuarioCard({ usuario, onVerInformacionClick, onSelectUsuario, isSelected, isDeleted }) {
    return (
        <div
            // Clase dinámica basada en si el usuario está eliminado
            className={`col ${isDeleted ? "bg-light text-danger" : ""}`}
            style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease", // Transiciones para animaciones suaves
                opacity: isDeleted ? 0.5 : 1, // Reducimos la opacidad si el usuario está eliminado
            }}
            onMouseEnter={(e) => {
                // Efecto zoom al pasar el mouse, solo si no está eliminado
                if (!isDeleted) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                }
            }}
            onMouseLeave={(e) => {
                // Eliminamos el efecto zoom cuando el mouse sale de la tarjeta
                if (!isDeleted) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
                }
            }}
        >
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                {/* Imagen del usuario */}
                <img
                    src={`${BASE_IMG_URL}${usuario.imagen}`}
                    className="card-img-top"
                    alt={`Imagen de ${usuario.nombre}`}
                    style={{
                        objectFit: "cover", // Aseguramos que la imagen se ajuste sin distorsión
                        height: "200px", // Altura fija de la imagen
                        width: "100%", // Ancho completo de la tarjeta
                    }}
                />
                {/* Cuerpo de la tarjeta */}
                <div className="card-body bg-dark text-white text-center">
                    <h6 className="card-title mb-2" style={{ fontSize: "calc(1rem + 2px)" }}>
                        {usuario.nombre} {/* Nombre del usuario */}
                    </h6>
                    {/* Botón para ver más información */}
                    <button className="btn btn-primary btn-sm" onClick={() => onVerInformacionClick(usuario)}>
                        Ver Información
                    </button>
                    {/* Checkbox para seleccionar al usuario */}
                    <div className="form-check mt-2">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => onSelectUsuario(usuario.id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente principal para gestionar usuarios
function GestionUsuarios() {
    // Estado inicial de los usuarios
    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: "Ismael Vargas", correo: "ism@gmail.com", telefono: "0962658076", cedula: "1729356269", direccion: "Panecillo", imagen: "perfil.jpg", eliminado: false },
        { id: 2, nombre: "Juan Pérez", imagen: "foto10.jpg", eliminado: false },
        { id: 3, nombre: "María López", imagen: "foto9.jpg", eliminado: false },
        { id: 4, nombre: "Carlos Gómez", imagen: "foto3.jpg", eliminado: false },
        { id: 5, nombre: "Ana Ramírez", imagen: "foto2.jpg", eliminado: false },
        { id: 6, nombre: "Pedro Martínez", imagen: "foto4.jpg", eliminado: false },
        { id: 7, nombre: "Luz Fernández", imagen: "chica2.jpg", eliminado: false },
        { id: 8, nombre: "Erika Pozo", imagen: "chica.jpg", eliminado: false },
        { id: 9, nombre: "Juanita Pérez", imagen: "chica3.jpg", eliminado: false },
        { id: 10, nombre: "Carlos Rodríguez", imagen: "chica4.jpg", eliminado: false },
    ]);

    const [busqueda, setBusqueda] = useState(""); // Búsqueda dinámica por nombre
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Usuario seleccionado para más información
    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]); // Lista de IDs seleccionados
    const [paginaActual, setPaginaActual] = useState(1); // Página actual de la paginación

    const usuariosPorPagina = 8; // Número de usuarios a mostrar por página

    // Filtramos usuarios por coincidencia en el nombre
    const usuariosFiltrados = usuarios.filter((usuario) =>
        usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Ordenamos los usuarios, colocando los eliminados al final
    const usuariosOrdenados = [
        ...usuariosFiltrados.filter((usuario) => !usuario.eliminado),
        ...usuariosFiltrados.filter((usuario) => usuario.eliminado),
    ];

    // Lógica de paginación
    const indexOfLastUser = paginaActual * usuariosPorPagina;
    const indexOfFirstUser = indexOfLastUser - usuariosPorPagina;
    const usuariosMostrados = usuariosOrdenados.slice(indexOfFirstUser, indexOfLastUser);

    const totalPaginas = Math.ceil(usuariosOrdenados.length / usuariosPorPagina);

    // Función para marcar usuarios como eliminados
    const handleEliminarUsuarios = () => {
        const usuariosActualizados = usuarios.map((usuario) =>
            usuariosSeleccionados.includes(usuario.id) ? { ...usuario, eliminado: true } : usuario
        );
        setUsuarios(usuariosActualizados);
        setUsuariosSeleccionados([]);
    };

    // Función para manejar la selección de usuarios
    const handleSeleccionarUsuario = (id) => {
        setUsuariosSeleccionados((prevSeleccionados) =>
            prevSeleccionados.includes(id)
                ? prevSeleccionados.filter((usuarioId) => usuarioId !== id)
                : [...prevSeleccionados, id]
        );
    };

    // Función para cambiar de página en la paginación
    const handleCambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    return (
        <div>
            {/* Encabezado de la página */}
            <h1 className="page-header">
                Gestión de Usuarios <small>administración de usuarios</small>
            </h1>

            <Panel>
                <PanelHeader>
                    <h4 className="panel-title">Usuarios</h4>
                </PanelHeader>
                <PanelBody>
                    {/* Barra de búsqueda y acciones */}
                    <div className="row mb-3">
                        <div className="col-12 d-flex flex-wrap justify-content-between align-items-center gap-3">
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
                            <div className="d-flex flex-wrap gap-2">
                                <button
                                    className="btn btn-danger"
                                    onClick={handleEliminarUsuarios}
                                    disabled={usuariosSeleccionados.length === 0}
                                >
                                    <Trash size={18} /> Eliminar
                                </button>

                            </div>
                        </div>
                    </div>
                    {/* Contenedor de las tarjetas de usuarios */}
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {usuariosMostrados.map((usuario) => (
                            <UsuarioCard
                                key={usuario.id}
                                usuario={usuario}
                                onVerInformacionClick={setUsuarioSeleccionado}
                                onSelectUsuario={handleSeleccionarUsuario}
                                isSelected={usuariosSeleccionados.includes(usuario.id)}
                                isDeleted={usuario.eliminado}
                            />
                        ))}
                    </div>

                    {/* Navegación para la paginación */}
                    <nav aria-label="Page navigation" className="mt-4">
                        <ul className="pagination justify-content-end">
                            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handleCambiarPagina(paginaActual - 1)}
                                >
                                    Anterior
                                </button>
                            </li>
                            {[...Array(totalPaginas)].map((_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${paginaActual === index + 1 ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handleCambiarPagina(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handleCambiarPagina(paginaActual + 1)}
                                >
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                </PanelBody>
            </Panel>

            {/* Modal para mostrar información del usuario */}
            {usuarioSeleccionado && (
                <UsuarioModal
                    usuario={usuarioSeleccionado}
                    onClose={() => setUsuarioSeleccionado(null)}
                />
            )}
        </div>
    );
}

export default GestionUsuarios;