import { useState } from "react";
import { useNavigate } from "react-router";
import { csrfFetch } from "../../store/csrf";

// import './CreateSpot.css'

function UpdateSpot() {
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
    previewImage: "",
    additionalImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { additionalImages, ...spotFormData } = spotData;


    console.log("Additional Images:", additionalImages);

      // Create spot and get the response
      const spotResponse = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        ...spotFormData,
        // Ensure previewImage is not an empty string before adding it to the request
        previewImage: spotFormData.previewImage,
        // Filter out empty strings from additionalImages
        additionalImages: additionalImages.filter(image => image !== ""),
      }),
    });

      if (!spotResponse.ok) {
        const errorData = await spotResponse.json();
        throw new Error(`Error creating spot: ${errorData.message}`);
      }

    // const spot = await spotResponse.json();
    navigate('/')


    } catch (error) {
      console.error("Unexpected error:", error);
      setError(error.message || "Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleChange = (e) => {
  const { name, value } = e.target;
  console.log("handleChange function called");
  console.log("Before State Update", spotData);

  const updatedValue = name === "previewImage" ? value : value;

  setSpotData((prevData) => ({
    ...prevData,
    [name]: updatedValue,
  }));

  console.log("After State Update", spotData);
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

       {/* Image Upload
      <div className="imageUpload">
        <label htmlFor="previewImage">Upload Preview Image (URL):</label>
        <input
          type="text"
          id="previewImage"
          name="previewImage"
          value={spotData.previewImage}
          onChange={handleChange}
        />

        {spotData.previewImage && (
          <>
            <h4>Preview Image:</h4>
            <img src={spotData.previewImage} alt="Preview" />
          </>
        )}

        <label htmlFor="additionalImages">Upload Additional Images (URLs):</label>
        {spotData.additionalImages.map((image, index) => (
          <div key={index}>
            <input
              type="text"
              value={image}
              onChange={(e) => handleAdditionalImageChange(index, e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveImageField(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddImageField}>
          Add Image
        </button>
      </div> */}

      {loading && <p>Creating spot...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Create Spot</button>
    </form>
  );
}

export default UpdateSpot;
