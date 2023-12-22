import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useDispatch } from "react-redux";
import { updateSpots } from "../../store/spots/spotActions";
// import { useParams } from "react-router";

// import './CreateSpot.css'


function UpdateSpots() {
  const { spotId } = useParams();

  const [spotData, setSpotData] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    // lat: 0,
    // lng: 0,
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
    navigate(`/details/${spotId}`);
  } catch (error) {
    console.error("Unexpected error:", error);
    setError(error.message || "Unexpected error. Please try again.");
  } finally {
    setLoading(false);
  }
  };

    useEffect(() => {
  const fetchSpotData = async () => {
    try {
      const response = await fetch(`/api/spots/${spotId}`);
      if (!response.ok) {
        throw new Error(`Error fetching spot data: ${response.statusText}`);
      }
      const spot = await response.json();

      // Set the initial state of spotData with specific fields
      setSpotData({
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        lat: spot.lat,
        lng: spot.lng


        // Add other fields as needed
      });
    } catch (error) {
      console.error("Error fetching spot data:", error);
    }
  };

  fetchSpotData();
    }, [spotId]);

const handleChange = (e) => {
  const { name, value } = e.target;

  let updatedValue = value;

  if (name === "price") {
    updatedValue = parseFloat(value);

    if (isNaN(updatedValue)) {
      updatedValue = "";
    }
  }

  // Only update specific fields in the state
  if (["address", "city", "state", "country", "name", "description", "price"].includes(name)) {
    setSpotData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  }
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
        <h2>Update your Spot</h2>
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

      <div>
        <h2>Create a title for your spot</h2>
        <p>Catch guests; attention with a spt title that highlights what makes your place special</p>
      {/* <label htmlFor="name">Name:</label> */}
      <input
        type="text"
        id="name"
        name="name"
        value={spotData.name}
        onChange={handleChange}
      />

      </div>
      <div>
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
      {/* <label htmlFor="description">Description</label> */}
      <textarea
        id="description"
        name="description"
        value={spotData.description}
        onChange={handleChange}
      ></textarea>

      </div>

      <div>
        <h2>Set a base price for your spot</h2>
        <p>Competitve pricing can help your listing stand out and rank higher in search results.</p>
      <label htmlFor="price">$</label>
      <input
        type="text"
        id="price"
        name="price"
        value={spotData.price}
        onChange={handleChange}
      />

      </div>


      {loading && <p>Creating spot...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Update your Spot</button>
    </form>
  );
}

export default UpdateSpots;
