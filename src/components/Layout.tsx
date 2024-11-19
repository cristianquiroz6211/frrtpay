import { useAuth0 } from '@auth0/auth0-react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Home, UserPlus, MapPin, UserMinus, RefreshCw } from 'lucide-react';

export default function Layout() {
  const { logout, user } = useAuth0();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Register Affiliate', href: '/register-affiliate', icon: UserPlus },
    { name: 'Update Affiliate', href: '/update-affiliate', icon: RefreshCw },
    { name: 'Register Location', href: '/register-location', icon: MapPin },
    { name: 'Delete Account', href: '/delete-account', icon: UserMinus },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-green-700 text-white">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <span className="text-2xl font-bold">DeviUCO PAY</span>
              </div>
              <div className="flex flex-col flex-grow">
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          location.pathname === item.href
                            ? 'bg-green-800 text-white'
                            : 'text-white hover:bg-green-600'
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-green-800 p-4">
                <div className="flex items-center w-full">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={user?.picture}
                      alt={user?.name}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <button
                      onClick={() => logout()}
                      className="flex items-center text-sm text-green-200 hover:text-white"
                    >
                      <LogOut className="mr-1 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}