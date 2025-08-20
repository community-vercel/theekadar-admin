
import { 
  FaStar, 

} from 'react-icons/fa';
const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-lg ${
            star <= rating
              ? 'text-yellow-400'
              : 'text-gray-300'
          } ${!readOnly ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
          onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
};

export default StarRating