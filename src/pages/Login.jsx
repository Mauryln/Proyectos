import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsLoggedIn, setUsuarioCompleto }) => {
    const [usuarioORemail, setUsuarioOrEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('https://localhost:7263/api/Usuarios/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Nombre_Usuario: usuarioORemail,
                Email: usuarioORemail,
                Contrasena: contrasena
            }),
        });

        if (response.ok) {
            const usuariosResponse = await fetch('https://localhost:7263/api/Usuarios/Listar');
            if (usuariosResponse.ok) {
                const usuarios = await usuariosResponse.json();
                const usuario = usuarios.find(u => 
                    (u.nombre_Usuario === usuarioORemail || u.email === usuarioORemail) && 
                    u.contrasena === contrasena
                );

                if (usuario) {
                    localStorage.setItem('usuarioId', usuario.iD_Usuario);
                    setIsLoggedIn(true);
                    checkCompletarPerfil(usuario.iD_Usuario, usuario.tipo_Usuario); // Pasa el tipo de usuario
                } else {
                    alert('Error al encontrar el ID del usuario');
                }
            } else {
                alert('Error al listar los usuarios');
            }
        } else {
            alert('Error de inicio de sesión');
        }
    };

    const checkCompletarPerfil = async (userId, tipoUsuario) => {
        if (!userId) {
            console.error('No se ha proporcionado un ID de usuario');
            return;
        }

        // Verifica si el usuario es un restaurante
        const restaurantesResponse = await fetch('https://localhost:7263/api/Restaurantes/Listar');
        if (restaurantesResponse.ok) {
            const restaurantes = await restaurantesResponse.json();
            const restaurante = restaurantes.find(r => r.iD_Usuario === userId);

            if (restaurante) {
                localStorage.setItem('restauranteId', restaurante.iD_Restaurante);
                setUsuarioCompleto(true);
                navigate('/home-administrador'); // Redirige a HomeAdministrador.jsx
                window.location.reload();
                return;
            }
        } else {
            alert('Error al listar los restaurantes');
            return;
        }

        // Verifica si el usuario es un cliente
        const clientesResponse = await fetch('https://localhost:7263/api/Clientes/Listar');
        if (clientesResponse.ok) {
            const clientes = await clientesResponse.json();
            const cliente = clientes.find(c => c.iD_Usuario === userId);

            if (cliente) {
                localStorage.setItem('clienteId', cliente.iD_Cliente);
                setUsuarioCompleto(true);
                navigate('/'); // Redirige a Home.jsx
                window.location.reload();
                return;
            }
        } else {
            alert('Error al listar los clientes');
            return;
        }

        // Si no es ni cliente ni restaurante, redirige a completar perfil
        localStorage.removeItem('clienteId');
        localStorage.removeItem('restauranteId');
        navigate('/completar-perfil');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre de Usuario o Email:</label>
                <input
                    type="text"
                    value={usuarioORemail}
                    onChange={(e) => setUsuarioOrEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Contraseña:</label>
                <input
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
