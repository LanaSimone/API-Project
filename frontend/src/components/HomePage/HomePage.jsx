import { useState, useEffect } from 'react';
ip
import './HomePage.css';

function HomePage() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const response = await fetch('/api/spots');
        if (!response.ok) {
          throw new Error('Failed to fetch spot data');
        }
        const data = await response.json();

        // Check if 'Spots' property exists and is an array
        if (data && data.Spots && Array.isArray(data.Spots)) {
          setSpots(data.Spots);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching spot data:', error);
      }
    };

    fetchSpotData();
  }, []);

  // Manually insert image URLs for each spot
  const spotsWithImages = spots.map((spot) => ({
    ...spot,
    imageUrl: `/images/spot-${spot.id}.jpg`,
  }));

  return (
    <div>
      <h1>Home Page</h1>
      <div className="spot-tile-list">
        {spotsWithImages.map((spot) => (
          <div key={spot.id} className="spot-tile">
            {/* Thumbnail image */}
            <img src={`../../images/spot-${spot.id}.jpg`} alt={`Thumbnail for ${spot.name}`} />

            {/* Name and Price */}
            <p>{spot.name}, {spot.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
