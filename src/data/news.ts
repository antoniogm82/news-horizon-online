export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  featured: boolean;
  trending: boolean;
  readTime: string;
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "El nuevo iPhone 15 Pro revoluciona la fotografía móvil con IA",
    excerpt: "Apple introduce funciones de inteligencia artificial que transforman completamente la experiencia fotográfica en smartphones.",
    content: "La nueva generación de iPhone lleva la fotografía móvil a un nivel completamente nuevo...",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
    category: "smartphones",
    date: "2024-01-15",
    author: "María García",
    featured: true,
    trending: true,
    readTime: "5 min"
  },
  {
    id: 2,
    title: "ChatGPT-5 promete cambiar para siempre la forma de trabajar",
    excerpt: "OpenAI anuncia la próxima versión de su modelo de lenguaje con capacidades multimodales avanzadas.",
    content: "La nueva versión de ChatGPT incluye mejoras significativas en razonamiento...",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    category: "ai",
    date: "2024-01-14",
    author: "Carlos Rodríguez",
    featured: true,
    trending: true,
    readTime: "7 min"
  },
  {
    id: 3,
    title: "Samsung Galaxy S24 Ultra: El smartphone más potente del año",
    excerpt: "Con un procesador Snapdragon 8 Gen 3 y una pantalla de 200Hz, Samsung establece nuevos estándares.",
    content: "El nuevo buque insignia de Samsung viene cargado de innovaciones...",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
    category: "smartphones",
    date: "2024-01-13",
    author: "Ana Martínez",
    featured: true,
    trending: false,
    readTime: "6 min"
  },
  {
    id: 4,
    title: "Meta Quest 3 redefine la realidad virtual con nuevas funciones",
    excerpt: "El nuevo headset de Meta incluye realidad mixta y un procesador más potente para experiencias inmersivas.",
    content: "La tercera generación de Quest lleva la VR a un nuevo nivel...",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&h=600&fit=crop",
    category: "gadgets",
    date: "2024-01-12",
    author: "Luis Torres",
    featured: true,
    trending: true,
    readTime: "8 min"
  },
  {
    id: 5,
    title: "Google Gemini supera a GPT-4 en nuevos benchmarks",
    excerpt: "El modelo de IA de Google demuestra capacidades superiores en razonamiento y comprensión multimodal.",
    content: "Los nuevos resultados posicionan a Gemini como el modelo más avanzado...",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=600&fit=crop",
    category: "ai",
    date: "2024-01-11",
    author: "Diego Fernández",
    featured: false,
    trending: true,
    readTime: "4 min"
  },
  {
    id: 6,
    title: "Windows 12 filtrado: Nueva interfaz y funciones de IA integradas",
    excerpt: "Microsoft trabaja en una nueva versión de Windows con inteligencia artificial nativa y diseño renovado.",
    content: "Las primeras imágenes filtradas muestran cambios significativos...",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&h=600&fit=crop",
    category: "software",
    date: "2024-01-10",
    author: "Laura Sánchez",
    featured: false,
    trending: true,
    readTime: "5 min"
  },
  {
    id: 7,
    title: "PlayStation 5 Pro: Más potencia para gaming en 4K 120fps",
    excerpt: "Sony prepara una versión mejorada de su consola con soporte para ray tracing avanzado.",
    content: "La nueva versión Pro incluye mejoras significativas en rendimiento...",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop",
    category: "videojuegos",
    date: "2024-01-09",
    author: "Roberto Jiménez",
    featured: false,
    trending: false,
    readTime: "6 min"
  },
  {
    id: 8,
    title: "Apple Watch Series 10: Monitoreo avanzado de salud",
    excerpt: "El nuevo smartwatch de Apple incluye sensores para detectar diabetes y presión arterial.",
    content: "Las nuevas funciones de salud convierten al Apple Watch en un dispositivo médico...",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=600&fit=crop",
    category: "gadgets",
    date: "2024-01-08",
    author: "Carmen López",
    featured: false,
    trending: true,
    readTime: "4 min"
  },
  {
    id: 9,
    title: "Tesla actualiza su software con conducción autónoma completa",
    excerpt: "La nueva versión FSD Beta permite conducción sin intervención humana en la mayoría de escenarios.",
    content: "El sistema de conducción autónoma de Tesla alcanza nuevos niveles de autonomía...",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop",
    category: "software",
    date: "2024-01-07",
    author: "Miguel Ruiz",
    featured: false,
    trending: false,
    readTime: "7 min"
  },
  {
    id: 10,
    title: "Nintendo Switch 2: Filtradas especificaciones y fecha de lanzamiento",
    excerpt: "La nueva consola de Nintendo llegará en 2024 con soporte para 4K y procesador NVIDIA más potente.",
    content: "Las especificaciones filtradas prometen un salto generacional significativo...",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    category: "videojuegos",
    date: "2024-01-06",
    author: "Elena Morales",
    featured: false,
    trending: true,
    readTime: "5 min"
  }
];

export const categories = [
  { id: 'all', name: 'Todas', color: 'bg-primary' },
  { id: 'smartphones', name: 'Smartphones', color: 'bg-blue-500' },
  { id: 'ai', name: 'IA', color: 'bg-purple-500' },
  { id: 'gadgets', name: 'Gadgets', color: 'bg-green-500' },
  { id: 'software', name: 'Software', color: 'bg-orange-500' },
  { id: 'videojuegos', name: 'Videojuegos', color: 'bg-red-500' },
  { id: 'reviews', name: 'Reviews', color: 'bg-yellow-500' },
];

export const getFeaturedNews = () => newsData.filter(item => item.featured);
export const getTrendingNews = () => newsData.filter(item => item.trending).slice(0, 5);
export const getNewsByCategory = (category: string) => {
  if (category === 'all') return newsData;
  return newsData.filter(item => item.category === category);
};
export const searchNews = (query: string) => {
  if (!query) return newsData;
  return newsData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );
};