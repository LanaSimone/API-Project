import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './HomePage.css'

function HomePage() {
  const [spots, setSpots] = useState([]);
    // const [spots, setSpots] = useState([]);
  const navigate = useNavigate()  // Create a history object

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch('/api/spots');
        if (!response.ok) {
          throw new Error('Failed to fetch spots');
        }
        const data = await response.json();

        // Check if 'Spots' property exists and is an array
        if (data && data.Spots && Array.isArray(data.Spots)) {
          // Map over the spots and format the previewImage
          const formattedSpots = data.Spots.map((spot) => ({
            ...spot,
            // Assuming that base64 data is sent as an object
            previewImage: `${spot.previewImage}`,
          }));

          setSpots(formattedSpots);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
    };

    fetchSpots();
  }, []);

  const handleSpotClick = (spotId) => {
    // Navigate to the SpotDetails component when a spot tile is clicked
     navigate(`/details/${spotId}`);
  };

  return (
  <div className='homePage'>
    <ul className='homePageSpotList'>
      {spots.map((spot) => (
        <li key={spot.id} className="spotListItem" onClick={() => handleSpotClick(spot.id)}>
          <div className="spotDetails">
            <img src={spot.previewImage} alt={spot.name} className="spotImage" title={spot.name} />
            <div className="textDetails">
              <div>
                <p className="location">{`${spot.city}, ${spot.state}`}</p>
                <p className="price">{`$ ${spot.price}`}/night</p>
              </div>
              <p className="avgRating">{`${spot.avgRating}`}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
}

export default HomePage;
