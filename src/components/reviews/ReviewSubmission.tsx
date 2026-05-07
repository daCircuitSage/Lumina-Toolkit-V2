import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewSubmissionProps {
  onSubmit: (review: {
    rating: number;
    content: string;
    name: string;
    role: string;
  }) => void;
  onCancel: () => void;
}

export default function ReviewSubmission({ onSubmit, onCancel }: ReviewSubmissionProps) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = countWords(content);
  const maxWords = 80;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !name.trim()) {
      return;
    }

    if (wordCount > maxWords) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        content: content.trim(),
        name: name.trim(),
        role: role.trim() || 'User'
      });
      
      // Reset form
      setContent('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">
          Share Your Experience
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 placeholder:text-zinc-400"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Role/Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 placeholder:text-zinc-400 text-zinc-900"
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-zinc-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-zinc-900 placeholder:text-zinc-400 ${
                wordCount > maxWords ? 'border-red-500' : 'border-zinc-300'
              }`}
              rows={4}
              placeholder="Share your experience with Lumina Toolkit..."
              required
            />
            <p className={`text-xs mt-1 ${
              wordCount > maxWords ? 'text-red-500' : 'text-zinc-500'
            }`}>
              {wordCount}/{maxWords} words
              {wordCount > maxWords && (
                <span className="ml-2">Please reduce to {maxWords} words or less</span>
              )}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim() || !name.trim() || wordCount > maxWords}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>

        {currentUser && (
          <p className="text-xs text-zinc-500 mt-4 text-center">
            Submitted as: {currentUser.email}
          </p>
        )}
      </div>
    </div>
  );
}
