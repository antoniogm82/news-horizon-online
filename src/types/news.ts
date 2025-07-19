export interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  created_at: string;
  author_id: string | null;
  featured: boolean | null;
  reading_time: number | null;
  published: boolean | null;
  published_at: string | null;
  slug: string;
  is_hero_pinned?: boolean | null;
}

export const categories = [
  { id: 'all', name: 'Todas', color: 'bg-primary' },
  { id: 'tecnologia', name: 'Tecnología', color: 'bg-blue-500' },
  { id: 'educacion', name: 'Educación', color: 'bg-purple-500' },
  { id: 'innovacion', name: 'Innovación', color: 'bg-green-500' },
  { id: 'tendencias', name: 'Tendencias', color: 'bg-orange-500' },
  { id: 'reviews', name: 'Reviews', color: 'bg-yellow-500' },
  { id: 'general', name: 'General', color: 'bg-gray-500' },
];