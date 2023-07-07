export const getDetail = async (
  lat: number,
  lng: number
): Promise<string | undefined> => {
  const apiKey = process.env.NEXT_PUBLIC_ENV_VARIABLE;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const detail = data?.results?.[0]?.formatted_address;
    return detail;
  } catch (error) {
    console.error("An error occurred while fetching location detail:", error);
    return undefined;
  }
};
