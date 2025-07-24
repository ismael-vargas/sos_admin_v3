//usuarios.js
import axios from '../api/axios';

// Registro de usuario
export const registrarUsuario = async (formData, csrfToken) => {
  const response = await axios.post(
    '/usuarios/registro',
    formData,
    {
      headers: { "X-CSRF-Token": csrfToken },
      withCredentials: true
    }
  );
  return response.data;
};

// Login de usuario
export const loginUsuario = async (correo_electronico, contrasena, csrfToken) => {
  const response = await axios.post(
    '/usuarios/login',
    { correo_electronico, contrasena },
    {
      headers: { "X-CSRF-Token": csrfToken },
      withCredentials: true
    }
  );
  return response.data;
};

// Obtener CSRF token
export const obtenerCsrfToken = async () => {
  const response = await axios.get('/csrf-token', { withCredentials: true });
  const csrfToken = response.data.data?.csrfToken || response.data.csrfToken;
  localStorage.setItem("csrfToken", csrfToken);
  return csrfToken;
};

// Listar usuarios
export const listarUsuarios = async () => {
  const csrfToken = localStorage.getItem("csrfToken");
  const response = await axios.get('/usuarios/listar', {
    headers: { "CSRF-Token": csrfToken }
  });
  return response.data;
};

// Eliminar usuario (marcar como inactivo)
export const eliminarUsuario = async (id) => {
  const csrfToken = localStorage.getItem("csrfToken");
  await axios.put(`/usuarios/actualizar/${id}`, { estado: "eliminado" }, {
    headers: { "CSRF-Token": csrfToken }
  });
};

// Actualizar estado de usuario
export const actualizarEstadoUsuario = async (id, estado) => {
  const csrfToken = localStorage.getItem("csrfToken");
  await axios.put(`/usuarios/actualizar/${id}`, { estado }, {
    headers: { "CSRF-Token": csrfToken }
  });
};

// Obtener detalle de usuario
export const obtenerDetalleUsuario = async (usuarioId) => {
  const csrfToken = localStorage.getItem("csrfToken");
  const response = await axios.get(`/usuarios/detalle/${usuarioId}`, {
    headers: { "CSRF-Token": csrfToken },
    withCredentials: true
  });
  return response.data;
};

// Actualizar perfil de usuario
export const actualizarPerfilUsuario = async (usuarioId, data) => {
  const csrfToken = localStorage.getItem("csrfToken");
  const response = await axios.put(`/usuarios/actualizar/${usuarioId}`, data, {
    headers: { "X-CSRF-Token": csrfToken },
    withCredentials: true
  });
  return response.data;
};

// Cambiar contraseña de usuario
export const cambiarContrasenaUsuario = async (usuarioId, nuevaContrasena) => {
  const csrfToken = localStorage.getItem("csrfToken");
  const response = await axios.put(
    `/usuarios/actualizar/${usuarioId}`,
    { contrasena: nuevaContrasena },
    {
      headers: { "X-CSRF-Token": csrfToken },
      withCredentials: true
    }
  );
  return response.data;
};