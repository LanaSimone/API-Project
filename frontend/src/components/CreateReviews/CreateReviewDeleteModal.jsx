
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/spots/spotActions";

function DeleteReview({ reviewId, onCancel }) {
    console.log('Received reviewId:', reviewId);
  const { setModalContent, closeModal } = useModal();
  const dispatch = useDispatch();


        const confirmDelete = async () => {
            try {
                await dispatch(deleteReview(reviewId));
                setModalContent(
                    <div>
                        <p>Review successfully deleted!</p>
                    </div>
                );

                // Close the modal
                closeModal();
            } catch (error) {
                // Handle error
                console.error('Error deleting review:', error.message);
            }
        
    }

  const cancelDelete = () => {
    setModalContent(null);
    onCancel(); // Call the onCancel callback passed from the parent component
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
         <button onClick={confirmDelete}>Yes (Delete Review)</button>
      <button onClick={cancelDelete}>No (Keep Review)</button>
    </div>
  );
}

export default DeleteReview;
