export type Gender = "men" | "women" | "unisex";

export interface Product {
  id: string;
  externalId: string;
  provider: string;
  brand: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  gender: Gender;
  price: number;
  currency: string;
  originalPrice?: number;
  discount?: number;
  colors: string[];
  sizes: string[];
  images: string[];
  thumbnail: string;
  productUrl: string;
  retailerName: string;
  affiliateUrl?: string;
  availability: boolean;
  rating: number;
  popularity: number;
  tags: string[];
  style?: string[];
  occasion?: string[];
  season?: string[];
  fit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  query?: string;
  category?: string;
  gender?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  minRating?: number;
  sort?: "price-asc" | "price-desc" | "popular" | "newest" | "rating";
}

export interface ProductProvider {
  name: string;
  searchProducts(query: string, filters?: ProductFilters): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

export interface VirtualTryOnResult {
  id: string;
  status: "processing" | "completed" | "failed";
  resultImage: string | null;
  products: Product[];
  message?: string;
}

export interface VirtualTryOnProvider {
  name: string;
  generateTryOn(userImage: string, products: Product[]): Promise<VirtualTryOnResult>;
}
