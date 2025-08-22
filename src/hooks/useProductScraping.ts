import { useState } from 'react';
import ProductScrapingService from '@/services/productScrapingService';

interface ProductInfo {
  title: string;
  description: string;
  price: string;
  image?: string;
  store: string;
}

interface UseProductScrapingReturn {
  isLoading: boolean;
  error: string | null;
  productInfo: ProductInfo | null;
  scrapeProduct: (url: string) => Promise<void>;
  clearData: () => void;
}

export const useProductScraping = (): UseProductScrapingReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

  const scrapeProduct = async (url: string) => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProductInfo(null);

    try {
      // First try the enhanced scraping with API fallback
      const result = await ProductScrapingService.scrapeWithAPI(url);
      
      if (result.data) {
        setProductInfo(result.data);
        
        if (result.success) {
          setError(null);
        } else {
          // Show error but still populate available data
          setError(result.error || 'Partial information extracted. Please review and complete the details.');
        }
      } else {
        setError(result.error || 'Could not extract any product information from this URL');
      }
    } catch (err) {
      // Final fallback - try to get at least basic info
      try {
        const basicResult = await ProductScrapingService.getBasicProductInfo(url);
        if (basicResult.data) {
          setProductInfo(basicResult.data);
          setError('Could not fetch full product details, but store information has been detected. Please fill in the remaining details manually.');
        } else {
          setError('Unable to process this URL. Please check the URL and try again, or fill in the details manually.');
        }
      } catch (finalErr) {
        setError('Unable to process this URL. Please check the URL and try again, or fill in the details manually.');
        console.error('Final fallback failed:', finalErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setProductInfo(null);
    setError(null);
  };

  return {
    isLoading,
    error,
    productInfo,
    scrapeProduct,
    clearData
  };
};
