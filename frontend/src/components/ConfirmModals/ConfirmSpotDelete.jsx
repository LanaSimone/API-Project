import { useModal } from "../../context/Modal";
import {  deleteSpots } from "../../store/spots/spotActions";
import { useDispatch } from "react-redux";
import './ConfirmSpotDelete.css'


function ConfirmSpotDelete({ spotId, onCancel }) {
  const { setModalContent, closeModal } = useModal(); // Use closeModal instead of onClose
  const dispatch = useDispatch();

  const confirmDelete = async () => {
    try {
      const response = await dispatch(deleteSpots(spotId));
      if (response.ok) {
        setModalContent(
          <div>
            <p>Spot successfully deleted!</p>
          </div>
        );
        // Close the modal using closeModal
        closeModal();
      } else {
        setModalContent(
          <div>
            <p>Error deleting spot. Please try again.</p>
          </div>
        );
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const cancelDelete = () => {
    // Clear the modal content
    setModalContent(null);
    // Call the onCancel callback passed from the parent component
    onCancel();
  };

  return (
    <div className='delete-modal'>
      <div className="reviewDeleteModal">
        <div id="deletecontent">
          <h1 className="h1delete">Confirm Delete</h1>
          <div className="deletespottext">
          <p>Are you sure you want to remove this spot from the listings?</p>

          </div>
          <div className="deleteButtons">
              <button onClick={() => confirmDelete(spotId)} className="deletespotbttn">Yes (Delete Spot)</button>
              <button onClick={cancelDelete} className="cancelspotbttn">No (Keep Spot)</button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ConfirmSpotDelete;
