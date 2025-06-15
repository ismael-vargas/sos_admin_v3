import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../assets/scss/registro.scss";
import personImg from "../../assets/img/person.png";
import instance from "../../api/axios";

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    cedula_identidad: "",
    direccion: "",
    correo_electronico: "",
    contrasena: "",
    estado: "activo"
  });

  const [csrfToken, setCsrfToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post(
        "/registro",
        {
          nombre: formData.nombre,
          cedula_identidad: formData.cedula_identidad,
          direccion: formData.direccion,
          correo_electronico: formData.correo_electronico,
          contrasena: formData.contrasena,
          estado: formData.estado
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken
          }
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "¡Usuario creado!",
          text: "Tu cuenta se creó exitosamente.",
          confirmButtonText: "Ir al login",
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          navigate("/login");
        });
      } else {
        setErrorMessage(response.data.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.response?.data?.message || "Error al conectar con el servidor.");
    }
  };

  return (
    <div className="registro-outer-container">
      <div className="registro-bg"></div>
      <div className="registro-card">
        <div className="left-container">
          <div className="welcome-content">
            <img src="/assets/img/icon.png" alt="Logo SOS911" className="welcome-image" />
            <h1 className="login-title">
              <span className="sos-text">Sos</span>
              <span className="nine-eleven-text">911</span>
            </h1>
            <p className="welcome-text">Un toque para tu seguridad</p>
            <img src={personImg} alt="Persona representativa" className="welcome-person-image" />
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
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tus nombres"
                  required
                  className="entrada"
                />
              </div>

              <div className="form-group">
                <label className="etiqueta">Cédula *</label>
                <input
                  type="text"
                  name="cedula_identidad"
                  value={formData.cedula_identidad}
                  onChange={handleChange}
                  placeholder="Ingresa tu cédula"
                  required
                  className="entrada"
                />
              </div>

              <div className="form-group">
                <label className="etiqueta">Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ingresa tu dirección"
                  required
                  className="entrada"
                />
              </div>

              <div className="form-group">
                <label className="etiqueta">Correo Electrónico *</label>
                <input
                  type="email"
                  name="correo_electronico"
                  value={formData.correo_electronico}
                  onChange={handleChange}
                  placeholder="Ingresa tu correo"
                  required
                  className="entrada"
                />
              </div>

              <div className="form-group">
                <label className="etiqueta">Contraseña *</label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="Crea una contraseña"
                  required
                  className="entrada"
                />
              </div>
            </div>

            {errorMessage && <p style={{ color: "red", marginTop: "5px" }}>{errorMessage}</p>}

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
            ¿Ya eres miembro? <a href="/login" className="enlace">Haz clic aquí para iniciar sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
