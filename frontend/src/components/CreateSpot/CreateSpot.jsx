import { useState } from "react";
import { useNavigate } from "react-router";
import { csrfFetch } from "../../store/csrf";
import './CreateSpot.css'

function CreateSpot() {
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

  const handleAdditionalImageChange = (index, value) => {
    const updatedAdditionalImages = [...spotData.additionalImages];
    updatedAdditionalImages[index] = value;

    setSpotData((prevData) => ({
      ...prevData,
      additionalImages: updatedAdditionalImages,
    }));
  };

  const handleAddImageField = () => {
    setSpotData((prevData) => ({
      ...prevData,
      additionalImages: [...prevData.additionalImages, ""],
    }));
  };

  const handleRemoveImageField = (index) => {
    const updatedAdditionalImages = [...spotData.additionalImages];
    updatedAdditionalImages.splice(index, 1);

    setSpotData((prevData) => ({
      ...prevData,
      additionalImages: updatedAdditionalImages,
    }));
  };

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
          placeholder="Country"
          onChange={handleChange}
        />

        <label htmlFor="address">Street Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={spotData.address}
          placeholder="Street Address"
          onChange={handleChange}
        />

        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={spotData.city}
          placeholder="City"
          onChange={handleChange}
        />

        <label htmlFor="state">State</label>
        <input
          type="text"
          id="state"
          name="state"
          value={spotData.state}
          placeholder="State"
          onChange={handleChange}
        />
      </div>
      <div>
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any secial amentities like fast wifi or parking, and what you love about the neighborhood.</p>
        {/* <label htmlFor="description">Description</label> */}
        <textarea
          id="description"
          name="description"
          value={spotData.description}
          placeholder="Please write at least 30 characters"
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <h2>Create a title for your spot</h2>
        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
        {/* <label htmlFor="name">Name</label> */}
        <input
          type="text"
          id="name"
          name="name"
          value={spotData.name}
          placeholder="Name of your spot"
          onChange={handleChange}
        />

      </div>

      <div>
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and reank higher in search results.</p>

      {/* <label htmlFor="price">$</label> */}
      $ <input
        type="text"
        id="price"
        name="price"
          value={spotData.price}
          placeholder="Prcie per night (USD)"
        onChange={handleChange}
      />

      </div>

       {/* Image Upload */}
      <div className="imageUpload">
        <h2>Liven up your spot with photots</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
        {/* <label htmlFor="previewImage">Upload Preview Image (URL):</label> */}
        <input
          type="text"
          id="previewImage"
          name="previewImage"
          value={spotData.previewImage}
          placeholder="Preview Image URL"
          onChange={handleChange}
        />

        {spotData.previewImage && (
          <>
            <h4>Preview Image:</h4>
            <img src={spotData.previewImage} alt="Preview" />
          </>
        )}

        {/* <label htmlFor="additionalImages">Upload Additional Images (URLs):</label> */}
        {spotData.additionalImages.map((image, index) => (
          <div key={index}>
            <input
              type="text"
              value={image}
              placeholder="Image URL"
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
      </div>

      {loading && <p>Creating spot...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Create Spot</button>
    </form>
  );
}

export default CreateSpot;
