import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useDispatch } from "react-redux";
import { updateSpots } from "../../store/spots/spotActions";
// import { useParams } from "react-router";

// import './CreateSpot.css'


function UpdateSpots() {
  const { spotId } = useParams();

  const [spotData, setSpotData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    lat: 0,
    lng: 0,
    name: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Ensure the "address" field is flattened before sending
    const { address, ...restData } = spotData;

    // Dispatch the updateSpots thunk
    const response = await dispatch(updateSpots(spotId, address, ...Object.values(restData)));

    console.log('Response from backend:', response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error updating spot: ${errorData.message}`);
    }

    // Handle success, if needed
    navigate('/');
  } catch (error) {
    console.error("Unexpected error:", error);
    setError(error.message || "Unexpected error. Please try again.");
  } finally {
    setLoading(false);
  }
};
const handleChange = (e) => {
  const { name, value } = e.target;

  let updatedValue = value;

  if (name === "price") {
    updatedValue = parseFloat(value);

    if (isNaN(updatedValue)) {
      updatedValue = "";
    }
  }

  setSpotData((prevData) => ({
    ...prevData,  // Spread the previous data
    [name]: updatedValue,  // Update the property directly without nesting
  }));
};
//   const handleAdditionalImageChange = (index, value) => {
//     const updatedAdditionalImages = [...spotData.additionalImages];
//     updatedAdditionalImages[index] = value;

//     setSpotData((prevData) => ({
//       ...prevData,
//       additionalImages: updatedAdditionalImages,
//     }));
//   };

//   const handleAddImageField = () => {
//     setSpotData((prevData) => ({
//       ...prevData,
//       additionalImages: [...prevData.additionalImages, ""],
//     }));
//   };

//   const handleRemoveImageField = (index) => {
//     const updatedAdditionalImages = [...spotData.additionalImages];
//     updatedAdditionalImages.splice(index, 1);

//     setSpotData((prevData) => ({
//       ...prevData,
//       additionalImages: updatedAdditionalImages,
//     }));
//   };

  return (
    <form onSubmit={handleSubmit} className="createSpot">
      <div className="heading">
        <h2>Create a new Spot</h2>
        <h3>Where&rsquo;s your place located?</h3>
        <p>
          Guests will only get your exact address once they booked a reservation.
        </p>
      </div>
      <div className="locationDetails">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          value={spotData.country}
          onChange={handleChange}
        />

        <label htmlFor="address">Street Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={spotData.address}
          onChange={handleChange}
        />

        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={spotData.city}
          onChange={handleChange}
        />

        <label htmlFor="state">State</label>
        <input
          type="text"
          id="state"
          name="state"
          value={spotData.state}
          onChange={handleChange}
        />
      </div>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={spotData.name}
        onChange={handleChange}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={spotData.description}
        onChange={handleChange}
      ></textarea>

      <label htmlFor="price">$</label>
      <input
        type="text"
        id="price"
        name="price"
        value={spotData.price}
        onChange={handleChange}
      />

      {loading && <p>Creating spot...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Update Spot</button>
    </form>
  );
}

export default UpdateSpots;
