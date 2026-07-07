// frontend/src/Confirmation.jsx

import { Link, useLocation } from 'react-router-dom';

function Confirmation() {
  const location = useLocation();
  const { orderId, customerName } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <span className="text-6xl">✅</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Commande confirmée !</h1>
        <p className="text-gray-600 mt-2">
          Merci {customerName || 'pour votre commande'} !
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Commande n° {orderId || '#'}
        </p>
        <p className="text-gray-600 mt-4">
          Un email de confirmation vous a été envoyé.
        </p>
        <Link to="/">
          <button className="mt-6 bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800">
            Retour à la boutique
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Confirmation;