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
          console.log('Fetched spots data:', data.Spots);
          setSpots(data.Spots);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
    };

    fetchSpots();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <ul>
          {spots.map((spot) => (
            <li key={spot.id}>
              <div>
                {/* Log the image URL to the console for debugging */}
                {console.log('Image URL:', spot.previewImage)}
                <img src={spot.previewImage} alt={`Thumbnail for ${spot.name}`} />
              </div>
              <div>
                <h3>{spot.name}</h3>
                <p>{spot.description}</p>
                {/* Add more details as needed */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
