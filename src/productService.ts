import productsData from "../products.json";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export const getProducts = async (): Promise<Product[]> => {
  return productsData;
};