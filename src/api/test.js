import axios from 'axios';




const api = '/src/json';


export const search = params => axios.get(`${api}/searchData.json`,params);
