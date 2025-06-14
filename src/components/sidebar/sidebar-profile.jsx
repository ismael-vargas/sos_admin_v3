import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { AppSettings } from './../../config/app-settings.js';
import { slideToggle } from './../../composables/slideToggle.js';

function SidebarProfile() {
	const context = useContext(AppSettings);

	function handleProfileExpand(e) {
		e.preventDefault();

		var targetSidebar = document.querySelector('.app-sidebar:not(.app-sidebar-end)');
		var targetMenu = e.target.closest('.menu-profile');
		var targetProfile = document.querySelector('#appSidebarProfileMenu');
		var expandTime = (targetSidebar && targetSidebar.getAttribute('data-disable-slide-animation')) ? 0 : 250;

		if (targetProfile) {
			if (targetProfile.style.display === 'block') {
				targetMenu.classList.remove('active');
			} else {
				targetMenu.classList.add('active');
			}
			slideToggle(targetProfile, expandTime);
			targetProfile.classList.toggle('expand');
		}
	}

	function handleDarkMode(e) {
		context.handleSetAppDarkMode(e.target.checked);
	}

	return (
		<AppSettings.Consumer>
			{({ appSidebarMinify, appDarkMode }) => (
				<div className="menu">
					<div className="menu-profile">
						<Link to="/" onClick={handleProfileExpand} className="menu-profile-link">
							<div className="menu-profile-cover with-shadow"></div>
							<div className="menu-profile-image menu-profile-image-icon bg-gray-900 text-gray-600">
								<i className="fa fa-user"></i>
							</div>
							<div className="menu-profile-info">
								<div className="d-flex align-items-center">
									<div className="flex-grow-1">
										Juan Perez
									</div>
									<div className="menu-caret ms-auto"></div>
								</div>
								<small>Administrador</small>
							</div>
						</Link>
					</div>
					<div id="appSidebarProfileMenu" className="collapse">
						<div className="menu-item">
							<Link to="/perfil" className="menu-link">
								<div className="menu-icon"><i className="fa fa-user"></i></div>
								<div className="menu-text">Perfil</div>
							</Link>
						</div>

						<div className="menu-item pt-5px">
							<div className="menu-link">
								<div className="menu-icon"><i className="fa fa-moon"></i></div>
								<div className="menu-text">Modo Oscuro</div>
								<div className="form-check form-switch ms-auto">
									<input
										type="checkbox"
										className="form-check-input"
										name="app-theme-dark-mode"
										onChange={handleDarkMode}
										id="sidebarDarkMode"
										checked={appDarkMode}
										value="1"
									/>
								</div>
							</div>
						</div>

						<div className="menu-divider m-0"></div>

						<div className="menu-item pt-5px">
							<Link to="/login" className="menu-link">
								<div className="menu-icon">
									<LogOut size={18} aria-hidden="true" />
								</div>
								<div className="menu-text">Cerrar Sesión</div>
							</Link>
						</div>
					</div>
				</div>
			)}
		</AppSettings.Consumer>
	);
}

export default SidebarProfile;