import { Service } from "../../models";
import apiClient from "../client";


export async function getServices(): Promise<Service[]> {
  const { data } = await apiClient.get<Service[]>('services')
  return data
}