"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CButton, CCard, CCardBody } from "@coreui/react"

export default function Logout() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  // Function to handle logout confirmation
  const handleConfirm = () => {
    // Clear user data
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    sessionStorage.clear()

    // Redirect to login page
    navigate("/", { replace: true })
  }

  // Function to handle logout cancellation
  const handleCancel = () => {
    // Don't clear any user data when canceling
    setIsOpen(false)

    // Use window.history to go back to the previous page instead of a hardcoded route
    // This ensures we return to wherever the user was before
    if (window.history.length > 1) {
      window.history.back()
    } else {
      // Fallback if there's no history
      navigate("/dashboard")
    }

    // Add a small delay to ensure the modal is closed before navigation
    setTimeout(() => {
      console.log("Cancel logout - returning to previous page")
    }, 100)
  }

  // Close modal if escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        handleCancel()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
      // Make sure we clean up any timers or state
      setIsOpen(false)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
      }}
    >
      <CCard
        className="w-100"
        style={{
          maxWidth: "400px",
          backgroundColor: "white",
          color: "#333",
          border: "none",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CCardBody className="p-4 text-center">
          <div className="d-flex flex-column align-items-center">
            <h2 className="mb-3" style={{ color: "#00B5E2" }}>
              Logout
            </h2>
            <p className="text-center mb-4">Are you sure you want to logout?</p>

            <div className="d-flex gap-3 w-100 mt-3">
              <CButton
                style={{
                  backgroundColor: "#f8f9fa",
                  borderColor: "#dee2e6",
                  color: "#333",
                }}
                className="w-50"
                onClick={handleCancel}
              >
                Cancel
              </CButton>
              <CButton
                style={{
                  backgroundColor: "#00B5E2",
                  borderColor: "#00B5E2",
                  color: "white",
                }}
                className="w-50"
                onClick={handleConfirm}
              >
                Confirm
              </CButton>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}
