// "use client"

// import { useState, useEffect } from "react"
// import {
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CFormLabel,
//   CButton,
//   CRow,
//   CCol,
//   CContainer,
//   CAlert,
//   CFormInput,
//   CSpinner,
// } from "@coreui/react"
// import { postData, getData } from "../../../src/apiConfigs/apiCalls"
// import { ADMIN_SET_REFERRAL_REWARD, GET_REFERRAL_REWARD } from "../../../src/apiConfigs/endpoints"

// const ReferralReward = () => {
//   const [referralAmount, setReferralAmount] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState({ text: "", type: "" })
//   const [currentSetting, setCurrentSetting] = useState(null)
//   const [loadingSettings, setLoadingSettings] = useState(false)
//   const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null)

//   const handleChange = (e) => {
//     // Only allow positive numbers
//     const value = e.target.value
//     if (value === "" || (/^\d*\.?\d*$/.test(value) && !isNaN(Number.parseFloat(value)))) {
//       setReferralAmount(value)
//     }
//   }

//   const handleSubmit = async () => {
//     // Validate input
//     if (!referralAmount.trim() || Number.parseFloat(referralAmount) <= 0) {
//       setMessage({ text: "Please enter a valid referral amount (greater than 0)", type: "warning" })
//       return
//     }

//     // Check if the amount is the same as current
//     if (currentSetting && Number.parseFloat(referralAmount) === currentSetting.referralAmount) {
//       setMessage({
//         text: `The referral amount is already set to ${referralAmount}`,
//         type: "warning",
//       })
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await postData(ADMIN_SET_REFERRAL_REWARD, { referralAmount: Number.parseFloat(referralAmount) })

//       // Use actual key from your API response: referralSetting
//       const newSetting = response?.newReferralSetting || response?.referralSetting

//       if (newSetting) {
//         setCurrentSetting(newSetting)
//         setMessage({
//           text: `Referral reward amount updated successfully to ${newSetting.referralAmount}!`,
//           type: "success",
//         })
//       } else {
//         setMessage({ text: response?.message || "Failed to update referral reward amount", type: "danger" })
//       }
//     } catch (error) {
//       console.error("Error updating referral reward amount:", error)
//       setMessage({ text: "Failed to update referral reward amount", type: "danger" })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <CContainer>
//       <CRow className="justify-content-center">
//         <CCol md={10}>
//           <CCard className="mb-4 shadow-lg" style={{ borderRadius: "15px" }}>
//             <CCardHeader
//               style={{
//                 backgroundColor: "#00B5E2",
//                 color: "white",
//                 borderTopLeftRadius: "15px",
//                 borderTopRightRadius: "15px",
//               }}
//               className="text-center"
//             >
//               <h5 className="fw-bold">Set Referral Reward</h5>
//             </CCardHeader>
//             <CCardBody className="p-4">
//               {message.text && (
//                 <CAlert color={message.type} className="mb-4">
//                   <div className="d-flex align-items-center">
//                     <div className="me-3">
//                       {message.type === "success" && <i className="fas fa-check-circle fs-4"></i>}
//                       {message.type === "info" && <i className="fas fa-info-circle fs-4"></i>}
//                       {message.type === "warning" && <i className="fas fa-exclamation-triangle fs-4"></i>}
//                       {message.type === "danger" && <i className="fas fa-times-circle fs-4"></i>}
//                     </div>
//                     <div>
//                       <strong>
//                         {message.type === "success"
//                           ? "Success!"
//                           : message.type === "info"
//                           ? "Active Setting:"
//                           : message.type === "warning"
//                           ? "Warning:"
//                           : "Error:"}
//                       </strong>{" "}
//                       {message.text}
//                     </div>
//                   </div>
//                 </CAlert>
//               )}

//               {loadingSettings ? (
//                 <div className="text-center my-4">
//                   <CSpinner color="primary" />
//                   <p className="mt-2">Loading current settings...</p>
//                 </div>
//               ) : (
//                 <>
//                   {currentSetting && (
//                     <div className="mb-4 p-3 bg-light rounded">
//                       <h6 className="mb-2">Current Referral Reward Setting:</h6>
//                       <p className="mb-1">
//                         <strong>Amount:</strong> {currentSetting.referralAmount}
//                       </p>
//                       <p className="mb-1">
//                         <strong>Status:</strong>{" "}
//                         <span className={`badge ${currentSetting.Status === "active" ? "bg-success" : "bg-secondary"}`}>
//                           {currentSetting.Status}
//                         </span>
//                       </p>
//                       <p className="mb-0">
//                         <strong>Last Updated:</strong> {new Date(currentSetting.updatedAt).toLocaleString()}
//                       </p>
//                     </div>
//                   )}

//                   <div className="mb-4">
//                     <p>
//                       Set the reward amount that users will receive when they refer new users to the platform. This
//                       amount will be credited to the referring user's account when a new user signs up using their
//                       referral link.
//                     </p>
//                   </div>

//                   <CRow>
//                     <CCol md={4} className="d-flex align-items-center">
//                       <CFormLabel className="mb-0 fw-bold">Referral Reward Amount</CFormLabel>
//                     </CCol>
//                     <CCol md={8}>
//                       <CFormInput
//                         type="text"
//                         id="referralAmount"
//                         value={referralAmount}
//                         onChange={handleChange}
//                         placeholder="Enter referral reward amount"
//                         style={{
//                           backgroundColor: "#f8f9fa",
//                           border: "1px solid #dee2e6",
//                           borderRadius: "10px",
//                           padding: "12px 15px",
//                         }}
//                       />
//                     </CCol>
//                   </CRow>

//                   <div className="d-flex justify-content-center mt-4">
//                     <CButton
//                       onClick={handleSubmit}
//                       disabled={loading}
//                       style={{
//                         backgroundColor: "#00B5E2",
//                         borderColor: "#00B5E2",
//                         color: "white",
//                         borderRadius: "25px",
//                         padding: "10px 40px",
//                         fontWeight: "bold",
//                         width: "100%",
//                         maxWidth: "400px",
//                       }}
//                     >
//                       {loading ? (
//                         <>
//                           <CSpinner size="sm" className="me-2" /> Updating...
//                         </>
//                       ) : (
//                         "Update Referral Reward"
//                       )}
//                     </CButton>
//                   </div>
//                 </>
//               )}
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </CContainer>
//   )
// }

// export default ReferralReward
// ==================================

// "use client"

// import { useState, useEffect } from "react"
// import {
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CFormLabel,
//   CButton,
//   CRow,
//   CCol,
//   CContainer,
//   CAlert,
//   CFormInput,
//   CSpinner,
//   CFormTextarea,
//   CFormSelect,
// } from "@coreui/react"
// import { getData, postData } from "../../../src/apiConfigs/apiCalls"
// import { GET_REFERRAL_REWARD, ADMIN_SET_REFERRAL_REWARD } from "../../../src/apiConfigs/endpoints"

// const ReferralReward = () => {
//   const [referralSettings, setReferralSettings] = useState({
//     referralAmount: "",
//     signupBonus: "",
//     referral_Note: "",
//     botName: "",
//     Status: "active",
//   })
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [message, setMessage] = useState({ text: "", type: "" })

//   // Fetch referral settings
//   const fetchReferralSettings = async () => {
//     setFetchLoading(true)
//     try {
//       const response = await getData(GET_REFERRAL_REWARD)
//       if (response?.success && response?.data) {
//         // Update state with the fetched data
//         setReferralSettings({
//           referralAmount: response.data.referralAmount || "",
//           signupBonus: response.data.signupBonus || "",
//           referral_Note: response.data.referral_Note || "",
//           botName: response.data.botName || "",
//           Status: response.data.Status || "active",
//         })
//       }
//     } catch (error) {
//       console.error("Error fetching referral settings:", error)
//       setMessage({
//         text: "Failed to load referral settings. Please try again.",
//         type: "danger",
//       })
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchReferralSettings()
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setReferralSettings((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const clearMessage = () => {
//     setTimeout(() => setMessage({ text: "", type: "" }), 3000)
//   }

//   // Save referral settings
// const handleSaveReferralSettings = async () => {
//   // Validation checks
//   if (!referralSettings.referralAmount || !referralSettings.signupBonus) {
//     setMessage({
//       text: "Please fill in all required fields",
//       type: "danger", // Danger for missing fields
//     })
//     clearMessage()
//     return
//   }

//   setLoading(true)
//   try {
//     const requestBody = {
//       referralAmount: Number(referralSettings.referralAmount),
//       signupBonus: Number(referralSettings.signupBonus),
//       referral_Note: referralSettings.referral_Note,
//       botName: referralSettings.botName,
//       Status: referralSettings.Status,
//     }

//     const response = await postData(ADMIN_SET_REFERRAL_REWARD, requestBody)
//   } catch (error) {
//     // Catch any error and display it
//     console.error("Error saving referral settings:", error)
//     setMessage({
//       text: error.message || "Failed to save referral settings",
//       type: "danger", // Error message in danger color
//     })
//   } finally {
//     setLoading(false)
//     clearMessage()
//   }
// }

//   if (fetchLoading) {
//     return (
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={8}>
//             <div className="text-center my-5">
//               <CSpinner color="primary" />
//               <p className="mt-3">Loading referral settings...</p>
//             </div>
//           </CCol>
//         </CRow>
//       </CContainer>
//     )
//   }

//   return (
//     <CContainer>
//       <CRow className="justify-content-center">
//         <CCol md={8}>
//           <CCard className="mb-4 shadow-lg" style={{ borderRadius: "15px" }}>
//             <CCardHeader
//               style={{
//                 backgroundColor: "#00B5E2",
//                 color: "white",
//                 borderTopLeftRadius: "15px",
//                 borderTopRightRadius: "15px",
//               }}
//               className="text-center"
//             >
//               <h5 className="fw-bold">Referral Settings</h5>
//             </CCardHeader>
//             <CCardBody className="p-4">
//               {message.text && (
//                 <CAlert color={message.type} dismissible onClose={() => setMessage({ text: "", type: "" })}>
//                   {message.text}
//                 </CAlert>
//               )}

//               {/* Referral Amount */}
//               <div className="mb-4">
//                 <CFormLabel>Referral Amount</CFormLabel>
//                 <div className="position-relative">
//                   <CFormInput
//                     type="number"
//                     name="referralAmount"
//                     value={referralSettings.referralAmount}
//                     onChange={handleChange}
//                     placeholder="Enter referral reward amount"
//                     style={{
//                       backgroundColor: "#f8f9fa",
//                       border: "1px solid #dee2e6",
//                       borderRadius: "10px",
//                       padding: "12px 15px",
//                     }}
//                     required
//                   />
//                   <div
//                     style={{
//                       position: "absolute",
//                       right: "15px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       color: "#6c757d",
//                     }}
//                   >
//                   </div>
//                 </div>
//               </div>

//               {/* Signup Bonus */}
//               <div className="mb-4">
//                 <CFormLabel>Signup Bonus</CFormLabel>
//                 <div className="position-relative">
//                   <CFormInput
//                     type="number"
//                     name="signupBonus"
//                     value={referralSettings.signupBonus}
//                     onChange={handleChange}
//                     placeholder="Enter signup bonus amount"
//                     style={{
//                       backgroundColor: "#f8f9fa",
//                       border: "1px solid #dee2e6",
//                       borderRadius: "10px",
//                       padding: "12px 15px",
//                     }}
//                     required
//                   />
//                   <div
//                     style={{
//                       position: "absolute",
//                       right: "15px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       color: "#6c757d",
//                     }}
//                   >
//                   </div>
//                 </div>
//               </div>

//               {/* Referral Note */}
//               <div className="mb-4">
//                 <CFormLabel>Referral Note</CFormLabel>
//                 <CFormTextarea
//                   name="referral_Note"
//                   value={referralSettings.referral_Note}
//                   onChange={handleChange}
//                   placeholder="Enter referral note or description"
//                   rows={3}
//                   style={{
//                     backgroundColor: "#f8f9fa",
//                     border: "1px solid #dee2e6",
//                     borderRadius: "10px",
//                     padding: "12px 15px",
//                   }}
//                 />
//               </div>

//               {/* Bot Name */}
//               <div className="mb-4">
//                 <CFormLabel>Bot Name</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   name="botName"
//                   value={referralSettings.botName}
//                   onChange={handleChange}
//                   placeholder="Enter bot name"
//                   style={{
//                     backgroundColor: "#f8f9fa",
//                     border: "1px solid #dee2e6",
//                     borderRadius: "10px",
//                     padding: "12px 15px",
//                   }}
//                 />
//               </div>

//               {/* Status */}
//               <div className="mb-4">
//                 <CFormLabel>Status</CFormLabel>
//                 <CFormSelect
//                   name="Status"
//                   value={referralSettings.Status}
//                   onChange={handleChange}
//                   style={{
//                     backgroundColor: "#f8f9fa",
//                     border: "1px solid #dee2e6",
//                     borderRadius: "10px",
//                     padding: "12px 15px",
//                   }}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </CFormSelect>
//               </div>

//               <div className="d-flex justify-content-center mt-4">
//                 <CButton
//                   onClick={handleSaveReferralSettings}
//                   disabled={loading}
//                   style={{
//                     backgroundColor: "#00B5E2",
//                     borderColor: "#00B5E2",
//                     color: "white",
//                     borderRadius: "25px",
//                     padding: "10px 40px",
//                     fontWeight: "bold",
//                     width: "100%",
//                     maxWidth: "400px",
//                   }}
//                 >
//                   {loading ? (
//                     <>
//                       <CSpinner size="sm" className="me-2" />
//                       Saving...
//                     </>
//                   ) : (
//                     "Save Referral Settings"
//                   )}
//                 </CButton>
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </CContainer>
//   )
// }

// export default ReferralReward


"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardHeader,
  CCardBody,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CContainer,
  CAlert,
  CFormInput,
  CSpinner,
  CFormTextarea,
  CFormSelect,
} from "@coreui/react"
import { getData, postData } from "../../../src/apiConfigs/apiCalls"
import { GET_REFERRAL_REWARD, ADMIN_SET_REFERRAL_REWARD } from "../../../src/apiConfigs/endpoints"

const ReferralReward = () => {
  const [referralSettings, setReferralSettings] = useState({
    referralAmount: "",
    signupBonus: "",
    referral_Note: "",
    botName: "",
    Status: "active",
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  // Fetch referral settings
  const fetchReferralSettings = async () => {
    setFetchLoading(true)
    try {
      const response = await getData(GET_REFERRAL_REWARD)
      console.log("API Response:", response) // Debug log

      // Based on your console output, the data is in response.referralSettings
      let data = null

      if (response?.referralSettings) {
        data = response.referralSettings
      } else if (response?.data?.referralSettings) {
        data = response.data.referralSettings
      } else if (response?.data) {
        data = response.data
      }

      if (data) {
        console.log("Setting data:", data) // Debug log
        setReferralSettings({
          referralAmount: data.referralAmount?.toString() || "",
          signupBonus: data.signupBonus?.toString() || "",
          referral_Note: data.referral_Note || "",
          botName: data.botName || "",
          Status: data.Status || "active",
        })

        // Show info message about loaded data
        // setMessage({
        //   text: "Referral settings loaded successfully",
        //   type: "info",
        // })

        // Clear the info message after 3 seconds
        setTimeout(() => {
          setMessage({ text: "", type: "" })
        }, 3000)
      } else {
        console.log("No data found in response") // Debug log
        setMessage({
          text: "No existing referral settings found. You can create new settings.",
          type: "info",
        })
      }
    } catch (error) {
      console.error("Error fetching referral settings:", error)
      setMessage({
        text: "Failed to load referral settings. Please try again.",
        type: "danger",
      })
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    fetchReferralSettings()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setReferralSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearMessage = () => {
    setTimeout(() => setMessage({ text: "", type: "" }), 5000)
  }

  // Save referral settings
  const handleSaveReferralSettings = async () => {
    // Validation checks
    if (!referralSettings.referralAmount || !referralSettings.signupBonus) {
      setMessage({
        text: "Please fill in all required fields",
        type: "danger",
      })
      return
    }

    setLoading(true)
    try {
      const requestBody = {
        referralAmount: Number(referralSettings.referralAmount),
        signupBonus: Number(referralSettings.signupBonus),
        referral_Note: referralSettings.referral_Note,
        botName: referralSettings.botName,
        Status: referralSettings.Status,
      }

      console.log("Sending request:", requestBody) // Debug log
      const response = await postData(ADMIN_SET_REFERRAL_REWARD, requestBody)
      console.log("Save response:", response) // Debug log

      if (response) {
        setMessage({
          text: response.message || "Referral settings updated successfully!",
          type: "success",
        })

        // If there's updated data in the response, update the state
        // Check for the same nested structure as in GET response
        let updatedData = null
        if (response.referralSettings) {
          updatedData = response.referralSettings
        } else if (response.data?.referralSettings) {
          updatedData = response.data.referralSettings
        } else if (response.data) {
          updatedData = response.data
        }

        if (updatedData) {
          setReferralSettings({
            referralAmount: updatedData.referralAmount?.toString() || referralSettings.referralAmount,
            signupBonus: updatedData.signupBonus?.toString() || referralSettings.signupBonus,
            referral_Note: updatedData.referral_Note || referralSettings.referral_Note,
            botName: updatedData.botName || referralSettings.botName,
            Status: updatedData.Status || referralSettings.Status,
          })
        }
      } else {
        setMessage({
          text: "Failed to update referral settings",
          type: "danger",
        })
      }
    } catch (error) {
      console.error("Error saving referral settings:", error)
      setMessage({
        text: error.message || "Failed to save referral settings",
        type: "danger",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <div className="text-center my-5">
              <CSpinner color="primary" />
              <p className="mt-3">Loading referral settings...</p>
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
              <h5 className="fw-bold">Referral Settings</h5>
            </CCardHeader>
            <CCardBody className="p-4">
              {message.text && (
                <CAlert color={message.type} dismissible onClose={() => setMessage({ text: "", type: "" })}>
                  {message.text}
                </CAlert>
              )}

              {/* Referral Amount */}
              <div className="mb-4">
                <CFormLabel>Referral Amount</CFormLabel>
                <div className="position-relative">
                  <CFormInput
                    type="number"
                    name="referralAmount"
                    value={referralSettings.referralAmount}
                    onChange={handleChange}
                    placeholder="Enter referral reward amount"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "10px",
                      padding: "12px 15px",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Signup Bonus */}
              <div className="mb-4">
                <CFormLabel>Signup Bonus</CFormLabel>
                <div className="position-relative">
                  <CFormInput
                    type="number"
                    name="signupBonus"
                    value={referralSettings.signupBonus}
                    onChange={handleChange}
                    placeholder="Enter signup bonus amount"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "10px",
                      padding: "12px 15px",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Referral Note */}
              <div className="mb-4">
                <CFormLabel>Referral Note</CFormLabel>
                <CFormTextarea
                  name="referral_Note"
                  value={referralSettings.referral_Note}
                  onChange={handleChange}
                  placeholder="Enter referral note or description"
                  rows={3}
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "10px",
                    padding: "12px 15px",
                  }}
                />
              </div>

              {/* Bot Name */}
              <div className="mb-4">
                <CFormLabel>Bot Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="botName"
                  value={referralSettings.botName}
                  onChange={handleChange}
                  placeholder="Enter bot name"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "10px",
                    padding: "12px 15px",
                  }}
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  name="Status"
                  value={referralSettings.Status}
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "10px",
                    padding: "12px 15px",
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </CFormSelect>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <CButton
                  onClick={handleSaveReferralSettings}
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
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    "Update Referral Settings"
                  )}
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ReferralReward


