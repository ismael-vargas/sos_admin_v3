import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../assets/scss/login.scss";
import Swal from "sweetalert2";
import instance from "../../api/axios";
import { setAuthenticated } from "../../config/auth";

const BASE_IMG_URL = "./assets/img";

export const logout = (navigate) => {
  localStorage.removeItem("usuario_id");
  navigate("/login");
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  const fetchCsrfToken = async () => {
    try {
      const response = await instance.get("/csrf-token");
      setCsrfToken(response.data.csrfToken);
      localStorage.setItem("csrfToken", response.data.csrfToken);
      return response.data.csrfToken;
    } catch (error) {
      console.error("Error al obtener el token CSRF:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e, reintento = false) => {
    e.preventDefault && e.preventDefault();
    setError("");
    setIsSubmitting(true);
    console.log("[LOGIN] Intentando iniciar sesión...", reintento ? "(reintento)" : "");

    try {
      // Verifica el token CSRF justo antes de enviar
      if (!csrfToken) {
        console.warn("[LOGIN] CSRF token no disponible. Reintentando obtenerlo...");
        const nuevoToken = await fetchCsrfToken();
        if (!nuevoToken) {
          setError("No se pudo obtener el token de seguridad. Por favor, recarga la página.");
          setIsSubmitting(false);
          return;
        }
        setIsSubmitting(false);
        return;
      }

      const tokenToSend = csrfToken || localStorage.getItem("csrfToken");

      const response = await instance.post(
        "/usuarios/login",
        {
          correo_electronico: email,
          contrasena: password,
        },
        {
          headers: {
            "X-CSRF-Token": tokenToSend,
          },
        }
      );

      console.log("[LOGIN] Respuesta del backend:", response);

      if (response.status === 200 && response.data && response.data.usuario_id) {
        // Usar la nueva función setAuthenticated en lugar de localStorage.setItem directamente
        setAuthenticated(response.data.usuario_id);
        // Guardar datos del usuario para mostrar en el dashboard
        localStorage.setItem("usuario_nombre", response.data.nombre || "usuario");
        localStorage.setItem("usuario_email", response.data.correo_electronico || "");
        // Bandera para mostrar la alerta de bienvenida en el dashboard
        localStorage.setItem("show_welcome", "true");
        console.log("[LOGIN] Login exitoso, usuario_id guardado:", response.data.usuario_id);

        // Mostrar alerta de bienvenida antes de navegar
        Swal.fire({
          icon: "success",
          title: "¡Inicio de sesión exitoso!",
          html: `<strong class="custom-welcome">Bienvenido, ${response.data?.nombre || "usuario"}.</strong><br>Redirigiendo al panel...`,
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            const content = Swal.getHtmlContainer();
            if (content) {
              content.querySelector("strong")?.classList.add("custom-welcome");
            }
          },
        }).then(() => {
          // Navegación cuando se cierra la alerta
          console.log("[LOGIN] Alerta cerrada, redirigiendo al dashboard...");
          setIsSubmitting(false);
          navigate("/dashboard", { replace: true });
        });
      } else {
        setError("Credenciales inválidas o sesión expirada. Intenta recargar la página.");
        console.warn("[LOGIN] Respuesta inesperada:", response);
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: "Credenciales inválidas o ha ocurrido un error. Intenta recargar la página.",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("[LOGIN] Error en login:", err);
      let msg = "Ha ocurrido un error inesperado.";
      // Manejo específico de error CSRF
      const isCsrfError = err.response?.status === 419 || (err.response?.status === 403 && err.response?.data?.message?.includes('CSRF token'));
      if (isCsrfError && !reintento) {
        msg = "Token de seguridad inválido. Reintentando automáticamente...";
        console.warn("[LOGIN] Token CSRF inválido, reintentando login tras refrescar CSRF...");
        const nuevoToken = await fetchCsrfToken();
        if (nuevoToken) {
          setCsrfToken(nuevoToken);
          setTimeout(() => handleSubmit(e, true), 100);
          return;
        }
      } else if (err.response?.status === 401) {
        msg = "Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.";
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: msg,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // 3. Función para manejar la navegación con animación
  const handleNavigate = (e) => {
    e.preventDefault(); // Prevenimos la navegación inmediata
    setIsExiting(true); // Activamos la clase para la animación de salida
    setTimeout(() => {
        navigate('/registro'); // Navegamos después de la animación
    }, 500); // El tiempo debe coincidir con la duración de la animación en SCSS
  };


  return (
    <div className={`login-container ${isExiting ? 'exiting' : ''}`}>
      <div className="login-content text-center">
        <div className="login-header d-flex flex-column align-items-center mb-4">
          <img
            src={`${BASE_IMG_URL}/icon.png`}
            alt="SOS 911"
            className="login-logo"
          />
          <h1 className="login-title">
            <span className="sos-text">Sos</span>
            <span className="nine-eleven-text">911</span>
          </h1>
        </div>
        <p className="login-subtitle">Un toque para tu seguridad</p>

        {error && <div className="alert alert-danger">{error}</div>}

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
              onChange={(e) => setEmail(e.target.value)}
              required
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-check text-start mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="remember"
            />
            <label htmlFor="remember" className="form-check-label">
              Recuérdame
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
            disabled={!csrfToken || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
                <i
                  className="bi bi-arrow-right-circle"
                  style={{ fontSize: "1.3rem", color: "#fff" }}
                ></i>
              </>
            )}
          </button>
          {!csrfToken && (
            <div className="alert alert-info mt-2">Cargando seguridad...</div>
          )}

          <p className="login-register-text mt-3">
            ¿Aún no eres miembro? Haz clic{" "}
            <Link to="/registro" className="login-link" onClick={handleNavigate}>
              aquí
            </Link>{" "}
            para registrarte.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;