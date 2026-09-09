export type TabType = "overview" | "users" | "settings";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended" | "pending";
}

export interface StatCardData {
  title: string;
  value: string | number;
  change: string;
  changePositive: boolean;
  chartData: { value: number }[];
  chartType: "area" | "bar";
  chartColor: string;
}
