interface ProductInfo {
  title: string;
  description: string;
  price: string;
  image?: string;
  store: string;
}

interface ScrapingResult {
  success: boolean;
  data?: ProductInfo;
  error?: string;
}

class ProductScrapingService {
  private static readonly CORS_PROXIES = [
    'https://api.allorigins.win/get?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://thingproxy.freeboard.io/fetch/'
  ];
  
  // Store patterns for different e-commerce sites
  private static readonly STORE_PATTERNS = {
    'amazon.': 'Amazon',
    'flipkart.': 'Flipkart',
    'myntra.': 'Myntra',
    'nykaa.': 'Nykaa',
    'ajio.': 'Ajio',
    'snapdeal.': 'Snapdeal',
    'tatacliq.': 'Tata CLiQ',
    'bigbasket.': 'BigBasket',
    'paytmmall.': 'Paytm Mall',
    'shopclues.': 'ShopClues',
    'limeroad.': 'LimeRoad',
    'jabong.': 'Jabong',
    'firstcry.': 'FirstCry',
    'pepperfry.': 'Pepperfry',
    'urbanladder.': 'Urban Ladder',
    'fabindia.': 'Fabindia',
    'zara.': 'Zara',
    'hm.': 'H&M',
    'uniqlo.': 'Uniqlo'
  };

  private static getStoreFromUrl(url: string): string {
    const lowercaseUrl = url.toLowerCase();
    for (const [pattern, storeName] of Object.entries(this.STORE_PATTERNS)) {
      if (lowercaseUrl.includes(pattern)) {
        return storeName;
      }
    }
    
    // Extract domain name as fallback
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    } catch {
      return 'Unknown Store';
    }
  }

  private static extractMetaProperty(html: string, property: string): string {
    // Try different meta tag formats
    const patterns = [
      new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*?)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*?)["'][^>]*property=["']${property}["']`, 'i'),
      new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*?)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*?)["'][^>]*name=["']${property}["']`, 'i')
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return this.decodeHtmlEntities(match[1].trim());
      }
    }
    
    return '';
  }

  private static extractTitle(html: string): string {
    // Try Open Graph title first
    let title = this.extractMetaProperty(html, 'og:title');
    if (title) return title;

    // Try Twitter title
    title = this.extractMetaProperty(html, 'twitter:title');
    if (title) return title;

    // Try regular title tag
    const titleMatch = html.match(/<title[^>]*>([^<]*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return this.decodeHtmlEntities(titleMatch[1].trim());
    }

    return '';
  }

  private static extractDescription(html: string): string {
    // Try Open Graph description
    let description = this.extractMetaProperty(html, 'og:description');
    if (description) return description;

    // Try Twitter description
    description = this.extractMetaProperty(html, 'twitter:description');
    if (description) return description;

    // Try regular meta description
    description = this.extractMetaProperty(html, 'description');
    if (description) return description;

    return '';
  }

  private static extractPrice(html: string): string {
    // Common price patterns for Indian e-commerce sites
    const pricePatterns = [
      /₹[\s]*([0-9,]+(?:\.[0-9]{2})?)/g,
      /INR[\s]*([0-9,]+(?:\.[0-9]{2})?)/g,
      /Rs\.?[\s]*([0-9,]+(?:\.[0-9]{2})?)/g,
      /"price"[^0-9]*([0-9,]+(?:\.[0-9]{2})?)/gi,
      /"amount"[^0-9]*([0-9,]+(?:\.[0-9]{2})?)/gi,
      /price[^0-9]*₹[\s]*([0-9,]+(?:\.[0-9]{2})?)/gi
    ];

    const prices: number[] = [];
    
    for (const pattern of pricePatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const priceStr = match[1].replace(/,/g, '');
        const price = parseFloat(priceStr);
        if (!isNaN(price) && price > 0) {
          prices.push(price);
        }
      }
    }

    if (prices.length > 0) {
      // Return the most common price or the median price
      const sortedPrices = prices.sort((a, b) => a - b);
      const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];
      return `₹${medianPrice.toLocaleString('en-IN')}`;
    }

    return '';
  }

  private static extractImage(html: string): string {
    // Try Open Graph image
    let image = this.extractMetaProperty(html, 'og:image');
    if (image && this.isValidImageUrl(image)) return image;

    // Try Twitter image
    image = this.extractMetaProperty(html, 'twitter:image');
    if (image && this.isValidImageUrl(image)) return image;

    return '';
  }

  private static isValidImageUrl(url: string): boolean {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('image') || 
           lowerUrl.includes('photo');
  }

  private static decodeHtmlEntities(text: string): string {
    const htmlEntities: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™'
    };

    return text.replace(/&[^;]+;/g, (entity) => {
      return htmlEntities[entity] || entity;
    });
  }

  private static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]/g, ' ')
      .trim();
  }

  public static async scrapeProductInfo(url: string): Promise<ScrapingResult> {
    try {
      // Validate URL
      if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        return {
          success: false,
          error: 'Invalid URL format. Please provide a valid product URL.'
        };
      }

      // Try multiple approaches to fetch the page
      let html = '';
      let lastError = '';

      // First, try direct fetch (works for some sites)
      try {
        const directResponse = await fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        if (directResponse.ok) {
          html = await directResponse.text();
        }
      } catch (directError) {
        console.log('Direct fetch failed, trying proxies...');
      }

      // If direct fetch fails, try CORS proxies
      if (!html) {
        for (const proxy of this.CORS_PROXIES) {
          try {
            const proxyUrl = proxy + encodeURIComponent(url);
            const response = await fetch(proxyUrl, {
              method: 'GET',
              headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
            });

            if (response.ok) {
              const data = await response.json();
              if (data.contents || data.responseText) {
                html = data.contents || data.responseText;
                break;
              }
            }
          } catch (proxyError) {
            lastError = proxyError instanceof Error ? proxyError.message : 'Unknown proxy error';
            console.log(`Proxy ${proxy} failed:`, lastError);
            continue;
          }
        }
      }

      // If all fetching methods fail, try to extract basic info from URL
      if (!html) {
        return this.extractFromUrlFallback(url, lastError);
      }

      // Extract product information
      const title = this.extractTitle(html);
      const description = this.extractDescription(html);
      const price = this.extractPrice(html);
      const image = this.extractImage(html);
      const store = this.getStoreFromUrl(url);

      // Validate extracted data
      if (!title) {
        return {
          success: false,
          error: 'Could not extract product title from the URL. Please check if the URL is a valid product page.'
        };
      }

      const productInfo: ProductInfo = {
        title: this.cleanText(title),
        description: description ? this.cleanText(description) : `Product from ${store}`,
        price: price || 'Price not available',
        image: image || undefined,
        store: store
      };

      return {
        success: true,
        data: productInfo
      };

    } catch (error) {
      console.error('Error scraping product info:', error);
      return this.extractFromUrlFallback(url, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private static extractFromUrlFallback(url: string, errorMessage: string): ScrapingResult {
    const store = this.getStoreFromUrl(url);
    
    // Try to extract basic info from URL structure
    let titleFromUrl = '';
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      
      // Look for product names in URL path
      for (const part of pathParts) {
        if (part.length > 3 && !part.match(/^[0-9]+$/) && part !== 'dp' && part !== 'product') {
          titleFromUrl = part.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          break;
        }
      }
    } catch (urlError) {
      console.log('URL parsing failed:', urlError);
    }

    return {
      success: false,
      error: `Unable to automatically extract product details. The website may have blocked automated access or the URL might not be a direct product page. You can still manually fill in the details below.`,
      data: {
        title: titleFromUrl || '',
        description: titleFromUrl ? `${titleFromUrl} from ${store}` : `Product from ${store}`,
        price: '',
        store: store
      }
    };
  }

  // Simple method that always provides some useful information
  public static async getBasicProductInfo(url: string): Promise<ScrapingResult> {
    const store = this.getStoreFromUrl(url);
    
    // Extract what we can from the URL itself
    let titleFromUrl = '';
    let descriptionFromUrl = '';
    
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      const searchParams = urlObj.searchParams;
      
      // Look for product names in URL path or query parameters
      for (const part of pathParts) {
        if (part.length > 3 && !part.match(/^[0-9]+$/) && 
            !['dp', 'product', 'item', 'p', 'products', 'catalog'].includes(part.toLowerCase())) {
          titleFromUrl = part
            .replace(/[-_+%20]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim();
          break;
        }
      }
      
      // Try to get title from search parameters
      if (!titleFromUrl) {
        const titleParams = ['title', 'name', 'product', 'item'];
        for (const param of titleParams) {
          const paramValue = searchParams.get(param);
          if (paramValue && paramValue.length > 3) {
            titleFromUrl = decodeURIComponent(paramValue)
              .replace(/[-_+]/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase())
              .trim();
            break;
          }
        }
      }
      
      // Create a basic description
      if (titleFromUrl) {
        descriptionFromUrl = `${titleFromUrl} available at ${store}. Please verify details on the product page.`;
      } else {
        descriptionFromUrl = `Product available at ${store}. Please add details manually.`;
      }
      
    } catch (urlError) {
      console.log('URL parsing error:', urlError);
      descriptionFromUrl = `Product from ${store}`;
    }

    return {
      success: titleFromUrl ? true : false,
      data: {
        title: titleFromUrl || '',
        description: descriptionFromUrl,
        price: '',
        store: store
      },
      error: titleFromUrl ? undefined : `Could not extract product details automatically. The store has been detected as "${store}". Please fill in the product details manually.`
    };
  }

  // Alternative method using a free API service for better results
  public static async scrapeWithAPI(url: string): Promise<ScrapingResult> {
    try {
      // First try the main scraping method
      const result = await this.scrapeProductInfo(url);
      
      // If it fails, fall back to basic info extraction
      if (!result.success) {
        return await this.getBasicProductInfo(url);
      }
      
      return result;
    } catch (error) {
      // Final fallback to basic info
      return await this.getBasicProductInfo(url);
    }
  }
}

export default ProductScrapingService;
