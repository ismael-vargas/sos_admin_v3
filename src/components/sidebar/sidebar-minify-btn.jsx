import React, { useContext, useEffect, useState } from 'react';
import { AppSettings } from './../../config/app-settings.js';
import axios from 'axios'; // Importar axios
import Swal from 'sweetalert2'; // Importar SweetAlert2

function SidebarMinifyBtn() {
	const context = useContext(AppSettings);
	const [usuarioId, setUsuarioId] = useState(null); // Estado para almacenar el usuarioId
    // Nuevo estado para almacenar las preferencias del usuario
    const [userPreferences, setUserPreferences] = useState(null); 

    // Obtener usuarioId del localStorage al montar el componente
    useEffect(() => {
        const id = localStorage.getItem("usuario_id");
        if (id) {
            setUsuarioId(id);
        }
    }, []);

    // Nuevo useEffect para cargar las preferencias del usuario al montar el componente
    useEffect(() => {
        const fetchUserPreferences = async () => {
            if (!usuarioId) return; // No intentar cargar si no hay ID de usuario

            const csrfToken = localStorage.getItem("csrfToken");
            if (!csrfToken) {
                console.warn("CSRF token no disponible al cargar preferencias.");
                return;
            }

            try {
                // Ruta GET para obtener las preferencias del usuario
                const response = await axios.get(
                    `http://localhost:1000/usuarios/preferencias/listar/${usuarioId}`, 
                    {
                        headers: {
                            "CSRF-Token": csrfToken,
                        },
                        withCredentials: true,
                    }
                );
                // Almacenar las preferencias obtenidas
                setUserPreferences(response.data.preferencias); 
                // Si hay preferencias y un tema guardado, actualizar el modo oscuro de la app
                if (response.data.preferencias && response.data.preferencias.tema) {
                    context.handleSetAppDarkMode(response.data.preferencias.tema === 'oscuro');
                }
            } catch (error) {
                // Si las preferencias no se encuentran (404), es la primera vez, no es un error crítico
                if (error.response && error.response.status === 404) {
                    console.info("No se encontraron preferencias para el usuario. Se crearán al primer cambio.");
                    setUserPreferences(null); // Asegurarse de que el estado sea nulo si no se encuentran
                } else {
                    console.error("Error al cargar preferencias del usuario:", error.response?.data?.message || error.message);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudieron cargar las preferencias del usuario.",
                    });
                }
            }
        };

        fetchUserPreferences();
    }, [usuarioId, context]); // Depende de usuarioId y context para recargar si cambian

	const handleMinify = async (event) => {
		event.preventDefault();
		const newMinifyState = !context.appSidebarMinify; // El nuevo valor de minimización
		
		// Cambia el estado visual inmediatamente
		context.toggleAppSidebarMinify();

		if (!usuarioId) {
            console.warn("Usuario no identificado para guardar preferencias.");
            return;
        }

        const csrfToken = localStorage.getItem("csrfToken");
        if (!csrfToken) {
            Swal.fire({
                icon: "error",
                title: "Error de seguridad",
                text: "Token CSRF no disponible. Recargue la página.",
            });
            // Revertir el estado del toggle si no hay token
            context.toggleAppSidebarMinify(); 
            return;
        }

        try {
            const preferenceData = {
                tema: context.appDarkMode ? 'oscuro' : 'claro', // Tema actual
                sidebarMinimizado: newMinifyState // Nuevo estado de minimización
            };

            if (userPreferences) {
                // Si las preferencias ya existen, actualizarlas (PUT)
                await axios.put(
                    `http://localhost:1000/usuarios/preferencias/actualizar/${usuarioId}`, // Ruta PUT corregida
                    preferenceData,
                    {
                        headers: {
                            "CSRF-Token": csrfToken,
                        },
                        withCredentials: true,
                    }
                );
                console.log("Preferencia de minimización de sidebar actualizada.");
            } else {
                // Si no existen preferencias, crearlas (POST)
                await axios.post(
                    `http://localhost:1000/usuarios/preferencias/registrar/${usuarioId}`, // Ruta POST para registrar
                    preferenceData,
                    {
                        headers: {
                            "CSRF-Token": csrfToken,
                        },
                        withCredentials: true,
                    }
                );
                console.log("Preferencia de minimización de sidebar registrada por primera vez.");
                // Actualizar el estado local de preferencias para futuras actualizaciones
                setUserPreferences(preferenceData); 
            }
        } catch (error) {
            console.error("Error al guardar preferencia de minimización de sidebar:", error.response?.data?.message || error.message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar la preferencia de minimización del sidebar.",
            });
            // Revertir el estado del toggle si la API falla
            context.toggleAppSidebarMinify(); 
        }
	};

	return (
		<div className="menu">
			<div className="menu-item d-flex">
				<button type="button" className="app-sidebar-minify-btn ms-auto" onClick={handleMinify}>
					<i className="fa fa-angle-double-left"></i>
				</button>
			</div>
		</div>
	)
}

export default SidebarMinifyBtn;
