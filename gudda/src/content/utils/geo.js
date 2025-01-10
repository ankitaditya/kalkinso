export const getPlace = async (lat, lon, pin=false) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.display_name) {
      if(pin){
        return {address:data.display_name, pincode:data.address.postcode};
      }
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