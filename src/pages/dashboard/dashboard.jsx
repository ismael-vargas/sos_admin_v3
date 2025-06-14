/* dashboard.jsx */
/* -------------------*/
import React, { useState, useRef } from 'react';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { Edit2, Save, Smartphone, Monitor, Upload } from 'lucide-react';
import fondoCelular from '../../assets/img/87.jpg'; // Cambia el nombre por el real
import '../../assets/scss/dashboard.scss';


// Componente de texto editable
const EditableText = ({ text, onSave, editing, style = {}, className = '' }) => {
    const [value, setValue] = useState(text); // Inicialización del estado para el texto editable

    const handleBlur = () => { // Función que se llama cuando el campo de texto pierde el enfoque
        onSave(value); // Guarda el valor actual del texto
    };

    if (!editing) { // Si no estamos en modo edición
        return <span style={style} className={className}>{text}</span>; // Muestra el texto sin editar
    }

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)} // Actualiza el valor del texto al cambiar
            onBlur={handleBlur} // Llama a la función de guardar al perder el enfoque
            className={`form-control bg-transparent border-0 text-center ${className}`}
            style={{
                ...style,
                cursor: 'text',
                outline: '1px dashed rgba(255,255,255,0.5)'
            }}
        />
    );
};
// Componente para editar texto en un textarea
const EditableTextArea = ({ text, onSave, editing, style = {} }) => {
    const [value, setValue] = useState(text);

    const handleBlur = () => {
        onSave(value);
    };

    if (!editing) {
        return <p style={style} className="mb-4">{text}</p>;
    }

    return (
        <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            className="form-control bg-transparent border-0 text-center"
            style={{
                ...style,
                height: 'auto',
                minHeight: '150px',
                resize: 'none',
                cursor: 'text',
                outline: '1px dashed rgba(0,0,0,0.2)'
            }}
        />
    );
};
// Componente para subir imágenes
const ImageUploader = ({ currentImage, onImageChange, editing }) => {
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        if (editing) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageChange(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="position-relative d-inline-block">
            <img
                src={currentImage}
                alt="App Icon"
                className="mb-2"
                style={{
                    width: '60px',
                    height: '60px',
                    cursor: editing ? 'pointer' : 'default',
                    opacity: editing ? 0.8 : 1
                }}
                onClick={handleImageClick}
            />
            {editing && (
                <>
                    <div
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{ pointerEvents: 'none' }}
                    >
                        <Upload size={24} className="text-dark opacity-75" />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="d-none"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </>
            )}
        </div>
    );
};
// Componente que representa el contenido de la app
const AppContent = ({ editing, sosText, setSosText, callText, setCallText }) => {
    return (
        <div
            className="sos-bg d-flex flex-column align-items-center"
            style={{
                height: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                padding: 0,
                background: `url(${fondoCelular}) center center / cover no-repeat, #073a74`
            }}
        >
            {/* Header azul */}
            <div
                style={{
                    width: "100%",
                    background: "#073a74",
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 18px",
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18
                }}
            >
                <div style={{ display: "flex", alignItems: "center", color: "#fff", fontSize: 16, fontWeight: 500 }}>
                    <span style={{
                        display: "inline-block",
                        width: 7,
                        height: 7,
                        background: "#fff",
                        borderRadius: "50%",
                        marginRight: 6
                    }}></span>
                    9:41
                </div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
                    SOS 911
                </div>
            </div>

            {/* Título */}
            <div className="sos-title-main">
                Un toque para tu seguridad
            </div>

            {/* Círculos punteados y botón SOS */}
            <div style={{
                position: "relative",
                marginTop: 24,
                marginBottom: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 320,
                height: 320
            }}>
                {/* Círculos punteados */}
                <svg width="320" height="320" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
                    <circle cx="160" cy="160" r="140" stroke="#fff6" strokeDasharray="6,10" strokeWidth="2" fill="none" />
                    <circle cx="160" cy="160" r="115" stroke="#fff4" strokeDasharray="4,8" strokeWidth="2" fill="none" />
                    <circle cx="160" cy="160" r="90" stroke="#fff3" strokeDasharray="2,6" strokeWidth="2" fill="none" />
                </svg>
                {/* Botón SOS */}
                <div
                    style={{
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 60% 40%, #ffb76b 0%, #ff7c7c 100%)",
                        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 2,
                        border: "10px solid #fff8"
                    }}
                >
                    {editing ? (
                        <input
                            value={sosText}
                            onChange={e => setSosText(e.target.value)}
                            className="sos-btn-text bg-transparent border-0 text-center w-100"
                            style={{ outline: "none", background: "transparent" }}
                        />
                    ) : (
                        <div className="sos-btn-text">{sosText || "SOS"}</div>
                    )}
                    <div className="sos-btn-subtext">Presionar 5 veces</div>
                </div>
            </div>

            {/* Botón 911 */}
            <div style={{
                marginBottom: 32,
                width: "100%",
                display: "flex",
                justifyContent: "center"
            }}>
                    {editing ? (
                  <div className="sos-btn-911">
                    <span style={{ fontSize: 22, display: "flex", alignItems: "center" }}>
                      <svg width="22" height="22" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 12.81 19.86 19.86 0 0 1 1 4.18 2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l2.02-2.02a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    <input
                      value={callText}
                      onChange={e => setCallText(e.target.value)}
                      className="sos-btn-911-input"
                    />
                  </div>
                ) : (
                  <button
                    style={{
                      background: "#fff",
                      color: "#e53935",
                      border: "none",
                      borderRadius: 24,
                      fontWeight: 600,
                      fontSize: 22,
                      padding: "8px 36px",
                      boxShadow: "0 4px 16px 0 rgba(0,0,0,0.18)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 120,
                      justifyContent: "center"
                    }}
                    className="sos-btn-911"
                  >
                    <span style={{ fontSize: 22, display: "flex", alignItems: "center" }}>
                      <svg width="22" height="22" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 12.81 19.86 19.86 0 0 1 1 4.18 2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l2.02-2.02a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    {callText || "911"}
                  </button>
                )}
            </div>
        </div>
    );
};

const AppPreview = ({ appDesign, editing, handleDesignChange, mobileView, sosText, setSosText, callText, setCallText }) => {
    return (
        <div className="d-flex justify-content-center align-items-center w-100">
            {mobileView ? (
                <div
                    className="bg-dark rounded-5 p-3"
                    style={{
                        width: '100%',
                        maxWidth: '320px' // Reducido de 400 px para una vista móvil más delgada
                    }}
                >
                    <div
                        className="bg-white rounded-4 overflow-hidden"
                        style={{
                            height: '550px' // Reducido de 600px
                        }}
                    >
                        <AppContent
                            appDesign={appDesign}
                            editing={editing}
                            handleDesignChange={handleDesignChange}
                            mobileView={true}
                            sosText={sosText}
                            setSosText={setSosText}
                            callText={callText}
                            setCallText={setCallText}
                        />
                    </div>
                </div>
            ) : (
                <div
                    className="bg-white rounded-4 overflow-hidden shadow-lg"
                    style={{
                        width: '100%',
                        height: 'auto',        // <-- Cambia esto
                        minHeight: '550px'     // <-- Puedes ajustar este valor según lo que necesites
                    }}
                >
                    <div className="preview-pc">
                        <div className="sos-bg">
                            <div className="sos-header">
                                <div className="sos-header-bar">
                                    <div className="sos-header-time">
                                        <span className="sos-header-dot"></span>
                                        9:41
                                    </div>
                                    <div className="sos-header-title">SOS 911</div>
                                </div>
                            </div>
                            <div className="sos-content">
                                <div style={{ color: "#fff", fontWeight: 500, fontSize: 20.5, textAlign: "center", textShadow: "0 2px 8px #0007" }}>
                                    Un toque para tu seguridad
                                </div>
                                {/* Círculos punteados y botón SOS */}
                                <div style={{
                                    position: "relative",
                                    marginTop: 24,
                                    marginBottom: 24,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: 320,
                                    height: 320
                                }}>
                                    {/* Círculos punteados */}
                                    <svg width="320" height="320" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
                                        <circle cx="160" cy="160" r="140" stroke="#fff6" strokeDasharray="6,10" strokeWidth="2" fill="none" />
                                        <circle cx="160" cy="160" r="115" stroke="#fff4" strokeDasharray="4,8" strokeWidth="2" fill="none" />
                                        <circle cx="160" cy="160" r="90" stroke="#fff3" strokeDasharray="2,6" strokeWidth="2" fill="none" />
                                    </svg>
                                    {/* Botón SOS */}
                                    <div
                                        style={{
                                            width: 220,
                                            height: 220,
                                            borderRadius: "50%",
                                            background: "radial-gradient(circle at 60% 40%, #ffb76b 0%, #ff7c7c 100%)",
                                            boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "relative",
                                            zIndex: 2,
                                            border: "10px solid #fff8"
                                        }}
                                    >
                                        {editing ? (
                                            <input
                                                value={sosText}
                                                onChange={e => setSosText(e.target.value)}
                                                className="sos-btn-text bg-transparent border-0 text-center w-100"
                                                style={{ outline: "none", background: "transparent" }}
                                            />
                                        ) : (
                                            <div className="sos-btn-text">{sosText || "SOS"}</div>
                                        )}
                                        <div className="sos-btn-subtext">Presionar 5 veces</div>
                                    </div>
                                </div>
                                {/* Botón 911 aquí dentro */}
                                <div style={{
                                    marginBottom: 32,
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    {editing ? (
                                      <div className="sos-btn-911">
                                        <span style={{ fontSize: 22, display: "flex", alignItems: "center" }}>
                                          <svg width="22" height="22" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 12.81 19.86 19.86 0 0 1 1 4.18 2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l2.02-2.02a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"/>
                                          </svg>
                                        </span>
                                        <input
                                          value={callText}
                                          onChange={e => setCallText(e.target.value)}
                                          className="sos-btn-911-input"
                                        />
                                      </div>
                                    ) : (
                                      <button
                                        style={{
                                          background: "#fff",
                                          color: "#e53935",
                                          border: "none",
                                          borderRadius: 24,
                                          fontWeight: 600,
                                          fontSize: 22,
                                          padding: "8px 36px",
                                          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.18)",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 10,
                                          minWidth: 120,
                                          justifyContent: "center"
                                        }}
                                        className="sos-btn-911"
                                      >
                                        <span style={{ fontSize: 22, display: "flex", alignItems: "center" }}>
                                          <svg width="22" height="22" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 12.81 19.86 19.86 0 0 1 1 4.18 2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l2.02-2.02a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"/>
                                          </svg>
                                        </span>
                                        911
                                      </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente del panel de edición de diseño
const AppEditor = ({ appDesign, editing, handleDesignChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    if (!editing) return null;

    return (
        <div className="position-fixed end-0 top-50 translate-middle-y me-2" style={{ zIndex: 1030 }}>
            {/* Botón para mostrar/ocultar el panel */}
            <button
                className="btn btn-primary shadow-sm d-block mb-2 rounded-circle"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Mostrar editor de colores" : "Ocultar editor de colores"}
            >
                <i className={`bi bi-palette${!isCollapsed ? '-fill' : ''}`}></i>
            </button>

            {/* Panel de edición colapsable */}
            <div
                className={`bg-white shadow rounded ${isCollapsed ? 'd-none' : ''}`}
                style={{ width: '250px' }}
            >
                <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="m-0">Personalización</h6>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small">Color del Botón</label>
                        <input
                            type="color"
                            value={appDesign.buttonColor}
                            onChange={(e) => handleDesignChange('buttonColor', e.target.value)}
                            className="form-control form-control-color w-100"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small">Color de Fondo</label>
                        <input
                            type="color"
                            value={appDesign.backgroundColor}
                            onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
                            className="form-control form-control-color w-100"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small">Color del Header</label>
                        <input
                            type="color"
                            value={appDesign.headerColor}
                            onChange={(e) => handleDesignChange('headerColor', e.target.value)}
                            className="form-control form-control-color w-100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
// Componente principal del dashboard
const Dashboard = () => {
    const [editing, setEditing] = useState(false);
    const [mobileView, setMobileView] = useState(true);
    const [appDesign, setAppDesign] = useState({
        buttonColor: '#dc3545',
        backgroundColor: '#ffffff',
        headerColor: '#003A79',
        headerText: 'SOS 911',
        titleText: 'Botón de Pánico',
        buttonText: 'ALERTA',
        iconImage: '/assets/img/icon.png',
        descriptionText: `Mantén tu seguridad al alcance de tu mano con nuestra aplicación SOS 911. 
        Con un simple clic en el botón podrás activar una alerta inmediata que notificará a tus contactos de confianza.

Nuestra comunidad trabaja unida para crear un entorno más seguro para todos. Únete a la red de protección comunitaria y mantente conectado con quienes más te importan.`
    });
    const [sosText, setSosText] = useState('SOS');
    const [callText, setCallText] = useState('911');

    const handleDesignChange = (property, value) => {
        setAppDesign(prev => ({
            ...prev,
            [property]: value
        }));
    };

    return (
        <div>
            {/* Título de la página del dashboard */}
            <h1 className="page-header mb-4">
                Dashboard <small>Editor de Diseño de App</small> {/* Subtítulo que indica que es un editor de diseño */}
            </h1>

            {/* Contenedor para las columnas */}
            <div className="row">
                <div className="col-12">
                    {/* Componente de Panel para agrupar el contenido */}
                    <Panel>
                        {/* Encabezado del Panel */}
                        <PanelHeader>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Preview de la App</span> {/* Texto que indica que esta sección es la vista previa */}
                            </div>
                        </PanelHeader>
                        {/* Cuerpo del Panel con espacio de padding (py-4) */}
                        <PanelBody className="py-4">
                            {/* Contenedor de botones para cambiar la vista y editar el diseño */}
                            <div className="mb-3 d-flex justify-content-center gap-2">
                                {/* Contenedor de botones con fondo claro y bordes redondeados */}
                                <div className="bg-light rounded-3 p-2 d-flex gap-2 shadow-sm">

                                    {/* Botón para cambiar entre vista móvil y vista de escritorio */}
                                    <button
                                        onClick={() => setMobileView(!mobileView)} // Cambia el estado mobileView al hacer clic
                                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                        title={mobileView ? "Cambiar a vista de escritorio" : "Cambiar a vista móvil"} // Título del botón cambia según la vista actual
                                    >
                                        <span>Vista:</span> {/* Texto que indica el tipo de vista */}
                                        {/* Muestra el ícono correspondiente dependiendo de la vista seleccionada */}
                                        {mobileView ? (
                                            <Monitor size={16}/> // Ícono de monitor para vista de escritorio
                                        ) : (
                                            <Smartphone size={16}/> // Ícono de smartphone para vista móvil
                                        )}
                                    </button>

                                    {/* Botón para activar/desactivar la edición del diseño */}
                                    <button
                                        onClick={() => setEditing(!editing)} // Cambia el estado de edición
                                        className={`btn btn-primary btn-sm d-flex align-items-center gap-2`}
                                        title={editing ? "Guardar cambios" : "Editar diseño"} // Título del botón cambia según si está en modo de edición o no
                                    >
                                        {/* Muestra el ícono de editar o guardar dependiendo del estado de edición */}
                                        {editing ? (
                                            <>
                                                <Save size={16} /> {/* Ícono de guardar */}
                                                <span>Guardar</span>
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={16} /> {/* Ícono de editar */}
                                                <span>Editar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Contenedor con la vista previa y el editor de diseño */}
                            <div className="position-relative">
                                {/* Componente de vista previa de la aplicación */}
                                <AppPreview
                                    appDesign={appDesign} // Pasa la configuración del diseño de la app
                                    editing={editing} // Pasa si está en modo edición o no
                                    handleDesignChange={handleDesignChange} // Función para manejar los cambios de diseño
                                    mobileView={mobileView} // Pasa el estado de la vista (móvil o escritorio)
                                    sosText={sosText}
                                    setSosText={setSosText}
                                    callText={callText}
                                    setCallText={setCallText}
                                />
                                {/* Componente del editor de diseño */}
                                <AppEditor
                                    appDesign={appDesign} // Pasa la configuración del diseño de la app
                                    editing={editing} // Pasa si está en modo edición o no
                                    handleDesignChange={handleDesignChange} // Función para manejar los cambios de diseño
                                />
                            </div>
                        </PanelBody>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
 