export const calculateAvgRating = async (spotId) => {
  const response = await fetch(`/api/spots/${spotId}`);
  const data = await response.json();
  return data.avgStarRating || 0;
};
