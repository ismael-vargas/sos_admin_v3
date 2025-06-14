/* grupos.jsx */
/* -------------------*/
import React, { useState, useCallback } from "react";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search, Trash } from "lucide-react";
import GrupoModal from "./grupo_modal.jsx";

const BASE_IMG_URL = "/assets/img/"; // Base URL segura para las imágenes de grupos

/**
 * Sanitizar texto para evitar riesgos de inyección.
 * @param {string} text - El texto a sanitizar.
 * @returns {string} El texto sanitizado.
 */
const sanitizeText = (text) => text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, "").trim();

/**
 * Componente que representa una tarjeta de grupo.
 */
function GrupoCard({ grupo, onVerInformacionClick, onSelectGrupo, isSelected, isDeleted }) {
    return (
        <div
            className={`col ${isDeleted ? "bg-light text-danger" : ""}`}
            style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                opacity: isDeleted ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
                if (!isDeleted) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                }
            }}
            onMouseLeave={(e) => {
                if (!isDeleted) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
                }
            }}
        >
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                <img
                    src={`${BASE_IMG_URL}${encodeURIComponent(grupo.imagen)}`} // Sanitizar URL
                    className="card-img-top"
                    alt={`Imagen de ${sanitizeText(grupo.nombre)}`}
                    style={{
                        objectFit: "cover",
                        height: "200px",
                        width: "100%",
                    }}
                />
                <div className="card-body bg-dark text-white text-center">
                    <h6 className="card-title mb-2" style={{ fontSize: "calc(1rem + 2px)" }}>
                        {sanitizeText(grupo.nombre)}
                    </h6>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onVerInformacionClick(grupo)}
                    >
                        Ver Información
                    </button>
                    <div className="form-check mt-2">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => onSelectGrupo(grupo.id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Componente principal para la gestión de grupos.
 */
function GestionGrupos() {
    const [grupos, setGrupos] = useState([
        // Lista inicial de grupos
        { id: 1, nombre: "Grupo A", imagen: "911.jpg", miembros: "50", eliminado: false },
        { id: 2, nombre: "Grupo B", imagen: "7.jpg", miembros: "30", eliminado: false },
        { id: 3, nombre: "Grupo C", imagen: "3.jpg", miembros: "60", eliminado: false },
        { id: 4, nombre: "Grupo D", imagen: "grupo.jpg", miembros: "80", eliminado: false },
        { id: 5, nombre: "Grupo E", imagen: "8.jpg", miembros: "70", eliminado: false },
        { id: 6, nombre: "Grupo F", imagen: "6.jpg", miembros: "60", eliminado: false },
    ]);

    const [busqueda, setBusqueda] = useState("");
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const gruposPorPagina = 8;

    const gruposFiltrados = grupos.filter((grupo) =>
        sanitizeText(grupo.nombre.toLowerCase()).includes(sanitizeText(busqueda.toLowerCase()))
    );

    const gruposOrdenados = [
        ...gruposFiltrados.filter((grupo) => !grupo.eliminado),
        ...gruposFiltrados.filter((grupo) => grupo.eliminado),
    ];

    const indexOfLastGrupo = paginaActual * gruposPorPagina;
    const indexOfFirstGrupo = indexOfLastGrupo - gruposPorPagina;
    const gruposMostrados = gruposOrdenados.slice(indexOfFirstGrupo, indexOfLastGrupo);

    const totalPaginas = Math.ceil(gruposOrdenados.length / gruposPorPagina);

    const handleEliminarGrupos = useCallback(() => {
        const gruposActualizados = grupos.map((grupo) =>
            gruposSeleccionados.includes(grupo.id) ? { ...grupo, eliminado: true } : grupo
        );
        setGrupos(gruposActualizados);
        setGruposSeleccionados([]);
    }, [grupos, gruposSeleccionados]);

    const handleSeleccionarGrupo = useCallback(
        (id) => {
            setGruposSeleccionados((prevSeleccionados) =>
                prevSeleccionados.includes(id)
                    ? prevSeleccionados.filter((grupoId) => grupoId !== id)
                    : [...prevSeleccionados, id]
            );
        },
        [setGruposSeleccionados]
    );

    return (
        <div>
            <h1 className="page-header">
                Gestión de Grupos <small>administración de grupos</small>
            </h1>
            <Panel>
                <PanelHeader>
                    <h4 className="panel-title">Grupos</h4>
                </PanelHeader>
                <PanelBody>
                    <div className="row mb-3">
                        <div className="col-12 d-flex flex-wrap justify-content-between align-items-center gap-3">
                            <div className="input-group" style={{ maxWidth: "400px" }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar grupo..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(sanitizeText(e.target.value))}
                                />
                                <span className="input-group-text">
                                    <Search size={18} />
                                </span>
                            </div>
                            <button
                                className="btn btn-danger"
                                onClick={handleEliminarGrupos}
                                disabled={gruposSeleccionados.length === 0}
                            >
                                <Trash size={18} /> Eliminar
                            </button>
                        </div>
                    </div>

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {gruposMostrados.map((grupo) => (
                            <GrupoCard
                                key={grupo.id}
                                grupo={grupo}
                                onVerInformacionClick={setGrupoSeleccionado}
                                onSelectGrupo={handleSeleccionarGrupo}
                                isSelected={gruposSeleccionados.includes(grupo.id)}
                                isDeleted={grupo.eliminado}
                            />
                        ))}
                    </div>

                    <nav aria-label="Page navigation" className="mt-4">
                        <ul className="pagination justify-content-end">
                            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
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
                                        onClick={() => setPaginaActual(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li
                                className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                                >
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                </PanelBody>
            </Panel>

            {grupoSeleccionado && (
                <GrupoModal grupo={grupoSeleccionado} onClose={() => setGrupoSeleccionado(null)} />
            )}
        </div>
    );
}

export default GestionGrupos;
