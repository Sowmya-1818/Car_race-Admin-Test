
"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardHeader,
  CCardBody,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CContainer,
  CAlert,
  CSpinner,
  CFormSelect,
} from "@coreui/react"
import { FaDiamond, FaTicket, FaWallet } from "react-icons/fa6"
import { getData, postData } from "../../../apiConfigs/apiCalls"
import { GET_TICKET, UPDATE_TICKET } from "../../../apiConfigs/endpoints"

const TicketManagement = () => {
  const [ticketSettings, setTicketSettings] = useState({
    TicketId: "",
    TicketQuantity: "",
    AmountInToken: "",
    DefaultAdminWallet: "",
    Status: "ACTIVE",
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  // Fetch ticket settings on mount
  const fetchTicketSettings = async () => {
    setFetchLoading(true)
    try {
      const response = await getData(GET_TICKET)
      console.log("Fetched ticket data:", response)

      if (response?.success && response?.data) {
        setTicketSettings({
          TicketId: response.data._id || "",
          TicketQuantity: response.data.TicketQuantity || "",
          AmountInToken: response.data.AmountInToken || "",
          DefaultAdminWallet: response.data.DefaultAdminWallet || "",
          Status: response.data.Status || "ACTIVE",
        })
      }
    } catch (error) {
      console.error("Error fetching ticket settings:", error)
      setMessage({
        text: "Failed to load ticket settings. Please try again.",
        type: "danger",
      })
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    fetchTicketSettings()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setTicketSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearMessage = () => {
    setTimeout(() => setMessage({ text: "", type: "" }), 3000)
  }

  // Save ticket conversion settings
  const handleSaveTicketSettings = async () => {
    // Validation
    if (!ticketSettings.TicketQuantity || !ticketSettings.AmountInToken) {
      setMessage({
        text: "Please fill in all required fields (Ticket Quantity and Amount in Token)",
        type: "danger",
      })
      clearMessage()
      return
    }

    if (!ticketSettings.DefaultAdminWallet) {
      setMessage({
        text: "Please provide a default admin wallet address",
        type: "danger",
      })
      clearMessage()
      return
    }

    setLoading(true)
    try {
      const requestBody = {
        TicketQuantity: Number(ticketSettings.TicketQuantity),
        AmountInToken: Number(ticketSettings.AmountInToken),
        DefaultAdminWallet: ticketSettings.DefaultAdminWallet,
        Status: ticketSettings.Status,
      }

      // If we have a TicketId, include it for update
      if (ticketSettings.TicketId) {
        requestBody.TicketId = ticketSettings.TicketId
      }

      console.log("Sending request:", requestBody)

      const response = await postData(UPDATE_TICKET, requestBody)
      console.log("Response:", response)

      if (response?.success) {
        setMessage({
          text: `Ticket conversion settings ${ticketSettings.TicketId ? "updated" : "created"} successfully!`,
          type: "success",
        })

        // Update the TicketId if it was a new creation
        if (!ticketSettings.TicketId && response.data?._id) {
          setTicketSettings((prev) => ({
            ...prev,
            TicketId: response.data._id,
          }))
        }
      } else {
        throw new Error(response?.message || "Failed to save ticket settings")
      }
    } catch (error) {
      console.error("Error saving ticket settings:", error)
      setMessage({
        text: error.message || "Failed to save ticket settings",
        type: "danger",
      })
    } finally {
      setLoading(false)
      clearMessage()
    }
  }

  if (fetchLoading) {
    return (
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <div className="text-center my-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading ticket settings...</p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    )
  }

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={8}>
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
              <h5 className="fw-bold">Ticket Conversion Management</h5>
            </CCardHeader>
            <CCardBody className="p-4">
              {message.text && (
                <CAlert color={message.type} dismissible onClose={() => setMessage({ text: "", type: "" })}>
                  {message.text}
                </CAlert>
              )}

              <div className="mb-4">
                <CFormLabel>Ticket Quantity </CFormLabel>
                <div className="position-relative">
                  <CFormInput
                    type="number"
                    name="TicketQuantity"
                    value={ticketSettings.TicketQuantity}
                    onChange={handleChange}
                    placeholder="Enter ticket quantity"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "10px",
                      padding: "12px 15px",
                    }}
                    required
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#00B5E2",
                    }}
                  >
                    <FaTicket size={20} />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <CFormLabel>Amount in Token </CFormLabel>
                <div className="position-relative">
                  <CFormInput
                    type="number"
                    step="0.000001"
                    name="AmountInToken"
                    value={ticketSettings.AmountInToken}
                    onChange={handleChange}
                    placeholder="Enter token amount"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "10px",
                      padding: "12px 15px",
                    }}
                    required
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#00B5E2",
                    }}
                  >
                    <FaDiamond size={20} />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <CFormLabel>Admin Wallet </CFormLabel>
                <div className="position-relative">
                  <CFormInput
                    type="text"
                    name="DefaultAdminWallet"
                    value={ticketSettings.DefaultAdminWallet}
                    onChange={handleChange}
                    placeholder="Enter admin wallet address"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "10px",
                      padding: "12px 15px",
                    }}
                    required
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#00B5E2",
                    }}
                  >
                    <FaWallet size={20} />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  name="Status"
                  value={ticketSettings.Status}
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "10px",
                    padding: "12px 15px",
                  }}
                  options={[
                    { label: "Active", value: "ACTIVE" },
                    { label: "Inactive", value: "INACTIVE" },
                  ]}
                />
              </div>

              <div className="d-flex justify-content-center mt-4">
                <CButton
                  onClick={handleSaveTicketSettings}
                  disabled={loading}
                  style={{
                    backgroundColor: "#00B5E2",
                    borderColor: "#00B5E2",
                    color: "white",
                    borderRadius: "25px",
                    padding: "10px 40px",
                    fontWeight: "bold",
                  }}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : ticketSettings.TicketId ? (
                    "Update Settings"
                  ) : (
                    "Create Settings"
                  )}
                </CButton>
              </div>

              {ticketSettings.TicketId && (
                <div className="text-center mt-3">
                  {/* <small className="text-muted">Current Settings ID: {ticketSettings.TicketId}</small> */}
                </div>
              )}
            </CCardBody>
          </CCard>

          {/* Information Card */}
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
              <h6 className="fw-bold mb-0">Conversion Rate Information</h6>
            </CCardHeader>
            <CCardBody className="p-4">
              <div className="row text-center">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-1">Tickets</h6>
                    <h4 className="text-primary mb-0">{ticketSettings.TicketQuantity || "0"}</h4>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-1">Token Amount</h6>
                    <h4 className="text-success mb-0">{ticketSettings.AmountInToken || "0"}</h4>
                  </div>
                </div>
              </div>
              {ticketSettings.TicketQuantity && ticketSettings.AmountInToken && (
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Rate: 1 Token ={" "}
                    {(Number(ticketSettings.TicketQuantity) / Number(ticketSettings.AmountInToken)).toFixed(6)} Tickets
                  </small>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default TicketManagement
