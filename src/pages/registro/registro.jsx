/* registro.jsx */
/* -------------------*/
import React, { useState } from "react"; // Importa React y el hook useState para manejar estados locales.
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirigir entre rutas.
import "../../assets/scss/registro.scss"; // Importa el archivo SCSS para los estilos específicos de este componente.
import personImg from '../../assets/img/person.png';

const BASE_IMG_URL = "./assets/img"; // Define la URL base para las imágenes utilizadas en el componente.

const Registro = () => { // Declara el componente funcional Registro.
  const navigate = useNavigate(); // Inicializa useNavigate para manejar la navegación.
  const [showModal, setShowModal] = useState(false); // Define el estado para controlar la visibilidad del modal.

  // Maneja el envío del formulario.
  const handleSubmit = (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario (recargar la página).
    setShowModal(true); // Muestra el modal al completar el registro.
  };

  // Maneja el cierre del modal.
  const handleCloseModal = () => {
    setShowModal(false); // Oculta el modal.
    navigate("/login"); // Redirige al usuario a la página de inicio de sesión.
  };

  return (
    <div className="registro-outer-container">
      <div className="registro-bg"></div> {/* <-- Agrega esta línea */}
      <div className="registro-card">
        <div className="left-container">
          <div className="welcome-content">
            <img
              src={`${BASE_IMG_URL}/icon.png`}
              alt="Logo SOS911"
              className="welcome-image"
            />
            <h1 className="login-title">
              <span className="sos-text">Sos</span>
              <span className="nine-eleven-text">911</span>
            </h1>
            <p className="welcome-text">
              Un toque para tu seguridad
            </p>
            <img
              src={personImg}
              alt="Persona representativa"
              className="welcome-person-image"
            />
          </div>
        </div>
        <div className="right-container">
          <h2 className="titulo">Registro</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-columns">
              <div className="form-group">
                <label className="etiqueta">Nombres *</label>
                <input
                  type="text"
                  placeholder="Ingresa tus nombres"
                  required
                  className="entrada"
                />
              </div>
              <div className="form-group">
                <label className="etiqueta">Cédula *</label>
                <input
                  type="text"
                  placeholder="Ingresa tu cédula"
                  required
                  className="entrada"
                />
              </div>
              <div className="form-group">
                <label className="etiqueta">Teléfono *</label>
                <input
                  type="tel"
                  placeholder="Ingresa tu teléfono"
                  required
                  className="entrada"
                />
              </div>
              <div className="form-group">
                <label className="etiqueta">Correo Electrónico *</label>
                <input
                  type="email"
                  placeholder="Ingresa tu correo"
                  required
                  className="entrada"
                />
              </div>
              <div className="form-group">
                <label className="etiqueta">Dirección *</label>
                <input
                  type="text"
                  placeholder="Ingresa tu dirección"
                  required
                  className="entrada"
                />
              </div>
              <div className="form-group">
                <label className="etiqueta">Contraseña *</label>
                <input
                  type="password"
                  placeholder="Crea una contraseña"
                  required
                  className="entrada"
                />
              </div>
              <div className="form-group">
                <label className="etiqueta">Repite tu contraseña *</label>
                <input
                  type="password"
                  placeholder="Repite la contraseña"
                  required
                  className="entrada"
                />
              </div>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" required className="checkbox" />
              <p>
                Al hacer clic en Registrarse, acepta nuestros{" "}
                <a href="/terms" className="enlace-terminos">Términos</a> y que ha leído nuestra{" "}
                <a href="/privacy-policy" className="enlace-terminos">Política de datos</a>.
              </p>
            </div>
            <button type="submit" className="boton">Crear Cuenta</button>
          </form>
          <p className="texto-enlace">
            ¿Ya eres miembro?{" "}
            <a href="/login" className="enlace">Haz clic aquí para iniciar sesión</a>
          </p>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p className="modal-texto">¡Usuario creado exitosamente!</p>
            <button className="boton-cerrar" onClick={handleCloseModal}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registro; // Exporta el componente Registro.
