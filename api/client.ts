import axios from 'axios';

import { get } from '../utils/settingsStorage';

const apiClient = axios.create();

async function update() {
  apiClient.defaults.baseURL = await get("url") || undefined;
  apiClient.defaults.headers.common['Authorization'] = `Token ${await get("token")}`;
}

update()

export default apiClient;
