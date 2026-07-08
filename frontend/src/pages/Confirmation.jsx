// frontend/src/Confirmation.jsx

import { Link, useLocation } from 'react-router-dom';
import { Icons } from '../icons';


function Confirmation() {
  const location = useLocation();
  const { orderId, customerName } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center border border-gray-100">
        {/* Icône de confirmation */}
        <div className="mb-6">
          <div className="inline-flex p-4 bg-emerald-50 rounded-full">
            <Icons.Check />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Commande confirmée !
        </h1>

        <p className="text-gray-500 text-lg">
          Merci <span className="font-medium text-gray-700">{customerName || 'pour votre commande'}</span> !
        </p>

        {/* Numéro de commande */}
        <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-sm text-gray-600 border border-gray-100">
          <Icons.Package />
          Commande n° <span className="font-mono font-bold text-gray-900">{orderId || '#'}</span>
        </div>

        {/* Message email */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-center justify-center gap-2 text-sm text-blue-700">
          <Icons.Mail />
          Un email de confirmation vous a été envoyé
        </div>

        {/* Bouton retour */}
        <Link to="/">
          <button className="mt-8 w-full bg-gray-900 text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-all font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gray-900/20">
            <Icons.Home />
            Retour à la boutique
          </button>
        </Link>

        {/* Petit message de bas de page */}
        <p className="mt-6 text-xs text-gray-400">
          Nous vous recontacterons dès l'expédition de votre commande.
        </p>
      </div>
    </div>
  );
}

export default Confirmation;