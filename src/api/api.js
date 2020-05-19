import axios from 'axios';




const api = '/wapapi';

export const search = params => axios.post(`${api}/search/items`,params);