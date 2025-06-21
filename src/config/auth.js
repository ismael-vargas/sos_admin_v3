export const logout = (navigate) => {
  localStorage.removeItem("usuario_id"); // Elimina el estado de autenticación
  navigate("/login"); // Redirige al login
};

export const isAuthenticated = () => {
  const usuarioId = localStorage.getItem("usuario_id");
  console.log("Estado de autenticación:", usuarioId); // Verifica el valor de usuario_id
  return !!usuarioId; // Devuelve true si existe usuario_id
};