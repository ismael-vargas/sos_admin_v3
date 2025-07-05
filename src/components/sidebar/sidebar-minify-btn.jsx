import React, { useContext } from 'react';
import { AppSettings } from './../../config/app-settings.js';

function SidebarMinifyBtn() {
	const context = useContext(AppSettings);

	const handleMinify = (event) => {
		event.preventDefault();
		// Cambia el estado visual
		context.toggleAppSidebarMinify();
		// Guarda la preferencia en backend
		if (context.usuarioId && context.guardarPreferenciasUsuario) {
			context.guardarPreferenciasUsuario(
				context.usuarioId,
				context.appDarkMode ? 'oscuro' : 'claro',
				!context.appSidebarMinify // el nuevo valor
			);
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