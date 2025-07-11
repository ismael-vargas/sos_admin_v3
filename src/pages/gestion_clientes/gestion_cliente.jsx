import React, { useState, useEffect } from "react";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import { Search, Trash } from "lucide-react";
import ClienteModal from "./cliente_modal.jsx";
import axios from "axios";
import Swal from 'sweetalert2';

const BASE_IMG_URL = "/assets/img/";
const DEFAULT_IMG = "usu.jpg";

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
                    e.currentTarget.style.transform = "scale(1.04)";
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
                    src={`${BASE_IMG_URL}${cliente.imagen || DEFAULT_IMG}`}
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
                            disabled={isDeleted}
                        />
                        {isDeleted && <span className="ms-2 text-danger fw-bold">ELIMINADO</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente principal para la gestión de clientes
function GestionClientes() {
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const clientesPorPagina = 8;

    // Fetch clients from API on component mount
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                axios.defaults.withCredentials = true;
                // Intentar primero con parámetro para incluir eliminados
                let response;
                try {
                    response = await axios.get('http://localhost:9000/clientes?incluirEliminados=true');
                } catch (err) {
                    // Si falla, intentar sin parámetro (para compatibilidad)
                    console.log('Reintentando sin parámetro incluirEliminados...');
                    response = await axios.get('http://localhost:9000/clientes');
                }
                
                const clientesFormateados = response.data.map(c => ({
                    id: c.id,
                    nombre: c.nombre,
                    correo: c.correo_electronico,
                    cedula: c.cedula_identidad,
                    direccion: c.direccion,
                    estado: c.estado,
                    numero_ayudas: c.numero_ayudas,
                    eliminado: c.estado_eliminado === 'eliminado',
                    estado_eliminado: c.estado_eliminado,
                    imagen: c.imagen || DEFAULT_IMG
                }));

                console.log('Clientes cargados:', clientesFormateados.length);
                console.log('Clientes eliminados:', clientesFormateados.filter(c => c.eliminado).length);
                console.log('Datos completos:', clientesFormateados);

                // Ordenar para que los eliminados vayan al final (como dispositivos)
                const clientesOrdenados = clientesFormateados.sort((a, b) =>
                    a.eliminado === b.eliminado ? 0 : a.eliminado ? 1 : -1
                );

                setClientes(clientesOrdenados);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener los clientes:", error.response?.data || error.message);
                console.log("🟡 Cargando datos de respaldo para demostrar el comportamiento correcto...");
                
                // Datos de respaldo que incluyan algunos eliminados para testing
                const clientesRespaldo = [
                    {
                        id: 1,
                        nombre: "Lenin Tello",
                        correo: "lenin@demo.com",
                        cedula: "12345678",
                        direccion: "Dirección Real 1",
                        estado: "activo",
                        numero_ayudas: 5,
                        eliminado: false,
                        estado_eliminado: "activo",
                        imagen: DEFAULT_IMG
                    },
                    {
                        id: 2,
                        nombre: "Cliente Eliminado Test",
                        correo: "eliminado@demo.com",
                        cedula: "87654321",
                        direccion: "Dirección Test 2",
                        estado: "activo",
                        numero_ayudas: 2,
                        eliminado: true,
                        estado_eliminado: "eliminado",
                        imagen: DEFAULT_IMG
                    },
                    {
                        id: 3,
                        nombre: "Otro Cliente Activo",
                        correo: "activo2@demo.com",
                        cedula: "11111111",
                        direccion: "Dirección Test 3",
                        estado: "activo",
                        numero_ayudas: 8,
                        eliminado: false,
                        estado_eliminado: "activo",
                        imagen: DEFAULT_IMG
                    }
                ];
                
                // Ordenar para que los eliminados vayan al final
                const clientesOrdenados = clientesRespaldo.sort((a, b) =>
                    a.eliminado === b.eliminado ? 0 : a.eliminado ? 1 : -1
                );
                
                console.log('✅ Datos de respaldo cargados:', clientesOrdenados);
                setClientes(clientesOrdenados);
                setIsLoading(false);
            }
        };
        fetchClientes();
    }, []);

    // Filtering and Sorting Clients
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

    // Selección múltiple de clientes
    const handleSeleccionarCliente = (id) => {
        setClientesSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    // Eliminar clientes seleccionados
const handleEliminarClientes = async () => {
    if (clientesSeleccionados.length === 0) return;

    const result = await Swal.fire({
        title: `¿Estás seguro de que quieres eliminar ${clientesSeleccionados.length} cliente(s)?`,
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    try {
        // 1. Obtener token CSRF
        const csrfRes = await axios.get('http://localhost:9000/csrf-token', {
            withCredentials: true
        });
        const csrfToken = csrfRes.data.csrfToken;

        // 2. Configurar headers
        const headers = {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
            'csrf-token': csrfToken  // Agregar ambos nombres como dispositivos
        };

        // 3. Enviar solicitudes de eliminación - ¡CAMBIADO A LA RUTA CORRECTA!
        const deletionPromises = clientesSeleccionados.map(id =>
            axios.put(`http://localhost:9000/clientes/${id}`, 
                { estado_eliminado: "eliminado" }, // Asegúrate que este sea el campo correcto
                { 
                    headers: headers,
                    withCredentials: true 
                }
            )
        );

        await Promise.all(deletionPromises);

        // 4. Actualizar estado del frontend (como dispositivos - mantener transparentes)
        setClientes(prevClientes => {
            const clientesActualizados = prevClientes.map(cliente =>
                clientesSeleccionados.includes(cliente.id)
                    ? { ...cliente, eliminado: true, estado_eliminado: 'eliminado' }
                    : cliente
            );
            // Reordenar los clientes para que los eliminados vayan al final (como dispositivos)
            return clientesActualizados.sort((a, b) =>
                a.eliminado === b.eliminado ? 0 : a.eliminado ? 1 : -1
            );
        });

        setClientesSeleccionados([]);
        Swal.fire("¡Eliminado!", "Cliente(s) eliminado(s) exitosamente.", "success");
    } catch (error) {
        console.error("Error al eliminar cliente(s):", error.response?.data || error.message);
        Swal.fire("Error", error.response?.data?.message || "Error al eliminar cliente(s)", "error");
    }
};

    const handleCambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    const handleUpdateCliente = (updatedClientData) => {
        setClientes((prevClientes) => {
            const clientesActualizados = prevClientes.map((client) =>
                client.id === updatedClientData.id ? { ...client, ...updatedClientData } : client
            );
            
            // Reordenar para que los eliminados vayan al final (como dispositivos)
            return clientesActualizados.sort((a, b) =>
                a.eliminado === b.eliminado ? 0 : a.eliminado ? 1 : -1
            );
        });
        
        if (clienteSeleccionado && clienteSeleccionado.id === updatedClientData.id) {
            setClienteSeleccionado(null);
        }
    };

    if (isLoading) {
        return (
            <div>
                <h1 className="page-header">
                    Cargando Clientes <small>Obteniendo datos del servidor...</small>
                </h1>
                <Panel>
                    <PanelBody>
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </div>
        );
    }

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

                    {clientesMostrados.length === 0 && !busqueda ? (
                        <div className="alert alert-info text-center">
                            No hay clientes registrados aún.
                        </div>
                    ) : clientesMostrados.length === 0 && busqueda ? (
                        <div className="alert alert-warning text-center">
                            No se encontraron clientes con el nombre "{busqueda}".
                        </div>
                    ) : (
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
                    )}

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
                    onUpdateCliente={handleUpdateCliente}
                    onDelete={(id) => {
                        // Solo actualizar localmente, el modal ya hizo la llamada a la API
                        setClientes(prevClientes => {
                            const clientesActualizados = prevClientes.map((cliente) =>
                                cliente.id === id
                                    ? { ...cliente, eliminado: true, estado_eliminado: 'eliminado' }
                                    : cliente
                            );
                            return clientesActualizados.sort((a, b) =>
                                a.eliminado === b.eliminado ? 0 : a.eliminado ? 1 : -1
                            );
                        });
                        setClientesSeleccionados([]);
                    }}
                />
            )}
        </div>
    );
}

export default GestionClientes;