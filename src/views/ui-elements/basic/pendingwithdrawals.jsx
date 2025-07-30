// "use client"

// import { useState, useEffect } from "react"
// import {
//   CRow,
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CButton,
//   CBadge,
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CFormInput,
// } from "@coreui/react"
// import { getData, postData } from "../../../apiConfigs/apiCalls"
// import { GET_ALL_WITHDRAWALS, APPROVE_WITHDRAW, REJECT_WITHDRAW } from "../../../apiConfigs/endpoints"
// import { useNavigate } from "react-router-dom"
// import * as XLSX from "xlsx"

// const PendingWithdrawals = () => {
//   const navigate = useNavigate()
//   const [withdrawals, setWithdrawals] = useState([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [totalCount, setTotalCount] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [showApproveModal, setShowApproveModal] = useState(false)
//   const [showRejectModal, setShowRejectModal] = useState(false)
//   const [showSuccessModal, setShowSuccessModal] = useState(false)
//   const [selectedWithdrawalId, setSelectedWithdrawalId] = useState(null)
//   const [rejectionReason, setRejectionReason] = useState("")
//   const withdrawalsPerPage = 10

//   const fetchWithdrawals = async (page = 1) => {
//     try {
//       setLoading(true)
//       // Use the backend's status filter for pending withdrawals
//       const response = await getData(`${GET_ALL_WITHDRAWALS}?status=pending&page=${page}&limit=${withdrawalsPerPage}`)
//       console.log("GET_ALL_WITHDRAWALS Response:", response)

//       if (response?.withdrawals) {
//         setWithdrawals(response.withdrawals)
//         setTotalCount(response.count || 0)
//         setTotalPages(response.totalPages || 1)
//         setCurrentPage(page)
//       } else {
//         setWithdrawals([])
//         setTotalCount(0)
//         setTotalPages(1)
//       }
//     } catch (error) {
//       console.error("Error fetching withdrawals:", error)
//       setWithdrawals([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchWithdrawals(currentPage)
//   }, [])

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       const newPage = currentPage + 1
//       setCurrentPage(newPage)
//       fetchWithdrawals(newPage)
//     }
//   }

//   const prevPage = () => {
//     if (currentPage > 1) {
//       const newPage = currentPage - 1
//       setCurrentPage(newPage)
//       fetchWithdrawals(newPage)
//     }
//   }

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page)
//       fetchWithdrawals(page)
//     }
//   }

//   // Function to handle username click - navigate to user details page
//   const handleUsernameClick = async (username, userId) => {
//     if (!username) {
//       alert("Username is required")
//       return
//     }

//     try {
//       // Store the username in sessionStorage for the user details page
//       sessionStorage.setItem("selectedUsername", username)

//       // Navigate directly to the user details page with the username
//       navigate(`/user-game-details/${encodeURIComponent(username)}`)
//     } catch (error) {
//       console.error("Error navigating to user details:", error)
//       alert("Error navigating to user details. Please try again.")
//     }
//   }

//   const openApproveModal = (id) => {
//     setSelectedWithdrawalId(id)
//     setShowApproveModal(true)
//   }

//   const openRejectModal = (id) => {
//     setSelectedWithdrawalId(id)
//     setRejectionReason("")
//     setShowRejectModal(true)
//   }

//   async function handleApprove() {
//     try {
//       await postData(APPROVE_WITHDRAW, { requestId: selectedWithdrawalId })
//       setShowApproveModal(false)
//       setShowSuccessModal(true)
//       setTimeout(() => setShowSuccessModal(false), 2500)
//       await fetchWithdrawals(currentPage)
//     } catch (error) {
//       console.error("Error approving withdrawal:", error)
//     }
//   }

//   async function handleReject() {
//     if (!rejectionReason.trim()) return

//     try {
//       await postData(REJECT_WITHDRAW, {
//         requestId: selectedWithdrawalId,
//         reason: rejectionReason,
//       })
//       setShowRejectModal(false)
//       await fetchWithdrawals(currentPage)
//     } catch (error) {
//       console.error("Error rejecting withdrawal:", error)
//     }
//   }

//   const downloadPendingExcel = async () => {
//     try {
//       // Fetch all pending withdrawals with a high limit
//       const response = await getData(`${GET_ALL_WITHDRAWALS}?status=pending&page=1&limit=1000000000000000000000000000000`)
//       const allPending = response?.withdrawals || []

//       if (!allPending.length) {
//         alert("No data to export")
//         return
//       }

//       const formattedData = allPending.map((withdrawal) => ({
//         UserName: withdrawal.username || "N/A",
//         Network: withdrawal.token || "N/A",
//         Initiated: withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleString() : "N/A",
//         Amount: withdrawal.amount || 0,
//         Charge: withdrawal.charge || 0,
//         USDT_Amount: withdrawal.USDT_Amount || 0,
//         After_Charge: withdrawal.After_Charge || 0,
//         Status: withdrawal.status || "N/A",
//       }))

//       const ws = XLSX.utils.json_to_sheet(formattedData)
//       const wb = XLSX.utils.book_new()
//       XLSX.utils.book_append_sheet(wb, ws, "PendingWithdrawals")

//       XLSX.writeFile(wb, "pending_withdrawals.xlsx")
//     } catch (error) {
//       alert("Failed to export pending withdrawals. Please try again.")
//       console.error("Error exporting pending withdrawals:", error)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <CCard className="mb-4 shadow-lg">
//         <CCardHeader style={{ backgroundColor: "#00B5E2", color: "white" }} className="text-center">
//           <h5 className="fw-bold">Pending Withdrawals</h5>
//         </CCardHeader>

//         <CCardBody>
//           <div className="d-flex justify-content-end mb-3">
//             <CButton
//               style={{
//                 backgroundColor: "#00B5E2",
//                 borderColor: "#00B5E2",
//                 color: "black",
//               }}
//               onClick={downloadPendingExcel}
//             >
//               EXPORT AS EXCEL
//             </CButton>
//           </div>

//           <CRow>
//             <div className="container">
//               <div className="table-responsive">
//                 <table className="table table-bordered table-hover text-center align-middle">
//                   <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
//                     <tr>
//                       <th>S.No</th>
//                       <th>User Name</th>
//                       <th>Network</th>
//                       <th>Initiated</th>
//                       <th>Amount</th>
//                       <th>Charge</th>
//                       <th>USDT_Amount</th>
//                       <th>After Charge</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {withdrawals.length > 0 ? (
//                       withdrawals.map((withdrawal, index) => (
//                         <tr key={withdrawal._id} className="table-light">
//                           <td className="fw-bold">{(currentPage - 1) * withdrawalsPerPage + index + 1}</td>
//                           <td>
//                             <span
//                               className="text-primary"
//                               style={{ cursor: "pointer", textDecoration: "underline" }}
//                               onClick={() =>
//                                 handleUsernameClick(withdrawal.username, withdrawal.userId || withdrawal._id)
//                               }
//                             >
//                               {withdrawal.username || "N/A"}
//                             </span>
//                           </td>
//                           <td>{withdrawal.token || "N/A"}</td>
//                           <td>{new Date(withdrawal.createdAt).toLocaleString() || "N/A"}</td>
//                           <td>{withdrawal.amount || 0}</td>
//                           <td>{withdrawal.charge || 0}</td>
//                           <td>{withdrawal.USDT_Amount || 0}</td>
//                           <td>{withdrawal.After_Charge || 0}</td>
//                           <td>
//                             <CBadge color="warning">Pending</CBadge>
//                           </td>
//                           <td>
//                             <CButton
//                               style={{
//                                 backgroundColor: "#00B5E2",
//                                 borderColor: "#00B5E2",
//                                 color: "white",
//                               }}
//                               size="sm"
//                               className="me-2"
//                               onClick={() => openApproveModal(withdrawal._id)}
//                             >
//                               Approve
//                             </CButton>
//                             <CButton color="danger" size="sm" onClick={() => openRejectModal(withdrawal._id)}>
//                               Reject
//                             </CButton>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="10" className="text-center text-muted fw-bold py-3">
//                           No pending withdrawals available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination - Same structure as other pages */}
//               <div className="d-flex justify-content-center mt-3">
//                 <nav aria-label="Page navigation">
//                   <div className="d-flex align-items-center gap-1 p-2 bg-white rounded shadow-sm border">
//                     <button
//                       className={`btn d-flex align-items-center justify-content-center ${
//                         currentPage === 1 ? "text-muted border-0 bg-light" : "text-white border-0"
//                       }`}
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         backgroundColor: currentPage === 1 ? "#f8f9fa" : "#00BFFF",
//                         cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                       }}
//                       disabled={currentPage === 1}
//                       onClick={prevPage}
//                     >
//                       &#8249;
//                     </button>

//                     {(() => {
//                       const pages = []
//                       if (totalPages <= 7) {
//                         for (let i = 1; i <= totalPages; i++) {
//                           pages.push(
//                             <button
//                               key={i}
//                               className={`btn d-flex align-items-center justify-content-center border-0 ${
//                                 currentPage === i ? "text-white" : "text-dark bg-light hover-bg-gray"
//                               }`}
//                               style={{
//                                 width: "40px",
//                                 height: "40px",
//                                 backgroundColor: currentPage === i ? "#00BFFF" : "#f8f9fa",
//                                 fontWeight: currentPage === i ? "bold" : "normal",
//                               }}
//                               onClick={() => goToPage(i)}
//                             >
//                               {i}
//                             </button>,
//                           )
//                         }
//                       }
//                       return pages
//                     })()}

//                     <button
//                       className={`btn d-flex align-items-center justify-content-center ${
//                         currentPage >= totalPages ? "text-muted border-0 bg-light" : "text-white border-0"
//                       }`}
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         backgroundColor: currentPage >= totalPages ? "#f8f9fa" : "#00BFFF",
//                         cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
//                       }}
//                       disabled={currentPage >= totalPages}
//                       onClick={nextPage}
//                     >
//                       &#8250;
//                     </button>
//                   </div>
//                 </nav>
//               </div>
//             </div>
//           </CRow>
//         </CCardBody>
//       </CCard>

//       {/* Approve Confirmation Modal */}
//       <CModal
//         visible={showApproveModal}
//         onClose={() => setShowApproveModal(false)}
//         alignment="center"
//         backdrop="static"
//       >
//         <CModalHeader closeButton style={{ backgroundColor: "#00B5E2", color: "white" }}>
//           <h5 className="m-0">Confirm Approval</h5>
//         </CModalHeader>
//         <CModalBody className="py-4">
//           <p className="mb-0">Are you sure you want to approve this withdrawal?</p>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowApproveModal(false)}>
//             Cancel
//           </CButton>
//           <CButton style={{ backgroundColor: "#00B5E2", borderColor: "#00B5E2" }} onClick={handleApprove}>
//             Approve
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Reject Modal */}
//       <CModal visible={showRejectModal} onClose={() => setShowRejectModal(false)} alignment="center" backdrop="static">
//         <CModalHeader closeButton style={{ backgroundColor: "#dc3545", color: "white" }}>
//           <h5 className="m-0">Reject Withdrawal</h5>
//         </CModalHeader>
//         <CModalBody className="py-4">
//           <p className="mb-3">Please provide a reason for rejection:</p>
//           <CFormInput
//             type="text"
//             value={rejectionReason}
//             onChange={(e) => setRejectionReason(e.target.value)}
//             placeholder="Enter reason for rejection"
//             autoFocus
//           />
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowRejectModal(false)}>
//             Cancel
//           </CButton>
//           <CButton color="danger" onClick={handleReject} disabled={!rejectionReason.trim()}>
//             Reject
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Success Modal */}
//       <CModal
//         visible={showSuccessModal}
//         onClose={() => setShowSuccessModal(false)}
//         alignment="center"
//         backdrop="static"
//       >
//         <CModalHeader style={{ backgroundColor: "#28a745", color: "white" }}>
//           <h5 className="m-0">Success</h5>
//         </CModalHeader>
//         <CModalBody className="py-4 text-center">✅ Withdrawal approved successfully!</CModalBody>
//         <CModalFooter>
//           <CButton
//             style={{
//               backgroundColor: "#28a745",
//               borderColor: "#28a745",
//               color: "white",
//             }}
//             onClick={() => setShowSuccessModal(false)}
//           >
//             Okay
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   )
// }

// export default PendingWithdrawals



"use client"

import { useState, useEffect } from "react"
import {
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
} from "@coreui/react"
import { getData, postData } from "../../../apiConfigs/apiCalls"
import { GET_ALL_WITHDRAWALS, APPROVE_WITHDRAW, REJECT_WITHDRAW } from "../../../apiConfigs/endpoints"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"

const PendingWithdrawals = () => {
  const navigate = useNavigate()
  const [withdrawals, setWithdrawals] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const withdrawalsPerPage = 10

  const fetchWithdrawals = async (page = 1) => {
    try {
      setLoading(true)
      // Use the backend's status filter for pending withdrawals
      const response = await getData(`${GET_ALL_WITHDRAWALS}?status=pending&page=${page}&limit=${withdrawalsPerPage}`)
      console.log("GET_ALL_WITHDRAWALS Response:", response)

      if (response?.withdrawals) {
        setWithdrawals(response.withdrawals)
        setTotalCount(response.count || 0)
        setTotalPages(response.totalPages || 1)
        setCurrentPage(page)
      } else {
        setWithdrawals([])
        setTotalCount(0)
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error)
      setWithdrawals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWithdrawals(currentPage)
  }, [])

  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      fetchWithdrawals(newPage)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      fetchWithdrawals(newPage)
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      fetchWithdrawals(page)
    }
  }

  // Function to handle userId click - navigate to user details page using userId
  const handleUserIdClick = async (userId) => {
    if (!userId) {
      alert("User ID is required")
      return
    }

    try {
      // Store the userId in sessionStorage for the user details page
      sessionStorage.setItem("selectedUserId", userId)

      // Navigate directly to the user details page with the userId
      navigate(`/user-game-details/${encodeURIComponent(userId)}`)
    } catch (error) {
      console.error("Error navigating to user details:", error)
      alert("Error navigating to user details. Please try again.")
    }
  }

  const openApproveModal = (id) => {
    setSelectedWithdrawalId(id)
    setShowApproveModal(true)
  }

  const openRejectModal = (id) => {
    setSelectedWithdrawalId(id)
    setRejectionReason("")
    setShowRejectModal(true)
  }

  async function handleApprove() {
    try {
      await postData(APPROVE_WITHDRAW, { requestId: selectedWithdrawalId })
      setShowApproveModal(false)
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 2500)
      await fetchWithdrawals(currentPage)
    } catch (error) {
      console.error("Error approving withdrawal:", error)
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) return

    try {
      await postData(REJECT_WITHDRAW, {
        requestId: selectedWithdrawalId,
        reason: rejectionReason,
      })
      setShowRejectModal(false)
      await fetchWithdrawals(currentPage)
    } catch (error) {
      console.error("Error rejecting withdrawal:", error)
    }
  }

  const downloadPendingExcel = async () => {
    try {
      // Fetch all pending withdrawals with a high limit
      const response = await getData(
        `${GET_ALL_WITHDRAWALS}?status=pending&page=1&limit=1000000000000000000000000000000`,
      )
      const allPending = response?.withdrawals || []

      if (!allPending.length) {
        alert("No data to export")
        return
      }

      const formattedData = allPending.map((withdrawal) => ({
        UserId: withdrawal.userId || "N/A",
        UserName: withdrawal.username || "N/A",
        Network: withdrawal.token || "N/A",
        Initiated: withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleString() : "N/A",
        Amount: withdrawal.amount || 0,
        Charge: withdrawal.charge || 0,
        USDT_Amount: withdrawal.USDT_Amount || 0,
        After_Charge: withdrawal.After_Charge || 0,
        Status: withdrawal.status || "N/A",
      }))

      const ws = XLSX.utils.json_to_sheet(formattedData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "PendingWithdrawals")

      XLSX.writeFile(wb, "pending_withdrawals.xlsx")
    } catch (error) {
      alert("Failed to export pending withdrawals. Please try again.")
      console.error("Error exporting pending withdrawals:", error)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <CCard className="mb-4 shadow-lg">
        <CCardHeader style={{ backgroundColor: "#00B5E2", color: "white" }} className="text-center">
          <h5 className="fw-bold">Pending Withdrawals</h5>
        </CCardHeader>

        <CCardBody>
          <div className="d-flex justify-content-end mb-3">
            <CButton
              style={{
                backgroundColor: "#00B5E2",
                borderColor: "#00B5E2",
                color: "black",
              }}
              onClick={downloadPendingExcel}
            >
              EXPORT AS EXCEL
            </CButton>
          </div>

          <CRow>
            <div className="container">
              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle">
                  <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
                    <tr>
                      <th>S.No</th>
                      <th>User ID</th>
                      <th>User Name</th>
                      <th>Network</th>
                      <th>Initiated</th>
                      <th>Amount</th>
                      <th>Charge</th>
                      <th>USDT_Amount</th>
                      <th>After Charge</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.length > 0 ? (
                      withdrawals.map((withdrawal, index) => (
                        <tr key={withdrawal._id} className="table-light">
                          <td className="fw-bold">{(currentPage - 1) * withdrawalsPerPage + index + 1}</td>
                          <td>
                            <span
                              className="text-primary"
                              style={{ cursor: "pointer", textDecoration: "underline" }}
                              onClick={() => handleUserIdClick(withdrawal.userId || withdrawal._id)}
                            >
                              {withdrawal.userId || withdrawal._id || "N/A"}
                            </span>
                          </td>
                          <td>{withdrawal.username || "N/A"}</td>
                          <td>{withdrawal.token || "N/A"}</td>
                          <td>{new Date(withdrawal.createdAt).toLocaleString() || "N/A"}</td>
                          <td>{withdrawal.amount || 0}</td>
                          <td>{withdrawal.charge || 0}</td>
                          <td>{withdrawal.USDT_Amount || 0}</td>
                          <td>{withdrawal.After_Charge || 0}</td>
                          <td>
                            <CBadge color="warning">Pending</CBadge>
                          </td>
                          <td>
                            <CButton
                              style={{
                                backgroundColor: "#00B5E2",
                                borderColor: "#00B5E2",
                                color: "white",
                              }}
                              size="sm"
                              className="me-2"
                              onClick={() => openApproveModal(withdrawal._id)}
                            >
                              Approve
                            </CButton>
                            <CButton color="danger" size="sm" onClick={() => openRejectModal(withdrawal._id)}>
                              Reject
                            </CButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="text-center text-muted fw-bold py-3">
                          No pending withdrawals available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination - Same structure as other pages */}
              <div className="d-flex justify-content-center mt-3">
                <nav aria-label="Page navigation">
                  <div className="d-flex align-items-center gap-1 p-2 bg-white rounded shadow-sm border">
                    <button
                      className={`btn d-flex align-items-center justify-content-center ${
                        currentPage === 1 ? "text-muted border-0 bg-light" : "text-white border-0"
                      }`}
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: currentPage === 1 ? "#f8f9fa" : "#00BFFF",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      }}
                      disabled={currentPage === 1}
                      onClick={prevPage}
                    >
                      &#8249;
                    </button>

                    {(() => {
                      const pages = []
                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(
                            <button
                              key={i}
                              className={`btn d-flex align-items-center justify-content-center border-0 ${
                                currentPage === i ? "text-white" : "text-dark bg-light hover-bg-gray"
                              }`}
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: currentPage === i ? "#00BFFF" : "#f8f9fa",
                                fontWeight: currentPage === i ? "bold" : "normal",
                              }}
                              onClick={() => goToPage(i)}
                            >
                              {i}
                            </button>,
                          )
                        }
                      }
                      return pages
                    })()}

                    <button
                      className={`btn d-flex align-items-center justify-content-center ${
                        currentPage >= totalPages ? "text-muted border-0 bg-light" : "text-white border-0"
                      }`}
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: currentPage >= totalPages ? "#f8f9fa" : "#00BFFF",
                        cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                      }}
                      disabled={currentPage >= totalPages}
                      onClick={nextPage}
                    >
                      &#8250;
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Approve Confirmation Modal */}
      <CModal
        visible={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        alignment="center"
        backdrop="static"
      >
        <CModalHeader closeButton style={{ backgroundColor: "#00B5E2", color: "white" }}>
          <h5 className="m-0">Confirm Approval</h5>
        </CModalHeader>
        <CModalBody className="py-4">
          <p className="mb-0">Are you sure you want to approve this withdrawal?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </CButton>
          <CButton style={{ backgroundColor: "#00B5E2", borderColor: "#00B5E2" }} onClick={handleApprove}>
            Approve
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Reject Modal */}
      <CModal visible={showRejectModal} onClose={() => setShowRejectModal(false)} alignment="center" backdrop="static">
        <CModalHeader closeButton style={{ backgroundColor: "#dc3545", color: "white" }}>
          <h5 className="m-0">Reject Withdrawal</h5>
        </CModalHeader>
        <CModalBody className="py-4">
          <p className="mb-3">Please provide a reason for rejection:</p>
          <CFormInput
            type="text"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection"
            autoFocus
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleReject} disabled={!rejectionReason.trim()}>
            Reject
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Success Modal */}
      <CModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        alignment="center"
        backdrop="static"
      >
        <CModalHeader style={{ backgroundColor: "#28a745", color: "white" }}>
          <h5 className="m-0">Success</h5>
        </CModalHeader>
        <CModalBody className="py-4 text-center">✅ Withdrawal approved successfully!</CModalBody>
        <CModalFooter>
          <CButton
            style={{
              backgroundColor: "#28a745",
              borderColor: "#28a745",
              color: "white",
            }}
            onClick={() => setShowSuccessModal(false)}
          >
            Okay
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default PendingWithdrawals
