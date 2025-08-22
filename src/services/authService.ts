import { supabase } from '@/lib/supabase'

export class AuthService {
  // Sign up the couple (you'll run this once to create the account)
  static async signUpCouple(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      console.error('Error signing up:', error)
      throw error
    }
    
    return data
  }

  // Sign in the couple
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Error signing in:', error)
      throw error
    }
    
    return data
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Get current user
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Check if user is authenticated
  static async isAuthenticated() {
    const user = await this.getCurrentUser()
    return !!user
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}
