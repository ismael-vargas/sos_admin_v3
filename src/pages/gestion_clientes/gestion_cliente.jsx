/* gestion_clientes.jsx */
/* -------------------*/
import React, { useState } from "react";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search, Trash } from "lucide-react";
import ClienteModal from "./cliente_modal.jsx";

const BASE_IMG_URL = "/assets/img/"; // Base URL para las imágenes de clientes

// Componente para representar una tarjeta de cliente
function ClienteCard({ cliente, onVerInformacionClick, onSelectCliente, isSelected, isDeleted }) {
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
                    src={`${BASE_IMG_URL}${cliente.imagen}`}
                    className="card-img-top"
                    alt={`Imagen de ${cliente.nombre}`}
                    style={{
                        objectFit: "cover",
                        height: "200px",
                        width: "100%",
                    }}
                />
                <div className="card-body bg-dark text-white text-center">
                    <h6 className="card-title mb-2" style={{ fontSize: "calc(1rem + 2px)" }}>
                        {cliente.nombre}
                    </h6>
                    <button className="btn btn-primary btn-sm" onClick={() => onVerInformacionClick(cliente)}>
                        Ver Información
                    </button>
                    <div className="form-check mt-2">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => onSelectCliente(cliente.id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente principal para la gestión de clientes
function GestionClientes() {
    const [clientes, setClientes] = useState([
        { id: 1, nombre: "Juan Pacho", imagen: "h1.jpg", eliminado: false },
        { id: 2, nombre: "Pablo Vargas", imagen: "h2.jpg", eliminado: false },
        { id: 3, nombre: "Amy Lopez", imagen: "h3.jpg", eliminado: false },
        { id: 4, nombre: "Jose Ruiz", imagen: "h4.jpg", eliminado: false },
        { id: 5, nombre: "Lina Egas", imagen: "h5.jpg", eliminado: false },
        { id: 6, nombre: "Abel Mendoza", imagen: "h6.jpg", eliminado: false },
        { id: 7, nombre: "Ana Pogo", imagen: "h11.jpg", eliminado: false },
        { id: 8, nombre: "Luisa Ramos", imagen: "h12.jpg", eliminado: false },
        { id: 9, nombre: "Juanita Pérez", imagen: "chica3.jpg", eliminado: false },
        { id: 10, nombre: "Tomas Ruiz", imagen: "chica4.jpg", eliminado: false },
    ]);

    const [busqueda, setBusqueda] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const clientesPorPagina = 8;

    const clientesFiltrados = clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const clientesOrdenados = [
        ...clientesFiltrados.filter((cliente) => !cliente.eliminado),
        ...clientesFiltrados.filter((cliente) => cliente.eliminado),
    ];

    const indexOfLastClient = paginaActual * clientesPorPagina;
    const indexOfFirstClient = indexOfLastClient - clientesPorPagina;
    const clientesMostrados = clientesOrdenados.slice(indexOfFirstClient, indexOfLastClient);

    const totalPaginas = Math.ceil(clientesOrdenados.length / clientesPorPagina);

    const handleEliminarClientes = () => {
        const clientesActualizados = clientes.map((cliente) =>
            clientesSeleccionados.includes(cliente.id) ? { ...cliente, eliminado: true } : cliente
        );
        setClientes(clientesActualizados);
        setClientesSeleccionados([]);
    };

    const handleSeleccionarCliente = (id) => {
        setClientesSeleccionados((prevSeleccionados) =>
            prevSeleccionados.includes(id)
                ? prevSeleccionados.filter((clienteId) => clienteId !== id)
                : [...prevSeleccionados, id]
        );
    };

    const handleCambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    return (
        <div>
            <h1 className="page-header">
                Gestión de Clientes <small>administración de clientes</small>
            </h1>
            <Panel>
                <PanelHeader>
                    <h4 className="panel-title">Clientes</h4>
                </PanelHeader>
                <PanelBody>
                    <div className="row mb-3">
                        <div className="col-12 d-flex flex-wrap justify-content-between align-items-center gap-3">
                            <div className="input-group" style={{ maxWidth: "400px" }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar cliente..."
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
                                    onClick={handleEliminarClientes}
                                    disabled={clientesSeleccionados.length === 0}
                                >
                                    <Trash size={18} /> Eliminar
                                </button>

                            </div>
                        </div>
                    </div>

          {/* Renderiza las tarjetas de clientes */}
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {clientesMostrados.map((cliente) => (
                            <ClienteCard
                                key={cliente.id}
                                cliente={cliente}
                                onVerInformacionClick={setClienteSeleccionado}
                                onSelectCliente={handleSeleccionarCliente}
                                isSelected={clientesSeleccionados.includes(cliente.id)}
                                isDeleted={cliente.eliminado}
                            />
                        ))}
                    </div>

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

            {clienteSeleccionado && (
                <ClienteModal
                    cliente={clienteSeleccionado}
                    onClose={() => setClienteSeleccionado(null)}
                />
            )}
        </div>
    );
}

export default GestionClientes;
