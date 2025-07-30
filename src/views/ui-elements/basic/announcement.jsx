
"use client"

import { useState } from "react"
import {
  CCard,
  CCardHeader,
  CCardBody,
  CFormTextarea,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CContainer,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react"
import { postData } from "../../../apiConfigs/apiCalls"
import { ANNOUNCEMENT } from "../../../apiConfigs/endpoints"

const Announcement = () => {
  const [announcement, setAnnouncement] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleChange = (e) => {
    setAnnouncement(e.target.value)
  }

  const handleSubmit = async () => {
    if (!announcement.trim()) {
      setMessage({ text: "Please enter an announcement", type: "warning" })
      return
    }

    // Just show confirmation modal - no loading state change
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false)
    setLoading(true)

    try {
      const response = await postData(ANNOUNCEMENT, { Notification: announcement })

      if (response?.status === "Success") {
        setMessage({ text: "Announcement sent to all users successfully!", type: "success" })
        setAnnouncement("")
      } else {
        setMessage({ text: response?.message || "Failed to send announcement", type: "danger" })
      }
    } catch (error) {
      console.error("Error submitting announcement:", error)
      setMessage({ text: "Failed to send announcement", type: "danger" })
    } finally {
      setLoading(false) // This ensures loading is always reset
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage({ text: "", type: "" }), 3000)
  }

  const handleCancelSubmit = () => {
    setShowConfirmModal(false)
    setLoading(false) // Reset loading state when canceling
  }

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={10}>
          <CCard className="mb-4 shadow-lg" style={{ borderRadius: "15px" }}>
            <CCardHeader
              style={{
                backgroundColor: "#00B5E2",
                color: "white",
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
              }}
              className="text-center"
            >
              <h5 className="fw-bold">Create Announcement</h5>
            </CCardHeader>
            <CCardBody className="p-4">
              {message.text && (
                <CAlert color={message.type} dismissible onClose={() => setMessage({ text: "", type: "" })}>
                  {message.text}
                </CAlert>
              )}

              <CRow>
                <CCol md={4} className="d-flex align-items-center">
                  <CFormLabel className="mb-0 fw-bold">Announcement</CFormLabel>
                </CCol>
                <CCol md={8}>
                  <CFormTextarea
                    id="announcement"
                    rows={10}
                    value={announcement}
                    onChange={handleChange}
                    placeholder="Enter your announcement here..."
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "10px",
                      padding: "12px 15px",
                    }}
                  />
                </CCol>
              </CRow>

              <div className="d-flex justify-content-center mt-4">
                <CButton
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    backgroundColor: "#00B5E2",
                    borderColor: "#00B5E2",
                    color: "white",
                    borderRadius: "25px",
                    padding: "10px 40px",
                    fontWeight: "bold",
                    width: "100%",
                    maxWidth: "400px",
                  }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Confirmation Modal */}
      <CModal visible={showConfirmModal} onClose={handleCancelSubmit} backdrop="static">
        <CModalHeader
          style={{
            backgroundColor: "#00B5E2",
            color: "white",
            border: "none",
          }}
        >
          <CModalTitle>Confirm</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center py-4">
          <p>Notification will be sent to all users</p>
        </CModalBody>
        <CModalFooter className="justify-content-center">
          <CButton
            style={{
              backgroundColor: "#6c757d",
              borderColor: "#6c757d",
              color: "white",
            }}
            onClick={handleCancelSubmit}
          >
            Cancel
          </CButton>
          <CButton
            style={{
              backgroundColor: "#00B5E2",
              borderColor: "#00B5E2",
              color: "white",
              marginLeft: "10px",
            }}
            onClick={handleConfirmSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "OK"}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default Announcement
