import axios from 'axios';

const BASE_URL = 'http://api.alquran.cloud/v1/ayah';

export const getAyah = async (reference: string, edition: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${reference}/${edition}`);
    return response.data.data.audio;
  }
  catch (error) {
    console.error('AYAH GET FAiLED', error);
  }
};