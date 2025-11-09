/**
 * Logout function that clears user session and redirects to login
 */
export async function logout() {
  try {
    // Call logout API endpoint (optional, but good practice)
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(() => {
      // Ignore errors if API call fails
      // The logout should still work even if the API is unavailable
    })

    // Clear localStorage
    localStorage.removeItem("user")

    // Redirect to login page
    window.location.href = "/login"
  } catch (error) {
    console.error("Logout error:", error)
    // Even if there's an error, clear localStorage and redirect
    localStorage.removeItem("user")
    window.location.href = "/login"
  }
}

