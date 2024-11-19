import { useAuth0 } from '@auth0/auth0-react';
import { Users, MapPin, UserMinus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth0();

  const stats = [
    {
      name: 'Register Affiliate',
      icon: Users,
      href: '/register-affiliate',
      description: 'Register new affiliates in the system',
    },
    {
      name: 'Update Affiliate',
      icon: RefreshCw,
      href: '/update-affiliate',
      description: 'Update existing affiliate information',
    },
    {
      name: 'Register Location',
      icon: MapPin,
      href: '/register-location',
      description: 'Add new locations to the system',
    },
    {
      name: 'Delete Account',
      icon: UserMinus,
      href: '/delete-account',
      description: 'Remove accounts from the system',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what you can do in your dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-green-700" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="mt-1 text-xs text-gray-900">
                        {item.description}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}