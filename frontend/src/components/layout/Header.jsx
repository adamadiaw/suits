// frontend/src/components/layout/Header.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTenantStore } from '../../store/tenantStore';
import { useCart } from '../../hooks/useCart';
import TenantSelector from '../TenantSelector';
import { Icons } from '../../icons';
import logoOmnia from '../../assets/logo.png';

function Header({ onSearch }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { tenants, currentTenant, setCurrentTenant } = useTenantStore();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTenantChange = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src={logoOmnia} 
              alt="OMNIA" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                OMNIA
              </h1>
              <p className="text-[10px] text-gray-400 -mt-0.5">Collections exclusives</p>
            </div>
          </Link>

          {/* Barre de recherche (bureau) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-2 pl-9 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Actions (bureau) */}
          <div className="hidden md:flex items-center gap-4">
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
                  <span className="hidden lg:inline">{user?.firstName}</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1 text-sm bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">
                    <Icons.Admin />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Icons.Logout />
                  <span className="hidden lg:inline">Déconnexion</span>
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

          {/* Bouton menu mobile + icônes */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Panier (mobile) */}
            <Link to="/cart" className="relative p-1.5 text-gray-700">
              <Icons.Cart />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Bouton menu hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 space-y-3 animate-slide-up">
            {/* 👇 Barre de recherche mobile */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-9 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50 placeholder:text-gray-400"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sélecteur de boutique */}
            <TenantSelector
              tenants={tenants}
              currentTenant={currentTenant}
              onSelect={handleTenantChange}
            />

            {/* Auth mobile */}
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/account" 
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-1.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icons.User />
                  {user?.firstName} {user?.lastName}
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 text-sm bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors w-fit"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icons.Admin />
                    Admin
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors py-1.5 text-left"
                >
                  <Icons.Logout />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/login" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors w-fit"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;