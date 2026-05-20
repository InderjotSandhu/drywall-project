export interface Project {
  id: number | string;
  image: string;
  imageAlt?: string;
  images?: string[];
  videos?: string[];
  category: string;
  title: string;
  location?: string;
  description: string;
  stats?: { label: string; value: string }[];
}
