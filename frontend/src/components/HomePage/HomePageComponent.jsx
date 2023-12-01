import { useState, useEffect } from 'react';

function HomePage() {
  const [spots, setSpots] = useState([]);

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
          setSpots(data.Spots);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
    };

    fetchSpots()
  }, []);

  console.log(spots, 'spots')
    return (
    <div>
      <h1>Home Page</h1>
      <div className="spot-tile-list">
        {spots.map((spot) => (
          <div key={spot.id} className="spot-tile">
            {/* Thumbnail image */}
            <img src={spot.thumbnailUrl} alt={`Thumbnail for ${spot.city}, ${spot.state}`} />

            {/* City and State */}
            <p>{spot.city}, {spot.state}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage;
