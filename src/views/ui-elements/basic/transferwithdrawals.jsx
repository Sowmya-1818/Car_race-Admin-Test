// "use client"

// import { useState, useEffect } from "react"
// import { CRow, CCard, CCardHeader, CCardBody, CButton, CAlert } from "@coreui/react"
// import { getData } from "../../../apiConfigs/apiCalls"
// import { GET_ALL_WITHDRAWALS } from "../../../apiConfigs/endpoints"
// import { useNavigate } from "react-router-dom"
// import * as XLSX from "xlsx"

// const TransferWithdrawals = () => {
//   const navigate = useNavigate()
//   const [withdrawals, setWithdrawals] = useState([])
//   const [error, setError] = useState(null)
//   const [success, setSuccess] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [totalCount, setTotalCount] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const withdrawalsPerPage = 10

//   const fetchWithdrawals = async (page = 1) => {
//     try {
//       setLoading(true)
//       // Use the backend's status filter for transferred withdrawals
//       const response = await getData(
//         `${GET_ALL_WITHDRAWALS}?status=transferred&page=${page}&limit=${withdrawalsPerPage}`,
//       )
//       console.log("Withdrawals fetched:", response)

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
//       // Fetch all transfer withdrawals with a high limit
//       const response = await getData(`${GET_ALL_WITHDRAWALS}?status=transferred&page=1&limit=1000000000000000000000000000000000000`)
//       const allTransfers = response?.withdrawals || []

//       if (!allTransfers.length) {
//         alert("No data to export")
//         return
//       }

//       const worksheet = XLSX.utils.json_to_sheet(
//         allTransfers.map((withdrawal) => ({
//           UserName: withdrawal.username || "N/A",
//           Amount: withdrawal.amount || 0,
//           Token_Amount: withdrawal.Token_Amount || 0,
//           USDT_Amount: withdrawal.USDT_Amount || 0,
//           Fee_Tokens: withdrawal.Fee_tokens || 0,
//           Charge: withdrawal.charge || 0,
//           Token: withdrawal.token || 0,
//           WalletAddress: withdrawal.walletAddress || "N/A",
//           // Hash: withdrawal.hash || "N/A",
//           "Created At": withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleString() : "N/A",
//           "Updated At": withdrawal.updatedAt ? new Date(withdrawal.updatedAt).toLocaleString() : "N/A",
//           Status: withdrawal.status || "N/A",
//         })),
//       )

//       const workbook = XLSX.utils.book_new()
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Transfer Withdrawals")
//       XLSX.writeFile(workbook, "transfer_withdrawals.xlsx")
//     } catch (error) {
//       alert("Failed to export transfer withdrawals. Please try again.")
//       console.error("Error exporting transfer withdrawals:", error)
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
//         <h5 className="fw-bold">Transfer Withdrawals</h5>
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

//         {/* Table */}
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
//                     {/* <th>Hash</th> */}
//                     <th>Created At</th>
//                     <th>Updated At</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {withdrawals.length > 0 ? (
//                     withdrawals.map((withdrawal, index) => {
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
//                           {/* <td>
//                             {withdrawal.hash ? (
//                               <span className="text-truncate" style={{ maxWidth: "100px", display: "inline-block" }}>
//                                 {withdrawal.hash}
//                               </span>
//                             ) : (
//                               "N/A"
//                             )}
//                           </td> */}
//                           <td>{new Date(withdrawal.createdAt).toLocaleString() || "N/A"}</td>
//                           <td>{new Date(withdrawal.updatedAt).toLocaleString() || "N/A"}</td>
//                           <td>
//                             <span className="badge bg-secondary">Transferred</span>
//                           </td>
//                         </tr>
//                       )
//                     })
//                   ) : (
//                     <tr>
//                       <td colSpan="14" className="text-center text-muted fw-bold py-3">
//                         No transfer withdrawals available
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

// export default TransferWithdrawals


"use client";

import { useState, useEffect } from "react";
import {
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CAlert,
} from "@coreui/react";
import { getData } from "../../../apiConfigs/apiCalls";
import { GET_ALL_WITHDRAWALS } from "../../../apiConfigs/endpoints";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const TransferWithdrawals = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const withdrawalsPerPage = 10;

  const fetchWithdrawals = async (page = 1) => {
    try {
      setLoading(true);
      // Use the backend's status filter for transferred withdrawals
      const response = await getData(
        `${GET_ALL_WITHDRAWALS}?status=transferred&page=${page}&limit=${withdrawalsPerPage}`
      );
      console.log("Withdrawals fetched:", response);

      if (response?.withdrawals) {
        setWithdrawals(response.withdrawals);
        setTotalCount(response.count || 0);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(page);
      } else {
        setWithdrawals([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      setError(error.message);
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(currentPage);
  }, []);

  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchWithdrawals(newPage);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchWithdrawals(newPage);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchWithdrawals(page);
    }
  };

  // Function to handle userId click - navigate to user details page using userId
  const handleUserIdClick = async (userId) => {
    if (!userId) {
      alert("User ID is required");
      return;
    }

    try {
      // Store the userId in sessionStorage for the user details page
      sessionStorage.setItem("selectedUserId", userId);

      // Navigate directly to the user details page with the userId
      navigate(`/user-game-details/${encodeURIComponent(userId)}`);
    } catch (error) {
      console.error("Error navigating to user details:", error);
      alert("Error navigating to user details. Please try again.");
    }
  };

  // Export to Excel
  const downloadExcel = async () => {
    try {
      // Fetch all transfer withdrawals with a high limit
      const response = await getData(
        `${GET_ALL_WITHDRAWALS}?status=transferred&page=1&limit=1000000000000000000000000000000000000`
      );
      const allTransfers = response?.withdrawals || [];

      if (!allTransfers.length) {
        alert("No data to export");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(
        allTransfers.map((withdrawal) => ({
          UserId: withdrawal.userId || "N/A",
          UserName: withdrawal.username || "N/A",
          WalletAddress: withdrawal.walletAddress || "N/A",
          Amount: withdrawal.amount || 0,
          USDT_Amount: withdrawal.USDT_Amount || 0,
          Charge: withdrawal.charge || 0,
          After_Charge: withdrawal.After_Charge || 0,
          Token_Amount: withdrawal.Token_Amount || 0,
          Fee_Tokens: withdrawal.Fee_tokens || 0,
          Token: withdrawal.token || 0,
          // Hash: withdrawal.hash || "N/A",
          "Created At": withdrawal.createdAt || "N/A",
          "Updated At": withdrawal.updatedAt || "N/A",
          Status: withdrawal.status || "N/A",
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transfer Withdrawals");
      XLSX.writeFile(workbook, "transfer_withdrawals.xlsx");
    } catch (error) {
      alert("Failed to export transfer withdrawals. Please try again.");
      console.error("Error exporting transfer withdrawals:", error);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
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
        <h5 className="fw-bold">Transfer Withdrawals</h5>
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

        {/* Table */}
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
                    {/* <th>Hash</th> */}
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal, index) => {
                      return (
                        <tr key={withdrawal._id} className="table-light">
                          <td className="fw-bold">
                            {(currentPage - 1) * withdrawalsPerPage + index + 1}
                          </td>
                          <td>
                            <span
                              className="text-primary"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() =>
                                handleUserIdClick(
                                  withdrawal.userId || withdrawal._id
                                )
                              }
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
                          {/* <td>
                            {withdrawal.hash ? (
                              <span className="text-truncate" style={{ maxWidth: "100px", display: "inline-block" }}>
                                {withdrawal.hash}
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </td> */}
                          <td>{withdrawal.createdAt||"N/A"}</td>
                          <td>{withdrawal.updatedAt ||"N/A"}</td>
                          <td>
                            <span className="badge bg-secondary">
                              Transferred
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="15"
                        className="text-center text-muted fw-bold py-3"
                      >
                        No transfer withdrawals available
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
                  {/* Previous Button */}
                  <button
                    className={`btn d-flex align-items-center justify-content-center ${
                      currentPage === 1
                        ? "text-muted border-0 bg-light"
                        : "text-white border-0"
                    }`}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor:
                        currentPage === 1 ? "#f8f9fa" : "#00BFFF",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                    disabled={currentPage === 1}
                    onClick={prevPage}
                  >
                    &#8249;
                  </button>

                  {/* Page Numbers */}
                  {(() => {
                    const pages = [];

                    if (totalPages <= 7) {
                      // Show all pages if 7 or fewer
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(
                          <button
                            key={i}
                            className={`btn d-flex align-items-center justify-content-center border-0 ${
                              currentPage === i
                                ? "text-white"
                                : "text-dark bg-light hover-bg-gray"
                            }`}
                            style={{
                              width: "40px",
                              height: "40px",
                              backgroundColor:
                                currentPage === i ? "#00BFFF" : "#f8f9fa",
                              fontWeight: currentPage === i ? "bold" : "normal",
                            }}
                            onClick={() => goToPage(i)}
                          >
                            {i}
                          </button>
                        );
                      }
                    } else {
                      // Complex pagination logic for many pages
                      if (currentPage <= 3) {
                        // Show first 3 pages, ellipsis, last page
                        for (let i = 1; i <= 3; i++) {
                          pages.push(
                            <button
                              key={i}
                              className={`btn d-flex align-items-center justify-content-center border-0 ${
                                currentPage === i
                                  ? "text-white"
                                  : "text-dark bg-light hover-bg-gray"
                              }`}
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor:
                                  currentPage === i ? "#00BFFF" : "#f8f9fa",
                                fontWeight:
                                  currentPage === i ? "bold" : "normal",
                              }}
                              onClick={() => goToPage(i)}
                            >
                              {i}
                            </button>
                          );
                        }
                        if (totalPages > 4) {
                          pages.push(
                            <span
                              key="ellipsis1"
                              className="d-flex align-items-center px-2 text-muted"
                            >
                              ...
                            </span>
                          );
                          pages.push(
                            <button
                              key={totalPages}
                              className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
                              style={{ width: "40px", height: "40px" }}
                              onClick={() => goToPage(totalPages)}
                            >
                              {totalPages}
                            </button>
                          );
                        }
                      } else if (currentPage >= totalPages - 2) {
                        // Show first page, ellipsis, last 3 pages
                        pages.push(
                          <button
                            key={1}
                            className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
                            style={{ width: "40px", height: "40px" }}
                            onClick={() => goToPage(1)}
                          >
                            1
                          </button>
                        );
                        pages.push(
                          <span
                            key="ellipsis2"
                            className="d-flex align-items-center px-2 text-muted"
                          >
                            ...
                          </span>
                        );
                        for (let i = totalPages - 2; i <= totalPages; i++) {
                          pages.push(
                            <button
                              key={i}
                              className={`btn d-flex align-items-center justify-content-center border-0 ${
                                currentPage === i
                                  ? "text-white"
                                  : "text-dark bg-light hover-bg-gray"
                              }`}
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor:
                                  currentPage === i ? "#00BFFF" : "#f8f9fa",
                                fontWeight:
                                  currentPage === i ? "bold" : "normal",
                              }}
                              onClick={() => goToPage(i)}
                            >
                              {i}
                            </button>
                          );
                        }
                      } else {
                        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
                        pages.push(
                          <button
                            key={1}
                            className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                            onClick={() => goToPage(1)}
                          >
                            1
                          </button>
                        );
                        pages.push(
                          <span
                            key="ellipsis3"
                            className="d-flex align-items-center px-2 text-muted"
                          >
                            ...
                          </span>
                        );
                        for (
                          let i = currentPage - 1;
                          i <= currentPage + 1;
                          i++
                        ) {
                          pages.push(
                            <button
                              key={i}
                              className={`btn d-flex align-items-center justify-content-center border-0 ${
                                currentPage === i
                                  ? "text-white"
                                  : "text-dark bg-light hover-bg-gray"
                              }`}
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor:
                                  currentPage === i ? "#00BFFF" : "#f8f9fa",
                                fontWeight:
                                  currentPage === i ? "bold" : "normal",
                              }}
                              onClick={() => goToPage(i)}
                            >
                              {i}
                            </button>
                          );
                        }
                        pages.push(
                          <span
                            key="ellipsis4"
                            className="d-flex align-items-center px-2 text-muted"
                          >
                            ...
                          </span>
                        );
                        pages.push(
                          <button
                            key={totalPages}
                            className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
                            style={{ width: "40px", height: "40px" }}
                            onClick={() => goToPage(totalPages)}
                          >
                            {totalPages}
                          </button>
                        );
                      }
                    }

                    return pages;
                  })()}

                  {/* Next Button */}
                  <button
                    className={`btn d-flex align-items-center justify-content-center ${
                      currentPage >= totalPages
                        ? "text-muted border-0 bg-light"
                        : "text-white border-0"
                    }`}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor:
                        currentPage >= totalPages ? "#f8f9fa" : "#00BFFF",
                      cursor:
                        currentPage >= totalPages ? "not-allowed" : "pointer",
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
  );
};

export default TransferWithdrawals;
