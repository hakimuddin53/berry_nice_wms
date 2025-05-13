import { ProductDetailsDto } from "interfaces/v12/product/productDetails/productDetailsDto";
import { useCallback, useState } from "react";
import axios from "utils/axios";

export const useProductDetails = () => {
  const [productCache, setProductCache] = useState<
    Record<string, ProductDetailsDto>
  >({});

  const fetchProductDetails = useCallback(
    async (productId: string) => {
      if (productCache[productId]) {
        return productCache[productId];
      }

      try {
        const response = await axios.get<ProductDetailsDto>(
          `/product/${productId}`
        );
        const productDetails = response.data;
        setProductCache((prev) => ({ ...prev, [productId]: productDetails }));
        return productDetails;
      } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
      }
    },
    [productCache]
  );

  const getProductDetails = (productId: string) => {
    if (!productId) return null;
    fetchProductDetails(productId);
    return productCache[productId];
  };

  return { getProductDetails };
};
