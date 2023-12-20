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
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

const validateForm = () => {
  const errors = {};

  if (!spotData.country.trim()) {
    errors.country = "Country is required.";
  }

  if (!spotData.address.trim()) {
    errors.address = "Street Address is required.";
  }

  if (!spotData.city.trim()) {
    errors.city = "City is required.";
  }

  if (!spotData.state.trim()) {
    errors.state = "State is required.";
  }

  if (spotData.description.trim().length < 30) {
    errors.description = "Description must be at least 30 characters.";
  }

  if (!spotData.name.trim()) {
    errors.name = "Spot Name is required.";
  }

  if (!spotData.price.trim()) {
    errors.price = "Price is required.";
  }

  if (Object.keys(errors).length > 0) {
    throw { message: "Form validation error", errors };
  }

  return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { additionalImages, ...spotFormData } = spotData;

      const formErrors = validateForm(spotFormData);
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        throw new Error("Form validation error");
      }

      const spotResponse = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...spotFormData,
          previewImage: spotFormData.previewImage,
          additionalImages: additionalImages.filter((image) => image !== ""),
        }),
      });

      if (!spotResponse.ok) {
        const errorData = await spotResponse.json();
        throw new Error(`Error creating spot: ${errorData.message}`);
      }

      navigate("/");
    } catch (error) {
      if (error.message === "Form validation error" && error.errors) {
        // Set errors based on the validation errors
        setErrors(error.errors);
      } else {
        console.error("Unexpected error:", error);
        setErrors({ unexpected: "Unexpected error. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

const handleChange = (e) => {
  const { name, value } = e.target;
  setSpotData((prevData) => ({
    ...prevData,
    [name]: value,
  }));

  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: value.trim() ? undefined : `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
    unexpected: undefined,
  }));
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
      <div className="heading"></div>
       <div className="locationDetails">
        <h2>Create a new Spot</h2>
        <h3>Where&rsquo;s your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation.</p>

        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          value={spotData.country}
          placeholder="Country"
          onChange={handleChange}
        />
        {errors.country && <p style={{ color: "red" }}>{errors.country}</p>}

        <label htmlFor="address">Street Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={spotData.address}
          placeholder="Street Address"
          onChange={handleChange}
        />
        {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}

        <div className="cityState">
          <div className="inputContainer">
            <label htmlFor="city" className="city">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={spotData.city}
              placeholder="City"
              onChange={handleChange}
            />
            {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
          </div>

          <div className="inputContainer">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={spotData.state}
              placeholder="State"
              onChange={handleChange}
            />
            {errors.state && <p style={{ color: "red" }}>{errors.state}</p>}
          </div>
        </div>
      </div>

      <div className="description">
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
        </p>

        <div className="descBox">
          <textarea
            id="description"
            name="description"
            value={spotData.description}
            placeholder="Please write at least 30 characters"
            onChange={handleChange}
          ></textarea>
          {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}
        </div>
      </div>

      <div className="title">
        <h2>Create a title for your spot</h2>
        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>

        <input
          type="text"
          id="name"
          name="name"
          value={spotData.name}
          placeholder="Name of your spot"
          onChange={handleChange}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </div>

      <div className="prices">
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>

        ${" "}
        <input
          type="text"
          id="price"
          name="price"
          value={spotData.price}
          placeholder="Price per night (USD)"
          onChange={handleChange}
        />
        {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
      </div>

      {/* Image Upload */}
      <div className="imageUpload">
        <div className="previewImage">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>

          <input
            type="text"
            id="previewImage"
            name="previewImage"
            value={spotData.previewImage}
            placeholder="Preview Image URL"
            onChange={handleChange}
          />

          {spotData.previewImage && (
            <div>
              <h4>Preview Image:</h4>
              <img src={spotData.previewImage} alt="Preview" />
            </div>
          )}
        </div>

        {/* Additional Images */}
        {spotData.additionalImages.map((image, index) => (
          <div key={index} className="addImages">
            <input
              type="text"
              value={image}
              placeholder="Image URL"
              onChange={(e) => handleAdditionalImageChange(index, e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveImageField(index)} className="removeButton">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddImageField} className="addButton">
          Add Image
        </button>
      </div>

      <div className="centered-button-container">
        {loading && <p>Creating spot...</p>}
        {errors.unexpected && <p style={{ color: "red" }}>{errors.unexpected}</p>}

        <button type="submit" className="submit">
          Create Spot
        </button>
      </div>
    </form>
  );
}

export default CreateSpot;
