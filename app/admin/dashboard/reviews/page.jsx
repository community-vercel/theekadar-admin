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
    pages: 1,
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
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        pages: data.pages || 1,
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
      filtered = filtered.filter(
        (review) =>
          review.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.postId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter) {
      filtered = filtered.filter((review) => review.rating === parseInt(ratingFilter));
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
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
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
        <div className="text-center bg-white p-6 rounded-xl shadow-lg sm:p-8 sm:rounded-2xl">
          <FaSpinner className="animate-spin text-3xl text-blue-600 mb-3 mx-auto sm:text-4xl sm:mb-4" />
          <p className="text-gray-600 text-base font-semibold sm:text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 sm:rounded-3xl sm:p-8 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-4">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-md">
                  <FaComments className="text-lg sm:text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Reviews Management
                  </h1>
                  <p className="text-gray-600 mt-1 text-xs sm:mt-2 sm:text-lg">Manage and moderate user reviews</p>
                </div>
              </div>
              <button
                onClick={loadReviews}
                className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:px-6 sm:py-3 sm:text-base"
              >
                <FaSync className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-4 sm:gap-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 sm:rounded-2xl sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium text-sm sm:text-base">Total Reviews</p>
                  <p className="text-2xl font-bold sm:text-3xl">{reviews.length}</p>
                </div>
                <FaComments className="text-2xl sm:text-3xl text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 sm:rounded-2xl sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 font-medium text-sm sm:text-base">Average Rating</p>
                  <p className="text-2xl font-bold sm:text-3xl">{getAverageRating()}</p>
                </div>
                <FaStar className="text-2xl sm:text-3xl text-yellow-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 sm:rounded-2xl sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 font-medium text-sm sm:text-base">5-Star Reviews</p>
                  <p className="text-2xl font-bold sm:text-3xl">{ratingDistribution[5]}</p>
                </div>
                <FaHeart className="text-2xl sm:text-3xl text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 sm:rounded-2xl sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 font-medium text-sm sm:text-base">1-Star Reviews</p>
                  <p className="text-2xl font-bold sm:text-3xl">{ratingDistribution[1]}</p>
                </div>
                <FaFrown className="text-2xl sm:text-3xl text-red-200" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:mb-8">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 text-sm sm:left-4 sm:text-base" />
                <input
                  type="text"
                  placeholder="Search reviews, users, or posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm sm:pl-12 sm:pr-4 sm:py-4 sm:text-lg text-gray-900"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <FaFilter className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 text-sm sm:left-4 sm:text-base" />
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm sm:pl-12 sm:pr-4 sm:py-4 sm:text-lg appearance-none bg-white text-gray-900"
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

          {/* Reviews Display */}
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 text-gray-900 sm:rounded-3xl sm:p-16">
              <FaInbox className="text-4xl sm:text-6xl text-gray-300 mb-4 sm:mb-6 mx-auto" />
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Reviews Found</h3>
              <p className="text-gray-600 text-sm sm:text-lg">
                {searchTerm || ratingFilter ? 'Try adjusting your filters to see more results' : 'No reviews have been submitted yet'}
              </p>
              {(searchTerm || ratingFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRatingFilter('');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm sm:px-6 sm:py-3 sm:text-base"
                >
                  <FaTimes className="mr-2 inline" />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Card Layout for Mobile */}
              <div className="block sm:hidden space-y-4 mb-6">
                {filteredReviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white border rounded-lg shadow-md p-4 hover:bg-gray-50 transition duration-300"
                  >
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-gray-700">User:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                            <FaUser className="text-xs" />
                          </div>
                          <p className="text-xs text-gray-900">{review.userId?.name || 'Unknown User'}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Post:</span>
                        <div className="flex items-center space-x-2">
                          <FaFileAlt className="text-gray-500 text-xs" />
                          <p className="text-xs text-gray-900">{review.postId?.title || 'Unknown Post'}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Rating:</span>
                        <StarRating rating={review.rating} readOnly />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Comment:</span>
                        {review.comment ? (
                          <div className="flex items-start space-x-2">
                            <FaQuoteLeft className="text-blue-500 text-xs mt-1 flex-shrink-0" />
                            <p className="text-xs text-gray-700">{review.comment}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic">No comment</p>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Date:</span>
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-gray-500 text-xs" />
                          <p className="text-xs text-gray-900">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Actions:</span>
                        <div className="flex space-x-2 mt-1">
                          <button
                            onClick={() => handleEdit(review)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 hover:scale-110"
                            title="Edit Review"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(review._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 hover:scale-110"
                            title="Delete Review"
                          >
                            <FaTrashAlt className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Layout for Larger Screens */}
              <div className="hidden sm:block bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                          User
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                          Post
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                          Rating
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                          Comment
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                          Date
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 sm:px-6 sm:py-4 sm:text-sm">
                          Actions
                        </th>
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
                          <td className="px-3 py-2 sm:px-6 sm:py-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                                <FaUser className="text-xs sm:text-sm" />
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-gray-900">
                                {review.userId?.name || 'Unknown User'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-4">
                            <div className="flex items-center space-x-2 text-gray-900">
                              <FaFileAlt className="text-gray-500 text-xs sm:text-base" />
                              <span className="text-xs sm:text-sm">{review.postId?.title || 'Unknown Post'}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-4">
                            <StarRating rating={review.rating} readOnly />
                          </td>
                          <td className="px-3 py-2 max-w-xs sm:px-6 sm:py-4 sm:max-w-sm">
                            {review.comment ? (
                              <div className="flex items-start space-x-2">
                                <FaQuoteLeft className="text-blue-500 text-xs sm:text-sm mt-1 flex-shrink-0" />
                                <p className="text-xs sm:text-sm text-gray-700 truncate">{review.comment}</p>
                              </div>
                            ) : (
                              <span className="text-xs sm:text-sm text-gray-500 italic">No comment</span>
                            )}
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-4">
                            <div className="flex items-center space-x-2 text-gray-500">
                              <FaCalendarAlt className="text-xs sm:text-base" />
                              <span className="text-xs sm:text-sm">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(review)}
                                className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-110"
                                title="Edit Review"
                              >
                                <FaEdit className="text-sm sm:text-base" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(review._id)}
                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-110"
                                title="Delete Review"
                              >
                                <FaTrashAlt className="text-sm sm:text-base" />
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
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center sm:mt-6">
                <div className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-0">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:px-4 sm:text-base"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:px-4 sm:text-base"
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
              <div className="bg-white rounded-xl p-6 max-w-sm w-full sm:rounded-2xl sm:p-8 sm:max-w-md">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Confirm Delete</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                  Are you sure you want to delete this review? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3 sm:space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setReviewToDelete(null);
                    }}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm sm:px-4 sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:px-4 sm:text-base"
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