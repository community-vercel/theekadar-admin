'use client';

import { useState, useEffect } from 'react';
import { 
  FaStar, 
  FaUser, 
  FaFileAlt, 
  FaEdit, 
  FaTrashAlt, 
  FaCalendarAlt, 
  FaQuoteLeft, 
  FaComments, 
  FaSync, 
  FaSearch, 
  FaFilter, 
  FaInbox, 
  FaTimes, 
  FaSpinner,
  FaHeart,
  FaFrown,
} from 'react-icons/fa';
import { fetchReviews, updateReview, deleteReview } from '../../../../lib/api';
import StarRating from '@/components/Starrating';
import EditModal from '@/components/Editmodal';
import AdminLayout from '@/components/AdminLayout';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    loadReviews();
  }, [pagination.page]);

  useEffect(() => {
    filterReviews();
  }, [searchTerm, ratingFilter, reviews]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchReviews({ page: pagination.page, limit: pagination.limit });
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        pages: data.pages || 1
      }));
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.postId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter) {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowEditModal(true);
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(reviewToDelete);
      await loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setShowDeleteDialog(false);
      setReviewToDelete(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };
   const handleSaveEdit = async (reviewId, data) => {
    try {
      await updateReview(reviewId, data);
      await loadReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
          <p className="text-gray-600 text-lg font-semibold">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaComments className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Reviews Management
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Manage and moderate user reviews</p>
              </div>
            </div>
            <button
              onClick={loadReviews}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <FaSync className="mr-2" />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium">Total Reviews</p>
                  <p className="text-3xl font-bold">{reviews.length}</p>
                </div>
                <FaComments className="text-3xl text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 font-medium">Average Rating</p>
                  <p className="text-3xl font-bold">{getAverageRating()}</p>
                </div>
                <FaStar className="text-3xl text-yellow-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 font-medium">5-Star Reviews</p>
                  <p className="text-3xl font-bold">{ratingDistribution[5]}</p>
                </div>
                <FaHeart className="text-3xl text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 font-medium">1-Star Reviews</p>
                  <p className="text-3xl font-bold">{ratingDistribution[1]}</p>
                </div>
                <FaFrown className="text-3xl text-red-200" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reviews, users, or posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-lg text-gray-900"
                />
              </div>
            </div>
            
            <div className="sm:w-60">
              <div className="relative">
                <FaFilter className="text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-lg appearance-none bg-white text-gray-900"
                >
                  <option value="">All Ratings</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100 text-gray-900">
              <FaInbox className="text-6xl text-gray-300 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Reviews Found</h3>
              <p className="text-gray-600 text-lg">
                {searchTerm || ratingFilter ? 'Try adjusting your filters to see more results' : 'No reviews have been submitted yet'}
              </p>
              {(searchTerm || ratingFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRatingFilter('');
                  }}
                  className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                >
                  <FaTimes className="mr-2 inline" />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Post</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Comment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                      {filteredReviews.map((review, index) => (
                        <tr 
                          key={review._id}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                            <FaUser className="text-sm" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {review.userId?.name || 'Unknown User'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-900">
                          <FaFileAlt className="text-gray-500" />
                          <span>{review.postId?.title || 'Unknown Post'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StarRating rating={review.rating} readOnly />
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        {review.comment ? (
                          <div className="flex items-start space-x-2">
                            <FaQuoteLeft className="text-blue-500 text-sm mt-1 flex-shrink-0" />
                            <p className="text-gray-700 truncate">{review.comment}</p>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">No comment</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <FaCalendarAlt />
                          <span>
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(review)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                title="Edit Review"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(review._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                                title="Delete Review"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} reviews
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Delete Confirmation Dialog */}
          {showDeleteDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this review? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setReviewToDelete(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Edit Modal */}
        <EditModal
          review={editingReview}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingReview(null);
          }}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
    </AdminLayout>
  );
}