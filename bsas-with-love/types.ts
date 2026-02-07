export type Day = {
  id: string;
  date: string;
  day_title: string;
  activities: string;
  transport?: string;
  mood?: string;
  theme_color?: string;
  hero_image_url?: string;
};

export type Place = {
  id: string;
  day_id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  sort_order?: number;
};
