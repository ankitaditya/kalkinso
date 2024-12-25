export const getPlace = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  console.log("url: ", url);
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    } else {
      return "Location Not found";
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    return "Error fetching location";
  }
}

export const getLatLon = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      () => reject("Unable to fetch location")
    );
  });
}