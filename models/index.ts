export interface Settings {
  url: string;
  token: string;
}

export interface Service {
  label: string;
  status: "ok" | "update" | "warning" | "failure"
}