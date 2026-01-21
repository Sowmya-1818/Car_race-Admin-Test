// "use client"

// import { useState, useEffect } from "react"
// import { CRow, CCard, CCardHeader, CCardBody, CButton, CAlert } from "@coreui/react"
// import { getData, postData } from "../../../apiConfigs/apiCalls"
// import { GET_ALL_WITHDRAWALS, GET_WITHDRAWAL_METHODS } from "../../../apiConfigs/endpoints"
// import { useNavigate } from "react-router-dom"
// import * as XLSX from "xlsx"
// import { TonConnectButton, useTonWallet, useTonConnectUI } from "@tonconnect/ui-react"
// import { toast } from "react-hot-toast"

// const ApprovedWithdrawals = () => {
//   const navigate = useNavigate()
//   const [withdrawals, setWithdrawals] = useState([])
//   const [error, setError] = useState(null)
//   const [success, setSuccess] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [totalCount, setTotalCount] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [selectedRows, setSelectedRows] = useState([])
//   const [selectAllChecked, setSelectAllChecked] = useState(false)

//   const withdrawalsPerPage = 10

//   const wallet = useTonWallet()
//   const [tonConnectUI] = useTonConnectUI()

//   const feeWallet = import.meta.env.VITE_FEE_WALLET
//   console.log("Fee Wallet from env:", feeWallet)

//   const fetchWithdrawals = async (page = 1) => {
//     try {
//       setLoading(true)
//       // Use the backend's status filter for approved withdrawals
//       const response = await getData(`${GET_ALL_WITHDRAWALS}?status=approved&page=${page}&limit=${withdrawalsPerPage}`)
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
//       setError(error.message)
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

//   // Export to Excel
//   const downloadExcel = async () => {
//     try {
//       // Fetch all approved withdrawals with a high limit
//       const response = await getData(`${GET_ALL_WITHDRAWALS}?status=approved&page=1&limit=10000000000000000000000000000000000`)
//       const allApproved = response?.withdrawals || []

//       if (!allApproved.length) {
//         alert("No data to export")
//         return
//       }

//       const worksheet = XLSX.utils.json_to_sheet(
//         allApproved.map((withdrawal) => ({
//           UserName: withdrawal.username || "N/A",
//           Amount: withdrawal.amount || 0,
//           Token_Amount: withdrawal.Token_Amount || 0,
//           USDT_Amount: withdrawal.USDT_Amount || 0,
//           Fee_Tokens: withdrawal.Fee_tokens || 0,
//           Charge: withdrawal.charge || 0,
//           Token: withdrawal.token || 0,
//           WalletAddress: withdrawal.walletAddress || "N/A",
//           "Created At": withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleString() : "N/A",
//           "Updated At": withdrawal.updatedAt ? new Date(withdrawal.updatedAt).toLocaleString() : "N/A",
//           Status: withdrawal.status || "N/A",
//         }))
//       )

//       const workbook = XLSX.utils.book_new()
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Withdrawals")
//       XLSX.writeFile(workbook, "approved_withdrawals.xlsx")
//     } catch (error) {
//       alert("Failed to export approved withdrawals. Please try again.")
//       console.error("Error exporting approved withdrawals:", error)
//     }
//   }

//   // Checkbox toggle handlers
//   const handleRowSelect = (withdrawal) => {
//     setSelectedRows((prevSelected) => {
//       const exists = prevSelected.find((w) => w._id === withdrawal._id)
//       if (exists) {
//         return prevSelected.filter((w) => w._id !== withdrawal._id)
//       } else {
//         return [...prevSelected, withdrawal]
//       }
//     })
//   }

//   const handleSelectAll = () => {
//     if (selectAllChecked) {
//       setSelectedRows([])
//     } else {
//       setSelectedRows(withdrawals)
//     }
//     setSelectAllChecked(!selectAllChecked)
//   }

//   // Sync "Select All" checkbox with selectedRows and withdrawals
//   useEffect(() => {
//     if (withdrawals.length > 0 && selectedRows.length === withdrawals.length) {
//       setSelectAllChecked(true)
//     } else {
//       setSelectAllChecked(false)
//     }
//   }, [selectedRows, withdrawals])

//   // Approve button logic with TON wallet
//   const handleSubmit = async (event) => {
//     event.preventDefault()

//     if (selectedRows.length < 1) {
//       toast.error("Please select at least one withdrawal to approve.")
//       return
//     }

//     try {
//       const messages = []

//       selectedRows.forEach((row) => {
//         messages.push({
//           address: row.walletAddress,
//           amount: Math.round(row.Token_Amount * 1e9),
//         })

//         messages.push({
//           address: feeWallet,
//           amount: Math.round(row.Fee_tokens * 1e9),
//         })
//       })

//       const myTransaction = {
//         validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
//         messages,
//       }

//       const result = await tonConnectUI.sendTransaction(myTransaction)

//       if (result) {
//         console.log("transaction", result)

//         const responseData = {
//           hash: result.boc,
//           _id: selectedRows,
//         }

//         console.log("responseData", responseData)

//         try {
//           const response = await postData(GET_WITHDRAWAL_METHODS, responseData)
//           console.log("Response from postData:", response)
//           toast.success("Task updated successfully!")
//           // Refresh the data after successful transfer
//           await fetchWithdrawals(currentPage)
//           setSelectedRows([])
//         } catch (error) {
//           setError(error.message || "Something went wrong.")
//           toast.error(error.message || "Something went wrong.")
//         }
//       }
//     } catch (error) {
//       console.error("Transaction failed:", error)
//       toast.error("An error occurred during the transaction.")
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
//     <CCard className="mb-4 shadow-lg">
//       <CCardHeader
//         style={{
//           backgroundColor: "#00B5E2",
//           color: "white",
//         }}
//         className="text-center"
//       >
//         <h5 className="fw-bold">Approved Withdrawals</h5>
//       </CCardHeader>
//       <CCardBody>
//         {/* Alerts */}
//         {success && (
//           <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
//             {success}
//           </CAlert>
//         )}
//         {error && (
//           <CAlert color="danger" dismissible onClose={() => setError(null)}>
//             {error}
//           </CAlert>
//         )}

//         {/* Wallet connect + Approve button */}
//         <div className="d-flex justify-content-end align-items-center mb-3">
//           <TonConnectButton />
//           {wallet && (
//             <CButton
//               color="success"
//               style={{
//                 marginLeft: "10px",
//                 backgroundColor: "#22c55e",
//                 borderColor: "#22c55e",
//                 color: "white",
//               }}
//               onClick={handleSubmit}
//             >
//               Approve Selected
//             </CButton>
//           )}
//         </div>

//         {/* Export button */}
//         <div className="d-flex justify-content-end mb-3">
//           <CButton
//             style={{
//               backgroundColor: "#00B5E2",
//               borderColor: "#00B5E2",
//               color: "black",
//             }}
//             onClick={downloadExcel}
//           >
//             EXPORT AS EXCEL
//           </CButton>
//         </div>

//         {/* Table with checkboxes */}
//         <CRow>
//           <div className="container">
//             <div className="table-responsive">
//               <table className="table table-bordered table-hover text-center align-middle">
//                 <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
//                   <tr>
//                     <th>S.No</th>
//                     <th>User Name</th>
//                     <th>walletAddress</th>
//                     <th>Amount</th>
//                     <th>USDT_Amount</th>
//                     <th>Charge</th>
//                     <th>After Charge</th>
//                     <th>Token_Amount</th>
//                     <th>Fee_tokens</th>
//                     <th>Token</th>
//                     <th>Created At</th>
//                     <th>Updated At</th>
//                     <th>Status</th>
//                     <th>
//                       <input type="checkbox" checked={selectAllChecked} onChange={handleSelectAll} />
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {withdrawals.length > 0 ? (
//                     withdrawals.map((withdrawal, index) => {
//                       const isChecked = selectedRows.some((w) => w._id === withdrawal._id)
//                       return (
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
//                           <td>{withdrawal.walletAddress || "N/A"}</td>
//                           <td>{withdrawal.amount || 0}</td>
//                           <td>{withdrawal.USDT_Amount || 0}</td>
//                           <td>{withdrawal.charge || 0}</td>
//                           <td>{withdrawal.After_Charge || 0}</td>
//                           <td>{withdrawal.Token_Amount || 0}</td>
//                           <td>{withdrawal.Fee_tokens || 0}</td>
//                           <td>{withdrawal.token || 0}</td>
//                           <td>{new Date(withdrawal.createdAt).toLocaleString() || "N/A"}</td>
//                           <td>{new Date(withdrawal.updatedAt).toLocaleString() || "N/A"}</td>
//                           <td>
//                             <span className="badge bg-success">Approved</span>
//                           </td>
//                           <td>
//                             <input type="checkbox" checked={isChecked} onChange={() => handleRowSelect(withdrawal)} />
//                           </td>
//                         </tr>
//                       )
//                     })
//                   ) : (
//                     <tr>
//                       <td colSpan="14" className="text-center text-muted fw-bold py-3">
//                         No approved withdrawals available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="d-flex justify-content-center mt-3">
//               <nav aria-label="Page navigation">
//                 <div className="d-flex align-items-center gap-1 p-2 bg-white rounded shadow-sm border">
//                   <button
//                     className={`btn d-flex align-items-center justify-content-center ${
//                       currentPage === 1 ? "text-muted border-0 bg-light" : "text-white border-0"
//                     }`}
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       backgroundColor: currentPage === 1 ? "#f8f9fa" : "#00BFFF",
//                       cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                     }}
//                     disabled={currentPage === 1}
//                     onClick={prevPage}
//                   >
//                     &#8249;
//                   </button>

//                   {(() => {
//                     const pages = []
//                     if (totalPages <= 7) {
//                       for (let i = 1; i <= totalPages; i++) {
//                         pages.push(
//                           <button
//                             key={i}
//                             className={`btn d-flex align-items-center justify-content-center border-0 ${
//                               currentPage === i ? "text-white" : "text-dark bg-light hover-bg-gray"
//                             }`}
//                             style={{
//                               width: "40px",
//                               height: "40px",
//                               backgroundColor: currentPage === i ? "#00BFFF" : "#f8f9fa",
//                               fontWeight: currentPage === i ? "bold" : "normal",
//                             }}
//                             onClick={() => goToPage(i)}
//                           >
//                             {i}
//                           </button>,
//                         )
//                       }
//                     }
//                     return pages
//                   })()}

//                   <button
//                     className={`btn d-flex align-items-center justify-content-center ${
//                       currentPage >= totalPages ? "text-muted border-0 bg-light" : "text-white border-0"
//                     }`}
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       backgroundColor: currentPage >= totalPages ? "#f8f9fa" : "#00BFFF",
//                       cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
//                     }}
//                     disabled={currentPage >= totalPages}
//                     onClick={nextPage}
//                   >
//                     &#8250;
//                   </button>
//                 </div>
//               </nav>
//             </div>
//           </div>
//         </CRow>
//       </CCardBody>
//     </CCard>
//   )
// }

// export default ApprovedWithdrawals


"use client"

import { useState, useEffect } from "react"
import { CRow, CCard, CCardHeader, CCardBody, CButton, CAlert } from "@coreui/react"
import { getData, postData } from "../../../apiConfigs/apiCalls"
import { GET_ALL_WITHDRAWALS, GET_WITHDRAWAL_METHODS } from "../../../apiConfigs/endpoints"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"
import { TonConnectButton, useTonWallet, useTonConnectUI } from "@tonconnect/ui-react"
import { toast } from "react-hot-toast"

const ApprovedWithdrawals = () => {
  const navigate = useNavigate()
  const [withdrawals, setWithdrawals] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectAllChecked, setSelectAllChecked] = useState(false)

  const withdrawalsPerPage = 10

  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()

  const feeWallet = import.meta.env.VITE_FEE_WALLET
  console.log("Fee Wallet from env:", feeWallet)

  const fetchWithdrawals = async (page = 1) => {
    try {
      setLoading(true)
      // Use the backend's status filter for approved withdrawals
      const response = await getData(`${GET_ALL_WITHDRAWALS}?status=approved&page=${page}&limit=${withdrawalsPerPage}`)
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
      setError(error.message)
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

  // Export to Excel
  const downloadExcel = async () => {
    try {
      // Fetch all approved withdrawals with a high limit
      const response = await getData(
        `${GET_ALL_WITHDRAWALS}?status=approved&page=1&limit=10000000000000000000000000000000000`,
      )
      const allApproved = response?.withdrawals || []

      if (!allApproved.length) {
        alert("No data to export")
        return
      }

      const worksheet = XLSX.utils.json_to_sheet(
        allApproved.map((withdrawal) => ({
          UserId: withdrawal.userId || "N/A",
          UserName: withdrawal.username || "N/A",
          WalletAddress: withdrawal.walletAddress || "N/A",
          Amount: withdrawal.amount || 0,
          USDT_Amount: withdrawal.USDT_Amount || 0,
          Charge: withdrawal.charge || 0,
          AfterCharge: withdrawal.After_Charge || 0,
          Token_Amount: withdrawal.Token_Amount || 0,
          Fee_Tokens: withdrawal.Fee_tokens || 0,
          Token: withdrawal.token || 0,
          "Created At": withdrawal.createdAt || "N/A",
          "Updated At": withdrawal.updatedAt || "N/A",
          Status: withdrawal.status || "N/A",
        })),
      )

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Withdrawals")
      XLSX.writeFile(workbook, "approved_withdrawals.xlsx")
    } catch (error) {
      alert("Failed to export approved withdrawals. Please try again.")
      console.error("Error exporting approved withdrawals:", error)
    }
  }

  // Checkbox toggle handlers
  const handleRowSelect = (withdrawal) => {
    setSelectedRows((prevSelected) => {
      const exists = prevSelected.find((w) => w._id === withdrawal._id)
      if (exists) {
        return prevSelected.filter((w) => w._id !== withdrawal._id)
      } else {
        return [...prevSelected, withdrawal]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedRows([])
    } else {
      setSelectedRows(withdrawals)
    }
    setSelectAllChecked(!selectAllChecked)
  }

  // Sync "Select All" checkbox with selectedRows and withdrawals
  useEffect(() => {
    if (withdrawals.length > 0 && selectedRows.length === withdrawals.length) {
      setSelectAllChecked(true)
    } else {
      setSelectAllChecked(false)
    }
  }, [selectedRows, withdrawals])

  // Approve button logic with TON wallet
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (selectedRows.length < 1) {
      toast.error("Please select at least one withdrawal to approve.")
      return
    }

    try {
      const messages = []

      selectedRows.forEach((row) => {
        messages.push({
          address: row.walletAddress,
          amount: Math.round(row.Token_Amount * 1e9),
        })

        messages.push({
          address: feeWallet,
          amount: Math.round(row.Fee_tokens * 1e9),
        })
      })

      const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages,
      }

      const result = await tonConnectUI.sendTransaction(myTransaction)

      if (result) {
        console.log("transaction", result)

        const responseData = {
          hash: result.boc,
          _id: selectedRows,
        }

        console.log("responseData", responseData)

        try {
          const response = await postData(GET_WITHDRAWAL_METHODS, responseData)
          console.log("Response from postData:", response)
          toast.success("Task updated successfully!")
          // Refresh the data after successful transfer
          await fetchWithdrawals(currentPage)
          setSelectedRows([])
        } catch (error) {
          setError(error.message || "Something went wrong.")
          toast.error(error.message || "Something went wrong.")
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error)
      toast.error("An error occurred during the transaction.")
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
    <CCard className="mb-4 shadow-lg">
      <CCardHeader
        style={{
          backgroundColor: "#00B5E2",
          color: "white",
        }}
        className="text-center"
      >
        <h5 className="fw-bold">Approved Withdrawals</h5>
      </CCardHeader>
      <CCardBody>
        {/* Alerts */}
        {success && (
          <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
            {success}
          </CAlert>
        )}
        {error && (
          <CAlert color="danger" dismissible onClose={() => setError(null)}>
            {error}
          </CAlert>
        )}

        {/* Wallet connect + Approve button */}
        <div className="d-flex justify-content-end align-items-center mb-3">
          <TonConnectButton />
          {wallet && (
            <CButton
              color="success"
              style={{
                marginLeft: "10px",
                backgroundColor: "#22c55e",
                borderColor: "#22c55e",
                color: "white",
              }}
              onClick={handleSubmit}
            >
              Approve Selected
            </CButton>
          )}
        </div>

        {/* Export button */}
        <div className="d-flex justify-content-end mb-3">
          <CButton
            style={{
              backgroundColor: "#00B5E2",
              borderColor: "#00B5E2",
              color: "black",
            }}
            onClick={downloadExcel}
          >
            EXPORT AS EXCEL
          </CButton>
        </div>

        {/* Table with checkboxes */}
        <CRow>
          <div className="container">
            <div className="table-responsive">
              <table className="table table-bordered table-hover text-center align-middle">
                <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
                  <tr>
                    <th>S.No</th>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>walletAddress</th>
                    <th>Amount</th>
                    <th>USDT_Amount</th>
                    <th>Charge</th>
                    <th>After Charge</th>
                    <th>Token_Amount</th>
                    <th>Fee_tokens</th>
                    <th>Token</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Status</th>
                    <th>
                      <input type="checkbox" checked={selectAllChecked} onChange={handleSelectAll} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal, index) => {
                      const isChecked = selectedRows.some((w) => w._id === withdrawal._id)
                      return (
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
                          <td>{withdrawal.walletAddress || "N/A"}</td>
                          <td>{withdrawal.amount || 0}</td>
                          <td>{withdrawal.USDT_Amount || 0}</td>
                          <td>{withdrawal.charge || 0}</td>
                          <td>{withdrawal.After_Charge || 0}</td>
                          <td>{withdrawal.Token_Amount || 0}</td>
                          <td>{withdrawal.Fee_tokens || 0}</td>
                          <td>{withdrawal.token || 0}</td>
                          <td>{withdrawal.createdAt|| "N/A"}</td>
                          <td>{withdrawal.updatedAt || "N/A"}</td>
                          <td>
                            <span className="badge bg-success">Approved</span>
                          </td>
                          <td>
                            <input type="checkbox" checked={isChecked} onChange={() => handleRowSelect(withdrawal)} />
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="15" className="text-center text-muted fw-bold py-3">
                        No approved withdrawals available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
  )
}

export default ApprovedWithdrawals
