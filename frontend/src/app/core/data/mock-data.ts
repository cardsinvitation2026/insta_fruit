export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  unit: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Orange',
    price: 299.99,
    rating: 4.5,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80',
    unit: '1 kg',
    description:
      'Juicy, sun-ripened Valencia oranges packed with vitamin C and a refreshing sweet–tangy flavour. Hand-picked at peak ripeness from premium orchards for the perfect snack or fresh juice.',
  },
  {
    id: 2,
    name: 'Banana',
    price: 100.0,
    rating: 4.5,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    unit: '1 dozen',
    description:
      'Naturally sweet, creamy and rich in potassium. Our Cavendish bananas are sourced from sustainable farms and delivered at the perfect ripeness for instant snacking.',
  },
  {
    id: 3,
    name: 'Kiwi',
    price: 150.0,
    rating: 4.5,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=600&q=80',
    unit: '500 g',
    description:
      'Tangy, emerald-green kiwifruit bursting with vitamin C, fibre and antioxidants. Perfectly tart with a subtle tropical sweetness — ideal for smoothies, salads and desserts.',
  },
  {
    id: 4,
    name: 'Avocado',
    price: 599.99,
    rating: 4.5,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    unit: '2 pcs',
    description:
      'Buttery Hass avocados with rich, creamy flesh and a delicate nutty flavour. Loaded with healthy fats, perfect for toast, salads, guacamole and bowls.',
  },
  {
    id: 5,
    name: 'Strawberry',
    price: 349.99,
    rating: 4.7,
    category: 'Berries',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    unit: '250 g',
    description:
      'Plump, ruby-red strawberries with intense sweetness and a fresh fragrance. Hand-picked and rushed to your door within hours of harvest.',
  },
  {
    id: 6,
    name: 'Mango',
    price: 425.0,
    rating: 4.8,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642db?auto=format&fit=crop&w=600&q=80',
    unit: '1 kg',
    description:
      'King of fruits — golden Alphonso mangoes with silky flesh and a heavenly aroma. The taste of summer in every bite.',
  },
  {
    id: 7,
    name: 'Apple',
    price: 220.0,
    rating: 4.4,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80',
    unit: '1 kg',
    description:
      'Crisp and crunchy Fuji apples with a perfect balance of sweetness and tartness. Refreshing, hydrating and packed with fibre.',
  },
  {
    id: 8,
    name: 'Blueberry',
    price: 499.99,
    rating: 4.6,
    category: 'Berries',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
    unit: '200 g',
    description:
      'Antioxidant-rich, plump blueberries with a deep flavour and natural sweetness. A daily superfood for your smoothies and breakfast bowls.',
  },
];

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Fruits', icon: '🍎', color: '#FFE3E3' },
  { id: 2, name: 'Berries', icon: '🫐', color: '#E3E9FF' },
  { id: 3, name: 'Tropical', icon: '🥭', color: '#FFF1D6' },
  { id: 4, name: 'Citrus', icon: '🍊', color: '#FFEBD6' },
  { id: 5, name: 'Melons', icon: '🍉', color: '#FFE0E6' },
];
