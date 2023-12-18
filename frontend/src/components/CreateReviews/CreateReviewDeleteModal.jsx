
// import { useModal } from "../../context/Modal";

// function DeleteReview() {
//     const { setModalContent, closeModal } = useModal(); // Use closeModal instead of onClose

//     const confirmDelete = async () => {
//       try {
//         const response = await dispatch(deleteReview(reviewId));
//        if (response.ok) {

//          setModalContent(
//            <div>
//              <p>Review successfully deleted!</p>
//            </div>
//          );

//         // Close the modal using closeModal
//          closeModal();
//        } else {
//          setModalContent(
//            <div>
//              <p>Error deleting Review. Please try again.</p>
//            </div>
//          );
//        }
//      } catch (error) {
//       console.error('An unexpected error occurred:', error);
//      }
//     };

//  const cancelDelete = () => {
//     // Clear the modal content
//     setModalContent(null);
//     // Call the onCancel callback passed from the parent component
//     onCancel();

//     }

//     return (
//         <div>
//             <h1>Confirm Delete</h1>
//             <p>Are you sure you want ot delete this review?</p>
//             <button onClick={() => confirmDelete(reviewId)}>Yes (Delete Spot)</button>
//             <button onClick={cancelDelete}>No (Keep Spot)</button>
//         </div>
//     )
//  }

// export default DeleteReview;
