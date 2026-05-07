import React from 'react';
import { Star } from 'lucide-react';

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

interface ReviewDisplayProps {
  review: Review;
  className?: string;
}

export default function ReviewDisplay({ review, className = '' }: ReviewDisplayProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 ${className}`}>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${
              i < review.rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-zinc-600'
            }`} 
          />
        ))}
      </div>
      
      <p className="text-zinc-300 mb-4 italic">"{review.content}"</p>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">{review.name}</p>
          <p className="text-sm text-zinc-400">{review.role}</p>
        </div>
        
        {review.createdAt && (
          <p className="text-xs text-zinc-500">
            {formatDate(review.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}
