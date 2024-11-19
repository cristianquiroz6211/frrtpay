import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterLocation = () => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [formData, setFormData] = useState({
    ubicacionNombre: '',
    sedeId: '',
    tipoUbicacionId: ''
  });
  const [sedeOptions, setSedeOptions] = useState<{ id: string, nombre: string }[]>([]);
  const [tipoUbicacionOptions, setTipoUbicacionOptions] = useState<{ id: string, nombre: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log("Token de Auth0:", token);
      
      // Obtener el UUID de la sede
      const sedeResponse = await axios.get("https://localhost:8080/general/api/v1/sede", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Verifica si la respuesta es un array
      if (Array.isArray(sedeResponse.data)) {
        setSedeOptions(sedeResponse.data.map((sede: { id: string, nombre: string }) => ({
          id: sede.id,
          nombre: sede.nombre
        })));
      } else {
        console.error("La respuesta de la API no es un array:", sedeResponse.data);
        toast.error('Error al obtener las sedes: la respuesta no es válida.');
      }

      // Obtener el UUID del tipo de ubicación desde la nueva URL
      const tipoUbicacionResponse = await axios.get("https://localhost:8080/general/api/v1/tipoUbicacion", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Verifica si la respuesta tiene la propiedad 'datos' y es un array
      if (tipoUbicacionResponse.data.datos && Array.isArray(tipoUbicacionResponse.data.datos)) {
        setTipoUbicacionOptions(tipoUbicacionResponse.data.datos.map((tipo: { id: string, nombre: string }) => ({
          id: tipo.id,
          nombre: tipo.nombre
        })));
      } else {
        console.error("La respuesta de la API no contiene 'datos' o no es un array:", tipoUbicacionResponse.data);
        toast.error('Error al obtener los tipos de ubicación: la respuesta no es válida.');
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      toast.error('Error al obtener datos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      console.log("Token de Auth0:", token);
      
      const response = await axios.post('http://localhost:8080/general/api/v1/usuarios/ubicacion', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Ubicación registrada exitosamente');
      setFormData({ ubicacionNombre: '', sedeId: '', tipoUbicacionId: '' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        const errorMessages = error.response?.data?.mensajes || ['Error al registrar ubicación'];
        const errorMessage = errorMessages.join(', ');
        toast.error(errorMessage);
      } else {
        console.error('Error desconocido:', error);
        toast.error('Ocurrió un error desconocido');
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Location Name</label>
        <input
          type="text"
          name="ubicacionNombre"
          value={formData.ubicacionNombre}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Campus ID</label>
        <select
          name="sedeId"
          value={formData.sedeId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione una sede</option>
          {sedeOptions.map((sede) => (
            <option key={sede.id} value={sede.id}>{sede.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location Type ID</label>
        <select
          name="tipoUbicacionId"
          value={formData.tipoUbicacionId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione un tipo de ubicación</option>
          {tipoUbicacionOptions.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Registrando...' : 'Registrar Ubicación'}
      </button>
    </form>
  );
};

export default RegisterLocation;