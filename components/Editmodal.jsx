

'use client';

import { useState, useEffect } from 'react';
import { 
  FaStar, 
 
  FaEdit, 
 
  FaTimes, 
  FaSave, 
  FaSpinner,
 
  FaCommentAlt
} from 'react-icons/fa';
import StarRating from './Starrating';





const EditModal = ({ review, isOpen, onClose, onSave }) => {
  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment || '');
    }
  }, [review]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(review._id, { rating, comment });
      onClose();
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl transform transition-all">
        <div className="flex items-center mb-6">
          <FaEdit className="text-2xl text-blue-600 mr-3" />
          <h3 className="text-2xl font-bold text-gray-900">Edit Review</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FaStar className="mr-2 text-yellow-500" />
              Rating
            </label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FaCommentAlt className="mr-2 text-blue-500" />
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Enter review comment..."
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold flex items-center justify-center"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 font-semibold flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal