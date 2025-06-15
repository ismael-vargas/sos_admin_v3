import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/login.scss";
import instance from "../../api/axios";
import Swal from "sweetalert2";

const BASE_IMG_URL = "./assets/img";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await instance.get("/csrf-token");
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Error al obtener el token CSRF:", error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post(
        "/login",
        {
          correo_electronico: email,
          contrasena: password,
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );

      if (response.status === 200) {
Swal.fire({
  icon: "success",
  title: "¡Inicio de sesión exitoso!",
  html: `<strong class="custom-welcome">Bienvenido, ${response.data?.nombre || "usuario"}.</strong><br>Redirigiendo al panel...`,
  timer: 1300, // ⏱️ cortito
  timerProgressBar: true, // 🟩 flechita de carga
  showConfirmButton: false,
  allowOutsideClick: false,
  allowEscapeKey: false,
  didOpen: () => {
    const content = Swal.getHtmlContainer();
    if (content) {
      content.querySelector("strong")?.classList.add("custom-welcome");
    }
  },
});

        setTimeout(() => {
          navigate("/");
        }, 1300);
      } else {
        setError("Credenciales inválidas.");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: err.response?.data?.message || "Ha ocurrido un error inesperado.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="login-container">
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
          >
            Iniciar Sesión
            <i
              className="bi bi-arrow-right-circle"
              style={{ fontSize: "1.3rem", color: "#fff" }}
            ></i>
          </button>

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
