import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, CheckCircle, MessageSquare, Sparkles, ShieldCheck, User } from 'lucide-react';
import { Product, ProductReview } from '../types.ts';
import { getProductReviewsApi, submitProductReviewApi } from '../services/productService.ts';

interface RatingReviewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (updatedProduct: Product) => void;
}

export default function RatingReviewModal({
  product,
  isOpen,
  onClose,
  onReviewSubmitted
}: RatingReviewModalProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      setSubmitted(false);
      setError(null);
      setUserRating(5);
      setHoverRating(0);
      setComment('');
      fetchReviews(product.id);
    }
  }, [isOpen, product]);

  const fetchReviews = async (productId: string) => {
    setLoading(true);
    try {
      const data = await getProductReviewsApi(productId);
      setReviews(data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!comment.trim()) {
      setError('Please write a brief comment describing your experience.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await submitProductReviewApi(product.id, {
        userName: userName.trim() || 'Valued Guest',
        userEmail: userEmail.trim(),
        rating: userRating,
        comment: comment.trim()
      });

      if (res && res.success) {
        setSubmitted(true);
        if (res.data?.product && onReviewSubmitted) {
          onReviewSubmitted(res.data.product);
        }
        // Refresh review list
        fetchReviews(product.id);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-[#FDFCF0] rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#721C24] text-white p-6 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#21110C] text-[10px] font-bold tracking-wider uppercase">
                    Customer Ratings & Reviews
                  </span>
                  <span className="text-xs text-[#E8DFC8] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Verified Patisserie
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating || 5)
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-[#D4AF37]/40'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-bold text-sm">
                    {product.rating ? product.rating.toFixed(1) : '5.0'} / 5.0
                  </span>
                  <span className="text-[#E8DFC8] text-xs">
                    ({product.reviewCount || reviews.length} customer ratings)
                  </span>
                </div>
              </div>

              <button
                id="close-rating-modal-btn"
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            {/* Rate & Review Form */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFC8] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-[#2C1810] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Give Your Rating
                </h3>
                <span className="text-xs text-[#6E5A4E]">Share your celebration experience</span>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-emerald-900 text-base">
                    Thank You For Your Review!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Your rating has been recorded and the overall score has been updated.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-emerald-800 font-semibold underline pt-1"
                  >
                    Submit another review
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {error}
                    </div>
                  )}

                  {/* Interactive Star Picker */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C1810] mb-1.5">
                      Your Star Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = (hoverRating || userRating) >= star;
                          return (
                            <motion.button
                              key={star}
                              type="button"
                              id={`star-select-${star}`}
                              whileHover={{ scale: 1.25 }}
                              whileTap={{ scale: 0.9 }}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setUserRating(star)}
                              className="p-1 focus:outline-none transition-transform"
                            >
                              <Star
                                className={`w-7 h-7 transition-colors ${
                                  active
                                    ? 'fill-[#D4AF37] text-[#D4AF37] drop-shadow-sm'
                                    : 'text-stone-300'
                                }`}
                              />
                            </motion.button>
                          );
                        })}
                      </div>
                      <span className="text-sm font-bold text-[#721C24] ml-2">
                        {hoverRating || userRating} Star{((hoverRating || userRating) > 1 ? 's' : '')}
                        {((hoverRating || userRating) === 5 ? ' - Extraordinary!' : '')}
                        {((hoverRating || userRating) === 4 ? ' - Delicious!' : '')}
                        {((hoverRating || userRating) === 3 ? ' - Good' : '')}
                      </span>
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. David Vance"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#721C24] bg-[#FDFCF0]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="e.g. david@example.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#721C24] bg-[#FDFCF0]"
                      />
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                      Your Review / Experience *
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share flavor notes, freshness, delivery experience, or presentation..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#721C24] bg-[#FDFCF0] resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    id="submit-product-review-btn"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#721C24] hover:bg-[#58141B] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>Saving Rating...</>
                    ) : (
                      <>
                        <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" /> Submit Review & Rating
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>

            {/* Existing Customer Reviews List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#2C1810] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#721C24]" /> Customer Reviews
                </h3>
                <span className="text-xs text-[#6E5A4E] font-medium">
                  {reviews.length} Verified Review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-[#6E5A4E]">
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-2xl border border-[#E8DFC8] text-xs text-[#6E5A4E]">
                  No reviews yet for this product. Be the first to share your rating!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {reviews.map((rev) => (
                    <motion.div
                      key={rev.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-4 border border-[#E8DFC8]/80 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#F4EBE1] text-[#721C24] flex items-center justify-center text-xs font-bold">
                            {rev.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#2C1810]">
                              {rev.userName}
                            </p>
                            <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Patron
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating
                                  ? 'fill-[#D4AF37] text-[#D4AF37]'
                                  : 'text-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-[#4A3B32] font-light leading-relaxed pl-9">
                        "{rev.comment}"
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="p-4 bg-[#F4EBE1] border-t border-[#E8DFC8] text-center text-[11px] text-[#6E5A4E]">
            🌟 All ratings and reviews directly influence our artisanal pastry ranking at 245 Lexington Ave.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
