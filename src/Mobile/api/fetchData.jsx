export const fetchData = async () => {
  const url = "/create_json/output_data/processed_data.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch local JSON:", error);
    throw error;
  }
};
