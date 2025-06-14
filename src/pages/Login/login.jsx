/*login.jsx */
/* -------------------*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/login.scss";

// Ruta base de las imágenes
const BASE_IMG_URL = "./assets/img";

const Login = () => {
  const [email, setEmail] = useState("");  // Estado para el email
  const [password, setPassword] = useState("");  // Estado para la contraseña
  const [error, setError] = useState(""); // Estado para manejar errores de autenticación
  const navigate = useNavigate();  // Navegación entre rutas

  // Credenciales predeterminadas para la simulación
  const validEmail = "usuario@ejemplo.com";
  const validPassword = "123456";

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevenir el comportamiento predeterminado del formulario

    // Validación simple
    if (email === validEmail && password === validPassword) {
      setError("");  // Limpiar el error
      navigate("/");  // Redirige al usuario a la ruta principal
    } else {
      setError("Correo electrónico o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content text-center">
        <div className="login-header d-flex flex-column align-items-center mb-4">
          <img
            src={`${BASE_IMG_URL}/icon.png`}
            alt="SOS 911"
            className="login-logo"  // Estilo de la imagen del logo
          />
          <h1 className="login-title">
            <span className="sos-text">Sos</span>
            <span className="nine-eleven-text">911</span>
          </h1>
        </div>
        <p className="login-subtitle">Un toque para tu seguridad</p>
        {error && <div className="alert alert-danger">{error}</div>} {/* Mostrar error */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <span className="login-icon">
              <i className="bi bi-person"></i>
            </span>
            <input
              type="email"
              placeholder="Usuario"
              className="form-control login-input ps-5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Actualiza el estado del email
            />
          </div>
          <div className="mb-3 position-relative">
            <span className="login-icon">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type="password"
              placeholder="Contraseña"
              className="form-control login-input ps-5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Actualiza el estado de la contraseña
            />
          </div>
          {/* Checkbox para la opción "Recuérdame", que permitiría mantener la sesión iniciada */}
          <div className="form-check text-start mb-3">
            <input
              type="checkbox"  // Input tipo checkbox
              className="form-check-input"
              id="remember"  // Identificador único para asociarlo con el label
            />
            <label htmlFor="remember" className="form-check-label">
              Recuérdame
            </label>
          </div>

          {/* Botón para enviar el formulario e iniciar sesión */}
          <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
            Iniciar Sesión
            <i className="bi bi-arrow-right-circle" style={{ fontSize: "1.3rem", color: "#fff" }}></i>
          </button>

          {/* Texto con enlace para redirigir a la página de registro si el usuario no tiene cuenta */}
          <p className="login-register-text mt-3">
            ¿Aún no eres miembro? Haz clic{" "}
            <a href="/registro" className="login-link">
              aquí
            </a>{" "}
            para registrarte.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
