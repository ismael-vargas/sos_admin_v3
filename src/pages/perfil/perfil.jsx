/* perfil.jsx */
/* -------------------*/
import React, { useState, useEffect } from 'react'; // Importa React y los hooks useState y useEffect para manejar estados y efectos secundarios.
import { Link } from "react-router-dom"; // Importa Link para la navegación entre rutas.
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx"; // Importa componentes personalizados para el panel.
import { User, Mail, MapPin, Camera, Edit2, Save, X, IdCard } from 'lucide-react'; // Agregar IdCard
import axios from 'axios'; // Importa axios para realizar solicitudes HTTP.
import Swal from 'sweetalert2'; // Importa SweetAlert2 para mostrar alertas estilizadas.
import "../../assets/scss/perfil.scss"; // Importa el archivo de estilos SCSS para este componente.

const Perfil = () => {
  // Estado para controlar si se está editando el perfil o no.
  const [isEditing, setIsEditing] = useState(false);
  // Estado para el perfil del usuario
  const [profile, setProfile] = useState(null);
  // Estado temporal para manejar los datos del formulario de edición.
  const [tempProfile, setTempProfile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ nuevaContrasena: '' });
  const [showPasswordInput, setShowPasswordInput] = useState(false); // --- AGREGAR ESTADO PARA MOSTRAR INPUT DE CONTRASEÑA ---

  // Obtener los datos del usuario que ha iniciado sesión
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const usuarioId = localStorage.getItem("usuario_id");
        if (!usuarioId) {
          throw new Error("No se encontró el ID del usuario en localStorage. Inicia sesión de nuevo.");
        }
        const response = await axios.get(`http://localhost:1000/usuarios/detalle/${usuarioId}`, { withCredentials: true });

        // --- Normaliza la fecha de nacimiento ---
        let data = response.data;
        if (data.fecha_nacimiento && !isNaN(new Date(data.fecha_nacimiento).getTime())) {
          const d = new Date(data.fecha_nacimiento);
          data.fecha_nacimiento = d.toISOString().substring(0, 10);
        } else {
          data.fecha_nacimiento = "";
        }

        setProfile(data);
        setTempProfile(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error.message);
      }
    };

    fetchProfile();
  }, []);

  // Función para obtener el token CSRF
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:1000/csrf-token', { withCredentials: true });
      // Corrige aquí:
      const csrfToken = response.data.data?.csrfToken || response.data.csrfToken;
      localStorage.setItem("csrfToken", csrfToken);
      return csrfToken;
    } catch (error) {
      console.error("Error al obtener CSRF token:", error.message);
      return null;
    }
  };

  // Maneja los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Obtiene el nombre y valor del campo modificado.
    setTempProfile((prev) => ({
      ...prev, // Copia el estado anterior.
      [name]: value // Actualiza el campo correspondiente.
    }));
  };

  // Guarda los cambios al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = await fetchCsrfToken();

    const dataToSend = { ...tempProfile };

    // Solo elimina la fecha si está realmente vacía
    if (!dataToSend.fecha_nacimiento || dataToSend.fecha_nacimiento === '') {
      delete dataToSend.fecha_nacimiento;
    }

    try {
      const response = await axios.put(
        `http://localhost:1000/usuarios/actualizar/${profile.id}`,
        dataToSend,
        {
          headers: { "X-CSRF-Token": csrfToken },
          withCredentials: true,
        }
      );
      setProfile(response.data);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "¡Cambios actualizados!",
        text: "El perfil se ha actualizado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "Hubo un error al actualizar el perfil. Por favor, inténtelo de nuevo.",
      });
    }
  };

  // Cancela la edición y restaura los datos originales
  const handleCancel = () => {
    setTempProfile(profile); // Restaura los datos del perfil original.
    setIsEditing(false); // Sal del modo de edición.
  };

  // Función para obtener las iniciales del nombre del usuario
  const getInitials = (nombre) => {
    if (!nombre) return '';
    const words = nombre.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Renderiza la imagen o las iniciales si no hay imagen de perfil
  const renderProfileImage = () => {
    if (profile?.avatar) {
      return (
        <img
          src={profile.avatar}
          alt="Profile"
          className="rounded-circle shadow profile-image"
        />
      );
    } else {
      return (
        <div className="rounded-circle shadow profile-placeholder d-flex align-items-center justify-content-center avatar-initials">
          <span>{getInitials(profile?.nombre)}</span>
        </div>
      );
    }
  };

  // Estilos personalizados para las tarjetas de información.
  const customStyles = {
    infoCard: {
      transition: "transform 0.3s ease-in-out", // Transición suave para animación.
      cursor: "pointer" // Cambia el cursor al pasar el mouse.
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const csrfToken = await fetchCsrfToken(); // <-- AQUÍ PIDES EL TOKEN ACTUALIZADO
    if (!passwordData.nuevaContrasena || passwordData.nuevaContrasena.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 6 caracteres.'
      });
      return;
    }
    try {
      const usuarioId = profile?.id || localStorage.getItem("usuario_id");
      const response = await axios.put(
        `http://localhost:1000/usuarios/actualizar/${usuarioId}`,
        { contrasena: passwordData.nuevaContrasena },
        {
          headers: { "X-CSRF-Token": csrfToken }, // <--- CORREGIDO
          withCredentials: true
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña ha sido cambiada correctamente.',
          timer: 1500,
          showConfirmButton: false,
        });
        setShowPasswordInput(false);
        setPasswordData({ nuevaContrasena: '' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data?.message || 'No se pudo actualizar la contraseña.'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al actualizar la contraseña.'
      });
    }
  };

  return (
    <div>
      {/* Breadcrumb para mostrar la ubicación actual en el sitio. */}
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link> {/* Enlace a la página principal. */}
        </li>
        <li className="breadcrumb-item active">Mi Perfil</li> {/* Página actual. */}
      </ol>
      <h1 className="page-header">
        Mi Perfil <small>información personal</small> {/* Título de la página. */}
      </h1>

      <Panel> {/* Contenedor principal del panel. */}
        <PanelHeader> {/* Encabezado del panel. */}
          <h4 className="panel-title">Información del Perfil</h4> {/* Título dentro del panel. */}
        </PanelHeader>
        <PanelBody> {/* Cuerpo del panel. */}
          <div className="container"> {/* Contenedor para centrar contenido. */}
            <div className="row justify-content-center"> {/* Alinea contenido al centro. */}
              <div className="col-12 col-lg-8"> {/* Define el tamaño del contenedor. */}
                <div className="card border-0"> {/* Tarjeta para diseño limpio. */}
                  <div className="profile-header position-relative text-center mb-0 pb-0"> {/* Header con degradado y avatar centrado */}
                    <div className="position-relative d-inline-block">
                      {!isEditing && (
                        <button
                          className="btn btn-light rounded-circle p-2 position-absolute top-0 end-0 shadow-sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 size={20} className="text-primary" />
                        </button>
                      )}
                      {renderProfileImage()}
                      {isEditing && (
                        <button className="btn btn-primary rounded-circle p-2 position-absolute bottom-0 end-0">
                          <Camera size={20} />
                        </button>
                      )}
                    </div>
                    <h3 className="text-white mt-3 mb-1">
                      {profile?.nombre}
                    </h3>
                    <p className="text-white-50 mb-2">ID: {profile?.cedula_identidad}</p>
                  </div>

                  <div className="card-body perfil-cards-container"> {/* Contenedor de tarjetas en dos columnas */}
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <div className="row g-3"> {/* Define el diseño del formulario. */}
                          {/* Campos del formulario */}
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Nombres *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={tempProfile?.nombre || ''}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Cédula *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cedula_identidad"
                                value={tempProfile?.cedula_identidad || ''}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Correo Electrónico *</label>
                              <input
                                type="email"
                                className="form-control"
                                name="correo_electronico"
                                value={tempProfile?.correo_electronico || ''}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Fecha de Nacimiento *</label>
                              <input
                                type="date"
                                name="fecha_nacimiento"
                                value={tempProfile?.fecha_nacimiento ? tempProfile.fecha_nacimiento.substring(0, 10) : ''}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Dirección *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="direccion"
                                value={tempProfile?.direccion || ''}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          {/* Botones */}
                          <div className="col-12 d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-dark"
                              onClick={handleCancel}
                            >
                              <X size={18} /> Cancelar
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                            >
                              <Save size={18} /> Guardar Cambios
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="perfil-cards-list row g-4 justify-content-center">
                          <div className="col-12 col-md-6 d-flex flex-column gap-3">
                            {/* Columna izquierda: Nombres y Cédula */}
                            <div className="info-card d-flex align-items-center p-3">
                              <div className="info-card-icon flex-shrink-0 me-3">
                                <User size={22} className="text-primary" />
                              </div>
                              <div className="info-card-content text-truncate">
                                <div className="info-card-label text-muted text-truncate">
                                  Nombres
                                </div>
                                <div className="info-card-text text-truncate fw-normal">{profile?.nombre}</div>
                              </div>
                            </div>
                            <div className="info-card d-flex align-items-center p-3">
                              <div className="info-card-icon flex-shrink-0 me-3">
                                <IdCard size={22} className="text-primary" />
                              </div>
                              <div className="info-card-content text-truncate">
                                <div className="info-card-label text-muted text-truncate">
                                  Cédula
                                </div>
                                <div className="info-card-text text-truncate fw-normal">{profile?.cedula_identidad}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-6 d-flex flex-column gap-3">
                            {/* Columna derecha: Correo y Dirección SIEMPRE ARRIBA */}
                            <div className="info-card d-flex align-items-center p-3">
                              <div className="info-card-icon flex-shrink-0 me-3">
                                <Mail size={22} className="text-primary" />
                              </div>
                              <div className="info-card-content text-truncate">
                                <div className="info-card-label text-muted text-truncate">
                                  Correo Electrónico
                                </div>
                                <div className="info-card-text text-truncate fw-normal">{profile?.correo_electronico}</div>
                              </div>
                            </div>
                            <div className="info-card d-flex align-items-center p-3">
                              <div className="info-card-icon flex-shrink-0 me-3">
                                <MapPin size={22} className="text-primary" />
                              </div>
                              <div className="info-card-content text-truncate">
                                <div className="info-card-label text-muted text-truncate">
                                  Dirección
                                </div>
                                <div className="info-card-text text-truncate fw-normal">{profile?.direccion}</div>
                              </div>
                            </div>
                          </div>
                          {/* Tarjeta de configuración de contraseña DEBAJO DE LAS DOS COLUMNAS */}
                          <div className="col-12 col-md-6 mt-4 password-card-col">
                            <div className="info-card password-card mb-0 d-flex flex-column align-items-center text-center p-4">
                              <span className="info-card-icon mb-2"><i className="bi bi-lock-fill text-primary" style={{fontSize: '1.7rem'}}></i></span>
                              <span className="fw-semibold mb-1" style={{fontSize: '1.15rem'}}>Contraseña</span>
                              <span className="info-card-text text-muted mb-3" style={{fontSize: '0.98rem'}}>
                                Actualiza tu contraseña periódicamente para mayor seguridad.
                              </span>
                              {!showPasswordInput && (
                                <button className="btn btn-dark password-btn w-100" type="button" onClick={() => setShowPasswordInput(true)}>
                                  Cambiar Contraseña
                                </button>
                              )}
                              {showPasswordInput && (
                                <form className="row g-2 align-items-center password-form-responsive w-100 m-0 mt-3" onSubmit={handlePasswordChange}>
                                  <div className="col-12">
                                    <input
                                      type="password"
                                      className="form-control"
                                      name="nuevaContrasena"
                                      placeholder="Nueva Contraseña"
                                      value={passwordData.nuevaContrasena}
                                      onChange={e => setPasswordData({ ...passwordData, nuevaContrasena: e.target.value })}
                                      required
                                      minLength={6}
                                    />
                                  </div>
                                  <div className="col-12 d-flex justify-content-end gap-2 mt-2">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowPasswordInput(false); setPasswordData({ nuevaContrasena: '' }); }}>
                                      Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                      Guardar
                                    </button>
                                  </div>
                                </form>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
};

export default Perfil; // Exporta el componente para su uso en otras partes de la aplicación.
