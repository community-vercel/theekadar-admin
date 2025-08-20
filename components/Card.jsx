
import { 
  FaStar, 
  FaUser, 
  FaFileAlt, 
  FaEdit, 
  FaTrashAlt, 
  FaCalendarAlt, 
  FaQuoteLeft, 

} from 'react-icons/fa';




const ReviewCard = ({ review, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            <FaUser />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">{review.userId?.username || 'Unknown User'}</h4>
            <p className="text-sm text-gray-500 flex items-center">
              <FaFileAlt className="mr-1" />
              {review.postId?.title || 'Unknown Post'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(review)}
            className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
            title="Edit Review"
          >
            <FaEdit className="text-lg" />
          </button>
          <button
            onClick={() => onDelete(review._id)}
            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
            title="Delete Review"
          >
            <FaTrashAlt className="text-lg" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <StarRating rating={review.rating} readOnly />
        <span className="text-sm text-gray-500 flex items-center bg-gray-50 px-3 py-1 rounded-full">
          <FaCalendarAlt className="mr-2" />
          {new Date(review.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>

      {review.comment && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mt-4 border-l-4 border-blue-500">
          <div className="flex items-start space-x-2">
            <FaQuoteLeft className="text-blue-500 text-sm mt-1" />
            <p className="text-gray-700 leading-relaxed italic">{review.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ReviewCard