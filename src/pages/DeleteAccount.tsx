import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const DeleteAffiliate = () => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [formData, setFormData] = useState({
    numeroIdAfiliado: '',
    tipoIdentificacionId: ''
  });
  const [tipoIdentificacionOptions, setTipoIdentificacionOptions] = useState<{ id: string, nombre: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTipoIdentificacion();
    }
  }, [isAuthenticated]);

  const fetchTipoIdentificacion = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get("https://localhost:8080/general/api/v1/tipoIdentificacion", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.datos && Array.isArray(response.data.datos)) {
        setTipoIdentificacionOptions(response.data.datos.map((tipo: { id: string, nombre: string }) => ({
          id: tipo.id,
          nombre: tipo.nombre
        })));
      } else {
        alert('Error al obtener los tipos de identificación: la respuesta no es válida.');
      }
    } catch (error) {
      alert('Error al obtener tipos de identificación');
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      
      const dataToSend = {
        tipoIdentificacionId: formData.tipoIdentificacionId,
        numeroIdAfiliado: formData.numeroIdAfiliado
      };

      await axios.delete('https://localhost:8080/general/api/v1/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: dataToSend
      });

      alert('Afiliado eliminado exitosamente');
      setFormData({ numeroIdAfiliado: '', tipoIdentificacionId: '' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessages = error.response?.data?.mensajes || ['Error al eliminar afiliado'];
        const errorMessage = errorMessages.join(', ');
        alert(errorMessage);
      } else {
        alert('Ocurrió un error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center">
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">We're sorry to see you go!</h2>
      <form onSubmit={handleDelete} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Identificación</label>
          <select
            name="tipoIdentificacionId"
            value={formData.tipoIdentificacionId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccione un tipo de identificación</option>
            {tipoIdentificacionOptions.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Número de ID Afiliado</label>
          <input
            type="text"
            name="numeroIdAfiliado"
            value={formData.numeroIdAfiliado}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {loading ? 'Eliminando...' : 'Eliminar Afiliado'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button className="text-blue-500 hover:underline" onClick={() => {/* lógica para volver al dashboard */}}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DeleteAffiliate;