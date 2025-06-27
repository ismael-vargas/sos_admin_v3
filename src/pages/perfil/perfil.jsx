/* perfil.jsx */
/* -------------------*/
import React, { useState, useEffect } from 'react'; // Importa React y los hooks useState y useEffect para manejar estados y efectos secundarios.
import { Link } from "react-router-dom"; // Importa Link para la navegación entre rutas.
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx"; // Importa componentes personalizados para el panel.
import { User, Mail, MapPin, Camera, Edit2, Save, X } from 'lucide-react'; // Importa iconos de lucide-react para usarlos en la interfaz.
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

  // Obtener los datos del usuario que ha iniciado sesión
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const usuarioId = localStorage.getItem("usuario_id");
        if (!usuarioId) {
          throw new Error("No se encontró el ID del usuario en localStorage. Inicia sesión de nuevo.");
        }
        const response = await axios.get(`http://localhost:9000/usuarios/${usuarioId}`, { withCredentials: true });
        setProfile(response.data);
        setTempProfile(response.data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error.message);
      }
    };

    fetchProfile();
  }, []);

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
    const csrfToken = localStorage.getItem("csrfToken"); // Asegúrate de que el token esté almacenado

    try {
      const response = await axios.put(
        `http://localhost:9000/usuarios/${profile.id}`,
        tempProfile,
        {
          headers: {
            "CSRF-Token": csrfToken, // Enviar el token CSRF en el encabezado
          },
          withCredentials: true, // Asegúrate de enviar las cookies
        }
      );

      setProfile(response.data); // Actualizar el estado con los datos actualizados
      setIsEditing(false);

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Cambios actualizados!",
        text: "El perfil se ha actualizado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error.message);

      // Mostrar alerta de error
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

  // Renderiza la imagen o un placeholder si no hay una imagen de perfil
  const renderProfileImage = () => {
    if (profile?.avatar) {
      return (
        <img
          src={profile.avatar} // Muestra la imagen de perfil.
          alt="Profile" // Texto alternativo.
          className="rounded-circle shadow profile-image" // Clases para estilos.
        />
      );
    } else {
      return (
        <div className="rounded-circle shadow profile-placeholder d-flex align-items-center justify-content-center">
          <i className="fa fa-user fa-4x text-white"></i> {/* Ícono de usuario. */}
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
                  <div className="profile-header position-relative text-center"> {/* Sección superior del perfil. */}
                    <div className="position-relative d-inline-block"> {/* Contenedor de la imagen del perfil. */}
                      {!isEditing && ( // Si no se está editando, muestra el botón de editar.
                        <button
                          className="btn btn-light rounded-circle p-2 position-absolute top-0 end-0 shadow-sm"
                          onClick={() => setIsEditing(true)} // Activa el modo de edición.
                        >
                          <Edit2 size={20} className="text-primary" /> {/* Ícono de editar. */}
                        </button>
                      )}
                      {renderProfileImage()} {/* Muestra la imagen o el placeholder. */}
                      {isEditing && ( // Si se está editando, muestra el botón para cambiar foto.
                        <button className="btn btn-primary rounded-circle p-2 position-absolute bottom-0 end-0">
                          <Camera size={20} /> {/* Ícono de cámara. */}
                        </button>
                      )}
                    </div>
                    <h3 className="text-white mt-3">
                      {profile?.nombre} {/* Nombre completo del usuario. */}
                    </h3>
                    <p className="text-white-50">ID: {profile?.cedula_identidad}</p> {/* Cédula del usuario. */}
                  </div>

                  <div className="card-body"> {/* Cuerpo de la tarjeta. */}
                    {isEditing ? ( // Si se está editando, muestra el formulario.
                      <form onSubmit={handleSubmit}>
                        <div className="row g-3"> {/* Define el diseño del formulario. */}
                          {/* Campos del formulario */}
                          <div className="col-md-6"> {/* Campo para el nombre. */}
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
                          <div className="col-md-6"> {/* Campo para la cédula. */}
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
                          <div className="col-md-6"> {/* Campo para el correo electrónico. */}
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
                          <div className="col-12"> {/* Campo para la dirección. */}
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
                          <div className="col-md-6"> {/* Campo para cambiar la contraseña. */}
                            <div className="form-group">
                              <label>Nueva Contraseña</label>
                              <input
                                type="password"
                                className="form-control"
                                name="contrasena" // Nombre del campo que se enviará al backend
                                value={tempProfile?.contrasena || ''} // Valor temporal para la contraseña
                                onChange={handleInputChange} // Maneja los cambios en el campo
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
                    ) : ( // Si no se está editando, muestra la información en tarjetas.
                      <div>
                        {[ // Información del perfil renderizada en tarjetas.
                          {
                            icon: User,
                            label: "Nombres",
                            value: profile?.nombre
                          },
                          {
                            icon: User,
                            label: "Cédula",
                            value: profile?.cedula_identidad
                          },
                          {
                            icon: Mail,
                            label: "Correo Electrónico",
                            value: profile?.correo_electronico
                          },
                          {
                            icon: MapPin,
                            label: "Dirección",
                            value: profile?.direccion
                          },
                        ].map((item, index) => ( // Recorre y renderiza cada tarjeta de información.
                          <div
                            key={index}
                            style={customStyles.infoCard} // Aplica estilos personalizados.
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform = "translateX(5px)") // Animación al pasar el mouse.
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform = "translateX(0)") // Regresa a su posición original.
                            }
                            className="info-card d-flex align-items-center border rounded mb-2 p-3"
                          >
                            <div className="info-card-icon flex-shrink-0 me-3">
                              <item.icon size={20} className="text-primary" /> {/* Ícono. */}
                            </div>
                            <div className="info-card-content text-truncate">
                              <div className="info-card-label text-muted text-truncate">
                                {item.label} {/* Etiqueta. */}
                              </div>
                              <div className="info-card-text text-truncate">{item.value}</div> {/* Valor. */}
                            </div>
                          </div>
                        ))}
                      </div>
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
