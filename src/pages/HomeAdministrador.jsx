import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar'; // Importa el nuevo AdminNavbar
import './HomeAdministrador.css';

const HomeAdministrador = ({ setIsLoggedIn }) => {
  const [restaurante, setRestaurante] = useState(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
      const fetchRestaurante = async () => {
        try {
          const response = await fetch('https://localhost:7263/api/Restaurantes/Listar');
          const data = await response.json();
          const restaurante = data.find(r => r.iD_Usuario === parseInt(usuarioId, 10));
          setRestaurante(restaurante);
        } catch (error) {
          console.error('Error al cargar los datos del restaurante:', error);
        }
      };

      fetchRestaurante();
    }
  }, []);

  return (
    <div className="home-administrador">
      <AdminNavbar setIsLoggedIn={setIsLoggedIn} /> {/* Usa AdminNavbar */}
      <section className="admin-banner">
        <h1>¡Bienvenido al panel de administración!</h1>
      </section>

      <section className="admin-body">
        <div className="admin-options">
          <div className="admin-option">
            <Link to="/menu-y-platos">
              <h3>Menú y Platos</h3>
            </Link>
          </div>
          <div className="admin-option">
            <Link to="/pedidos">
              <h3>Pedidos</h3>
            </Link>
          </div>
          <div className="admin-option">
            <Link to="/editar-perfil-admin">
              <h3>Editar Perfil</h3>
            </Link>
          </div>
          <div className="admin-option">
            <Link to="/promociones">
              <h3>Promociones</h3>
            </Link>
          </div>
        </div>
        {restaurante && (
          <div className="admin-profile">
            <div className="profile-image">
              <img src={restaurante.usuario.imagenPerfilUrl || 'default-profile.png'} alt="Perfil" />
            </div>
            <div className="profile-details">
              <h2>{restaurante.nombre_Restaurante}</h2>
              <p>Dirección: {restaurante.direccion}</p>
              <p>Teléfono: {restaurante.telefono}</p>
              <p>Email: {restaurante.email}</p>
              <p>Categoría: {restaurante.categoria_Cocina}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeAdministrador;