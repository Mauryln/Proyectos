import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EscribirResena.css';

const EscribirResena = () => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clienteId = localStorage.getItem('clienteId');
    const fechaResena = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    const resena = {
      iD_Reseña: 0,
      calificacion,
      comentario,
      fecha_Reseña: fechaResena,
      iD_Cliente: parseInt(clienteId, 10),
    };

    try {
      const response = await fetch('https://localhost:7263/api/Reseñas/Insertar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resena),
      });

      if (response.ok) {
        setMensaje('Reseña enviada con éxito.');
        setCalificacion(0);
        setComentario('');
        setTimeout(() => {
          navigate('/'); // Redirigir a la página de inicio después de 2 segundos
        }, 2000);
      } else {
        setMensaje('Error al enviar la reseña.');
      }
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
      setMensaje('Error al enviar la reseña.');
    }
  };

  return (
    <div className="escribir-resena-page">
      <h1>Escribir Reseña</h1>
      <form onSubmit={handleSubmit}>
        <div className="rating">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={star <= calificacion ? 'star filled' : 'star'}
              onClick={() => setCalificacion(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tu reseña aquí..."
          required
        />
        <button type="submit">Enviar Reseña</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default EscribirResena;
