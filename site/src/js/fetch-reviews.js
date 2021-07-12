import { asyncFetchJSON } from './utils';

// https://rapidapi.com/apidojo/api/travel-advisor/specs

const HOST = 'travel-advisor.p.rapidapi.com';
const LOC_ID = 13389672;
const API_URL = `https://${HOST}/reviews/list?location_id=${LOC_ID}&limit=10&currency=RUB&lang=ru`;

const RAPID_API = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
    'x-rapidapi-host': HOST
  }
}

export const getLatestReviews = async () => {
  const json = await asyncFetchJSON(API_URL, RAPID_API);

  return json;
};
