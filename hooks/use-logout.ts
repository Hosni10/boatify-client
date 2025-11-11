"use client"

import { useToast } from "@/hooks/use-toast"
import { logout } from "@/lib/auth"

/**
 * Hook to get logout function with toast notification
 */
export function useLogout() {
  const { toast } = useToast()

  const handleLogout = async () => {
    toast({
      title: "Logging out...",
      description: "You have been successfully logged out.",
    })
    
    // Small delay to show the toast before redirecting
    setTimeout(async () => {
      await logout()
    }, 500)
  }

  return { handleLogout }
}








