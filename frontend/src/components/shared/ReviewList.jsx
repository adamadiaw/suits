// frontend/src/components/shared/ReviewList.jsx

import { useState, useEffect } from 'react';
import { productService } from '../../services';
import { useAuthStore } from '../../store/authStore';
import { useTenantStore } from '../../store/tenantStore';
import Stars from './Stars';
import { Icons } from '../../icons';

function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated } = useAuthStore();
  const { currentTenant } = useTenantStore();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await productService.getReviews(productId);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await productService.addReview(productId, {
        rating,
        comment,
        userId: user.id,
        tenantId: currentTenant?.id,
      });

      setComment('');
      setRating(5);
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      setError('Erreur lors de l\'envoi de l\'avis');
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Avis clients</h3>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <Stars rating={averageRating} size="md" showNumber />
              <span className="text-sm text-gray-400">({totalReviews} avis)</span>
            </div>
          )}
        </div>
        {isAuthenticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Donner mon avis
          </button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm font-medium text-gray-700">Note :</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    {star <= rating ? (
                      <StarFilled className="w-6 h-6" />
                    ) : (
                      <StarEmpty className="w-6 h-6" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Votre avis sur ce produit..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-white placeholder:text-gray-400 resize-none"
              rows="3"
            />

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            <div className="flex gap-2 mt-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Envoi...' : 'Envoyer'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des avis */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucun avis pour le moment</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Stars rating={review.rating} size="sm" />
                    <span className="text-sm font-medium text-gray-900">
                      {review.user.firstName} {review.user.lastName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 mt-1.5">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Icônes étoiles (réutilisées depuis Stars.jsx ou définies ici)
function StarFilled({ className }) {
  return (
    <svg className={`${className} fill-yellow-400 text-yellow-400`} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function StarEmpty({ className }) {
  return (
    <svg className={`${className} text-gray-300`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default ReviewList;