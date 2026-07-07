// frontend/src/Confirmation.jsx

import { Link, useLocation } from 'react-router-dom';

// Icônes SVG
const Icons = {
  Check: () => (
    <svg className="w-20 h-20 mx-auto text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Package: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
};

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