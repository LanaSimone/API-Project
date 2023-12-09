import { useState } from "react";
import './CreateSpot.css'

function CreateSpot() {
  const [spotData, setSpotData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    name: '',
    description: '',
    price: '',
    previewImages: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const previewImageBase64Array = await Promise.allSettled(
        imageFiles.map(async (file) => await convertImageToBase64(file))
      ).then((results) =>
        results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
      );

      setSpotData((prevData) => ({
        ...prevData,
        previewImages: previewImageBase64Array,
      }));

      const response = await fetch('/your-backend-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spotData),
      });

      if (response.ok) {
        console.log('Spot created successfully!');
        setSpotData({
          address: '',
          city: '',
          state: '',
          country: '',
          lat: '',
          lng: '',
          name: '',
          description: '',
          price: '',
          previewImages: [],
        });
      } else {
        const errorData = await response.json();
        setError(`Error creating spot: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Unexpected error creating spot:', error);
      setError('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpotData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
        type="number"
        id="price"
        name="price"
        value={spotData.price}
        onChange={handleChange}
    />

  {/* Image Upload */}
  <label>
    Upload Preview Images:
    <input
      type='text'
      onChange={handleImageChange}
      multiple
              />
              <input
      type='text'
      onChange={handleImageChange}
      multiple
    /><input
      type='text'
      onChange={handleImageChange}
      multiple
    /><input
      type='text'
      onChange={handleImageChange}
      multiple
    /><input
      type='text'
      onChange={handleImageChange}
      multiple
    />
  </label>

  {spotData.previewImages.length > 0 && (
    <>
      <h4>Preview Images:</h4>
      {spotData.previewImages.map((image, index) => (
        <img key={index} src={image} alt={`Preview ${index + 1}`} />
      ))}
    </>
  )}

  {loading && <p>Creating spot...</p>}
  {error && <p style={{ color: 'red' }}>{error}</p>}

  <button type="submit">Create Spot</button>
</form>
  );
}

export default CreateSpot;
