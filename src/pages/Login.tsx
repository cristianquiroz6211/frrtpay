import { useAuth0 } from '@auth0/auth0-react';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          DeviUCO PAY
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Administrative Dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <button
            onClick={() => loginWithRedirect()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}