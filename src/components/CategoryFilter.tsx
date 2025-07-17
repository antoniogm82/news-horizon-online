import { Button } from '@/components/ui/button';
import { categories } from '@/data/news';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="transition-all duration-200"
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${category.color}`} />
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;