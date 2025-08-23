import { supabase } from '@/integrations/supabase/client'
import type { WishlistItem, Gift } from '@/contexts/RegistryContext'

export class SupabaseService {
  // Wishlist Items
  static async getWishlistItems(): Promise<WishlistItem[]> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching wishlist items:', error)
      throw error
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      url: item.url,
      store: item.store,
      price: item.price,
      image: item.image_url,
      status: (item.status as 'available' | 'purchased' | 'reserved') || 'available',
      purchasedBy: item.purchased_by,
      purchaseDate: item.purchase_date
    }))
  }

  static async addWishlistItem(item: Omit<WishlistItem, 'id' | 'status'>): Promise<WishlistItem> {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        title: item.title,
        description: item.description,
        url: item.url,
        store: item.store,
        price: item.price,
        image_url: item.image,
        status: 'available'
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding wishlist item:', error)
      throw error
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      url: data.url,
      store: data.store,
      price: data.price,
      image: data.image_url,
      status: (data.status as 'available' | 'purchased' | 'reserved') || 'available',
      purchasedBy: data.purchased_by,
      purchaseDate: data.purchase_date
    }
  }

  static async removeWishlistItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error removing wishlist item:', error)
      throw error
    }
  }

  static async purchaseItem(itemId: string, guestName: string, from: string): Promise<void> {
    const { error } = await supabase
      .from('wishlist_items')
      .update({
        status: 'purchased',
        purchased_by: from,
        purchase_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)

    if (error) {
      console.error('Error purchasing item:', error)
      throw error
    }
  }

  // Gifts
  static async getGifts(): Promise<Gift[]> {
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching gifts:', error)
      throw error
    }

    return data.map(gift => ({
      id: gift.id,
      type: gift.type as 'item' | 'cash',
      itemId: gift.item_id,
      itemTitle: gift.item_title,
      amount: gift.amount,
      guestName: gift.guest_name,
      message: gift.message,
      from: gift.from_name,
      date: gift.date,
      transactionId: gift.transaction_id
    }))
  }

  static async addGift(gift: Omit<Gift, 'id'>): Promise<Gift> {
    const { data, error } = await supabase
      .from('gifts')
      .insert({
        type: gift.type,
        item_id: gift.itemId,
        item_title: gift.itemTitle,
        amount: gift.amount,
        guest_name: gift.guestName,
        message: gift.message,
        from_name: gift.from,
        date: gift.date,
        transaction_id: gift.transactionId
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding gift:', error)
      throw error
    }

    return {
      id: data.id,
      type: data.type as 'item' | 'cash',
      itemId: data.item_id,
      itemTitle: data.item_title,
      amount: data.amount,
      guestName: data.guest_name,
      message: data.message,
      from: data.from_name,
      date: data.date,
      transactionId: data.transaction_id
    }
  }
}