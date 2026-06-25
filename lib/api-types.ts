export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export interface ProjectResponse {
  id: number;
  image: string;
  imageAlt?: string;
  images: string[];
  videos: string[];
  category: string;
  title: string;
  location?: string;
  description: string;
  stats: { label: string; value: string }[];
}

export interface ServiceResponse {
  id: string;
  title: string;
  desc: string;
  detail: string;
  tags: string[];
  features: { title: string; desc: string }[];
}

export interface StatsResponse {
  count: number;
  suffix: string;
  label: string;
}
