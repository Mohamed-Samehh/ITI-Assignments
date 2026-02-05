export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  stock: number;
  rating: number;
  description: string;
  category: string;
  brand: string;
}
