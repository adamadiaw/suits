// frontend/src/components/shared/ProductFilters.jsx

import { useState } from 'react';
import { Icons } from '../../icons';

function ProductFilters({ filters, setFilters, onClose, isOpen, onOpen, activeCount }) {
  const handleGenderChange = (gender) => {
    setFilters(prev => ({ ...prev, gender }));
  };

  const handleSizeToggle = (size) => {
    setFilters(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      gender: 'all',
      minPrice: '',
      maxPrice: '',
      sizes: [],
    });
  };

  const hasActiveFilters = 
    filters.gender !== 'all' ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sizes.length > 0;

  const availableSizes = ['S', 'M', 'L', 'XL', '38', '39', '40', '41', '42', '43'];

  // Fonction pour fermer le popup ET appliquer
  const handleApply = () => {
    if (onClose) {
      onClose();
    }
  };

  // Fonction pour fermer le popup sans appliquer (annuler)
  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  // Icônes pour les genres
  const genderIcons = {
    all: <Icons.Grid />,
    femme: <Icons.Woman />,
    homme: <Icons.Man />,
    unisexe: <Icons.Unisex />,
  };

  return (
    <>
      {/* Bouton d'ouverture */}
      <button
        onClick={() => onOpen && onOpen()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Icons.Filter />
        Filtres
        {activeCount > 0 && (
          <span className="bg-gray-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Overlay + Modal */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleCancel}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up md:relative md:max-w-sm md:rounded-2xl md:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icons.X />
              </button>
            </div>
            <div className="space-y-4">
              {/* Genre */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {['all', 'femme', 'homme', 'unisexe'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => handleGenderChange(gender)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filters.gender === gender
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {genderIcons[gender]}
                      {gender === 'all' ? 'Tous' : 
                       gender === 'femme' ? 'Femme' :
                       gender === 'homme' ? 'Homme' : 'Unisexe'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Prix</h3>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handlePriceChange}
                      placeholder="Min"
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handlePriceChange}
                      placeholder="Max"
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Tailles */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tailles</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filters.sizes.includes(size)
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Réinitialiser
                  </button>
                )}
                <button
                  onClick={handleApply}
                  className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductFilters;