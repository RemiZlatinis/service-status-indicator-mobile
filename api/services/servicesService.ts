import { Service } from "../../models";
import apiClient from "../client";

interface GetServicesResponse {
  [key: string]: "ok" | "update" | "warning" | "failure"
}

export async function getServices(): Promise<Service[]> {
  const { data } = await apiClient.get<GetServicesResponse>('services')
  return Object.entries(data).map(([label, status]) => ({
    label,
    status,
  }));
}