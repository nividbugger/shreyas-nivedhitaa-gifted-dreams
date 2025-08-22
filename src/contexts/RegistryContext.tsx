import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupabaseService } from '@/services/supabaseService';

export interface WishlistItem {
  id: string;
  title: string;
  description: string;
  url: string;
  store: string;
  price: string;
  image?: string;
  status: 'available' | 'purchased' | 'reserved';
  purchasedBy?: string;
  purchaseDate?: string;
}

export interface Gift {
  id: string;
  type: "item" | "cash";
  itemId?: string;
  itemTitle?: string;
  amount?: string;
  guestName: string;
  message: string;
  from: string;
  date: string;
  transactionId?: string;
}

interface RegistryContextType {
  wishlistItems: WishlistItem[];
  gifts: Gift[];
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'status'>) => void;
  removeWishlistItem: (id: string) => void;
  purchaseItem: (itemId: string, guestName: string, from: string, message: string) => void;
  addCashGift: (guestName: string, from: string, message: string, amount?: string, transactionId?: string) => void;
  getAvailableItems: () => WishlistItem[];
}

const RegistryContext = createContext<RegistryContextType | undefined>(undefined);

export const useRegistry = () => {
  const context = useContext(RegistryContext);
  if (context === undefined) {
    throw new Error('useRegistry must be used within a RegistryProvider');
  }
  return context;
};

interface RegistryProviderProps {
  children: ReactNode;
}

export const RegistryProvider: React.FC<RegistryProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [wishlistData, giftsData] = await Promise.all([
          SupabaseService.getWishlistItems(),
          SupabaseService.getGifts()
        ]);
        setWishlistItems(wishlistData);
        setGifts(giftsData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to local data if Supabase fails
        setWishlistItems([
          {
            id: "1",
            title: "Premium Coffee Maker",
            description: "Espresso machine for our morning coffee rituals together",
            url: "https://amazon.in/example",
            store: "Amazon",
            price: "₹25,000",
            status: "available"
          },
          {
            id: "2",
            title: "Silk Bedsheet Set",
            description: "Luxurious silk bedsheets for our new home",
            url: "https://flipkart.com/example",
            store: "Flipkart",
            price: "₹8,500",
            status: "purchased",
            purchasedBy: "Arjun & Meera",
            purchaseDate: "2024-01-14"
          },
          {
            id: "3",
            title: "Skincare Gift Set",
            description: "Premium skincare collection for the bride",
            url: "https://nykaa.com/example",
            store: "Nykaa",
            price: "₹12,000",
            status: "available"
          }
        ]);
        setGifts([
          {
            id: "1",
            type: "cash",
            amount: "₹5,000",
            guestName: "Priya & Family",
            message: "Wishing you both a lifetime of happiness!",
            from: "Priya, Raj, and Kids",
            date: "2024-01-15"
          },
          {
            id: "2",
            type: "item",
            itemId: "2",
            itemTitle: "Silk Bedsheet Set",
            guestName: "Arjun",
            message: "Hope you enjoy your cozy nights together!",
            from: "Arjun & Meera",
            date: "2024-01-14"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addWishlistItem = async (item: Omit<WishlistItem, 'id' | 'status'>) => {
    try {
      const newItem = await SupabaseService.addWishlistItem(item);
      setWishlistItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      // Fallback to local state
      const newItem: WishlistItem = {
        ...item,
        id: Date.now().toString(),
        status: "available"
      };
      setWishlistItems(prev => [...prev, newItem]);
    }
  };

  const removeWishlistItem = async (id: string) => {
    try {
      await SupabaseService.removeWishlistItem(id);
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing wishlist item:', error);
      // Still update local state even if Supabase fails
      setWishlistItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const purchaseItem = async (itemId: string, guestName: string, from: string, message: string) => {
    const item = wishlistItems.find(item => item.id === itemId);
    if (!item || item.status !== 'available') return;

    try {
      // Update item status in Supabase
      await SupabaseService.purchaseItem(itemId, guestName, from);
      
      // Add gift to Supabase
      const newGift: Omit<Gift, 'id'> = {
        type: "item",
        itemId,
        itemTitle: item.title,
        guestName,
        message,
        from,
        date: new Date().toISOString().split('T')[0]
      };
      const addedGift = await SupabaseService.addGift(newGift);

      // Update local state
      setWishlistItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: 'purchased' as const, 
              purchasedBy: from,
              purchaseDate: new Date().toISOString().split('T')[0]
            }
          : item
      ));
      setGifts(prev => [...prev, addedGift]);
    } catch (error) {
      console.error('Error purchasing item:', error);
      // Fallback to local state updates
      setWishlistItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: 'purchased' as const, 
              purchasedBy: from,
              purchaseDate: new Date().toISOString().split('T')[0]
            }
          : item
      ));

      const newGift: Gift = {
        id: Date.now().toString(),
        type: "item",
        itemId,
        itemTitle: item.title,
        guestName,
        message,
        from,
        date: new Date().toISOString().split('T')[0]
      };
      setGifts(prev => [...prev, newGift]);
    }
  };

  const addCashGift = async (guestName: string, from: string, message: string, amount: string = "Amount not specified", transactionId?: string) => {
    try {
      const newGift: Omit<Gift, 'id'> = {
        type: "cash",
        amount,
        guestName,
        message,
        from,
        date: new Date().toISOString().split('T')[0],
        transactionId
      };
      const addedGift = await SupabaseService.addGift(newGift);
      setGifts(prev => [...prev, addedGift]);
    } catch (error) {
      console.error('Error adding cash gift:', error);
      // Fallback to local state
      const newGift: Gift = {
        id: Date.now().toString(),
        type: "cash",
        amount,
        guestName,
        message,
        from,
        date: new Date().toISOString().split('T')[0],
        transactionId
      };
      setGifts(prev => [...prev, newGift]);
    }
  };

  const getAvailableItems = () => {
    return wishlistItems.filter(item => item.status === 'available');
  };

  return (
    <RegistryContext.Provider
      value={{
        wishlistItems,
        gifts,
        addWishlistItem,
        removeWishlistItem,
        purchaseItem,
        addCashGift,
        getAvailableItems,
      }}
    >
      {children}
    </RegistryContext.Provider>
  );
};
