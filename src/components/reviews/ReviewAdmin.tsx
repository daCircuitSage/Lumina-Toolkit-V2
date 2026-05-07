import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReviewDisplay from './ReviewDisplay';

interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  userId: string;
  userEmail: string;
  createdAt: any;
  featured?: boolean;
}

export default function ReviewAdmin() {
  const { getAllReviews } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const allReviews = await getAllReviews();
      setReviews(allReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (reviewId: string, currentFeatured: boolean) => {
    // This would require admin permissions and Firebase security rules
    // For now, this is a placeholder for the admin functionality
    alert('Admin functionality requires Firebase security rules setup. See guide below.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Review Management</h1>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Review Management</h1>
        
        <div className="mb-8 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Control Featured Reviews</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Method 1: Firebase Console</strong></p>
            <ol className="ml-4 list-decimal space-y-1">
              <li>Go to Firebase Console → Firestore Database</li>
              <li>Navigate to the "reviews" collection</li>
              <li>Click on any review document</li>
              <li>Add or modify the "featured" field: true/false</li>
            </ol>
            
            <p className="mt-4"><strong>Method 2: Security Rules Setup</strong></p>
            <p>To enable admin controls from the web interface, you need to set up Firebase security rules.</p>
          </div>
        </div>

        <div className="grid gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="relative">
              <ReviewDisplay review={review} />
              
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  review.featured 
                    ? 'bg-green-600 text-white' 
                    : 'bg-zinc-600 text-zinc-300'
                }`}>
                  {review.featured ? 'Featured' : 'Not Featured'}
                </span>
                
                <button
                  onClick={() => toggleFeatured(review.id, review.featured || false)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full transition-colors"
                >
                  {review.featured ? 'Remove' : 'Feature'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <p>No reviews found. Users need to submit reviews first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
