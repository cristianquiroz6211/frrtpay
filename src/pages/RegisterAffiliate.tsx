import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterAffiliate = () => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [formData, setFormData] = useState({
    idAfiliado: '',
    nombre: '',
    correo: '',
    telefono: '',
    pin: '',
    confpin: '',
    tipoIdentificacion: ''
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
      console.log("Token de Auth0:", token);
      
      const response = await axios.get("https://localhost:8080/general/api/v1/tipoIdentificacion", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Verifica si la respuesta tiene la propiedad 'datos' y es un array
      if (response.data.datos && Array.isArray(response.data.datos)) {
        setTipoIdentificacionOptions(response.data.datos.map((tipo: { id: string, nombre: string }) => ({
          id: tipo.id,
          nombre: tipo.nombre
        })));
      } else {
        console.error("La respuesta de la API no contiene 'datos' o no es un array:", response.data);
        toast.error('Error al obtener los tipos de identificación: la respuesta no es válida.');
      }
    } catch (error) {
      console.error("Error al obtener tipos de identificación:", error);
      toast.error('Error al obtener tipos de identificación');
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
      
      const response = await axios.post('https://localhost:8080/general/api/v1/usuarios', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Afiliado registrado exitosamente');
      setFormData({ idAfiliado: '', nombre: '', correo: '', telefono: '', pin: '', confpin: '', tipoIdentificacion: '' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        const errorMessages = error.response?.data?.mensajes || ['Error al registrar afiliado'];
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
        <label className="block text-sm font-medium text-gray-700">Affiliate ID</label>
        <input
          type="text"
          name="idAfiliado"
          value={formData.idAfiliado}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">PIN</label>
        <input
          type="password"
          name="pin"
          maxLength={4}
          value={formData.pin}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm PIN</label>
        <input
          type="password"
          name="confpin"
          maxLength={4}
          value={formData.confpin}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">ID Type</label>
        <select
          name="tipoIdentificacion"
          value={formData.tipoIdentificacion}
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

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Registrando...' : 'Registrar Afiliado'}
      </button>
    </form>
  );
};

export default RegisterAffiliate;