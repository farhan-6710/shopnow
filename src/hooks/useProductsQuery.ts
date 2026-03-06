import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { API_URL } from "@/constants/api";
import { axiosInstance } from "@/services/axiosInstance";

const fetchProductsApi = async (): Promise<Product[]> => {
  const response = await axiosInstance.get(API_URL.PRODUCTS.url);
  const data = response.data;
  if (!data.success) throw new Error(data.error || "Failed to fetch products");
  return data.data;
};

export const useProductsQuery = () => {
  const { data, isLoading, isFetching, error, refetch } = useQuery<
    Product[],
    Error
  >({
    queryKey: ["products"],
    queryFn: fetchProductsApi,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  return {
    products: data || [],
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
