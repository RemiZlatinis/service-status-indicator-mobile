import apiClient from "./client"
import { Settings } from "../models";

export * from './services/servicesService'

export function updateAPISettings({ token, url }: Partial<Settings>) {
  if (url) apiClient.defaults.baseURL = url;
  if (token) apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
}