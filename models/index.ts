export interface Settings {
  url: string;
  token: string;
}

export type ServiceStatus = "ok" | "update" | "warning" | "failure"

export interface Service {
  id: string;
  label: string;
  status: ServiceStatus
  message: string | null
}
