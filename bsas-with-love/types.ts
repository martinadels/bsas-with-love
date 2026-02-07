export type Day = {
  id: string;
  date: string; // YYYY-MM-DD
  day_title: string;
  activities: string;
  transport?: string | null;
  mood?: string | null;
  theme_color?: string | null;
  hero_image_url?: string | null;
};

export type Place = {
  id: string;
  day_id: string;
  name: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  sort_order?: number | null;
};

export type Place = {
  id: string;
  day_id: string;
  name: string;
  lat: number | null;
  lng: number | null;
  note?: string;
  order_index?: number;
};
