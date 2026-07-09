// frontend/src/components/layout/Header.jsx

import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTenantStore } from '../../store/tenantStore';
import { useCart } from '../../hooks/useCart';
import TenantSelector from '../TenantSelector';
import { Icons } from '../../icons';
import logoOmnia from '../../assets/logo.png';

function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { tenants, currentTenant, setCurrentTenant } = useTenantStore();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const handleTenantChange = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logoOmnia} 
              alt="OMNIA" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                OMNIA
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Collections exclusives</p>
            </div>
          </Link>

          {/* Sélecteur de boutique + Actions */}
          <div className="flex items-center gap-4">
            <TenantSelector
              tenants={tenants}
              currentTenant={currentTenant}
              onSelect={handleTenantChange}
            />

            {/* Panier */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700">
              <Icons.Cart />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/account" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Icons.User />
                  {user?.firstName}
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1 text-sm bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">
                    <Icons.Admin />
                    Admin
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Icons.Logout />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;