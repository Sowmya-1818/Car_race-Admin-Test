// "use client";

// import { useState, useEffect } from "react";
// import {
//   CRow,
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CButton,
//   CFormInput,
//   CFormSelect,
//   CAlert,
// } from "@coreui/react";
// import { getData } from "../../../apiConfigs/apiCalls";
// import { SEARCH } from "../../../apiConfigs/endpoints";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";

// const Gamehistory = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [historyType, setHistoryType] = useState("game");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [isExporting, setIsExporting] = useState(false);
//   const usersPerPage = 10;

//   const historyTypeOptions = [
//     { value: "game", label: "Game" },
//     { value: "task", label: "Task" },
//     { value: "ads", label: "Ads" },
//     { value: "dailyReward", label: "Daily Reward" },
//     { value: "referral", label: "Referral" },
//     { value: "withdrawal", label: "Withdrawal" },
//   ];

//   // Function to sort data by createdAt (newest first)
//   const sortDataByDate = (data) => {
//     return data.sort((a, b) => {
//       const dateA = new Date(
//         a.createdAt ||
//           a.CompletionTime ||
//           a.completionTime ||
//           a.claimedAt ||
//           a.CompletedAt ||
//           a.initiated ||
//           0
//       );
//       const dateB = new Date(
//         b.createdAt ||
//           b.CompletionTime ||
//           b.completionTime ||
//           b.claimedAt ||
//           b.CompletedAt ||
//           b.initiated ||
//           0
//       );
//       return dateB - dateA; // Descending order (newest first)
//     });
//   };

//   // Function to fetch ALL data for export (without pagination)
// const fetchAllDataForExport = async () => {
//     try {
//       let typeParam = historyType
//       if (typeParam === "dailyReward") typeParam = "dailyreward"
//       if (typeParam === "game") typeParam = "gamehistory"
//       if (typeParam === "task") typeParam = "tasks"

//       // Prepare query params with high limit to get all data
//       const params = {
//         type: typeParam,
//         limit: 10000, // High limit to get all data
//       }
//       if (fromDate) params.fromDate = fromDate
//       if (toDate) params.toDate = toDate
//       if (searchTerm) {
//         if (typeParam === "referral") {
//           params.username = searchTerm // for referral, username is referringUser
//         } else {
//           params.username = searchTerm
//         }
//       }

//       // Add status filter for withdrawals to only get transferred ones
//       if (typeParam === "withdrawal") {
//         params.status = "transferred"
//       }

//       // Build query string
//       const queryString = Object.entries(params)
//         .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
//         .join("&")

//       const response = await getData(`${SEARCH}?${queryString}`)

//       let dataList = []
//       // Extract data based on type
//       if (typeParam === "gamehistory") {
//         dataList = response?.history || []
//       } else if (typeParam === "tasks") {
//         dataList = response?.tasks || []
//       } else if (typeParam === "ads") {
//         dataList = response?.ads || []
//       } else if (typeParam === "dailyreward") {
//         dataList = response?.rewards || []
//       } else if (typeParam === "referral") {
//         dataList = response?.data || []
//       } else if (typeParam === "withdrawal") {
//         dataList = response?.withdrawals || []
//       }

//       // Sort the data by createdAt (newest first)
//       return sortDataByDate(dataList)
//     } catch (error) {
//       console.error("Error fetching all data for export:", error)
//       throw error
//     }
//   }

//   // Fetch data for the selected history type using the SEARCH endpoint
//   const fetchData = async (paramsOverride = {}) => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       let response
//       let dataList = []
//       let typeParam = historyType
//       if (typeParam === "dailyReward") typeParam = "dailyreward"
//       if (typeParam === "game") typeParam = "gamehistory"
//       if (typeParam === "task") typeParam = "tasks"

//       // Prepare query params - use page 1 when history type changes
//       const params = {
//         type: typeParam,
//         page: paramsOverride.resetPage ? 1 : currentPage,
//         limit: usersPerPage,
//         ...paramsOverride,
//       }
//       if (fromDate) params.fromDate = fromDate
//       if (toDate) params.toDate = toDate
//       if (searchTerm) {
//         if (typeParam === "referral") {
//           params.username = searchTerm // for referral, username is referringUser
//         } else {
//           params.username = searchTerm
//         }
//       }

//       // Add status filter for withdrawals to only get transferred ones
//       if (typeParam === "withdrawal") {
//         params.status = "transferred"
//       }

//       // Build query string
//       const queryString = Object.entries(params)
//         .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
//         .join("&")

//       response = await getData(`${SEARCH}?${queryString}`)

//       // Extract data based on type
//       if (typeParam === "gamehistory") {
//         dataList = response?.history || []
//         setTotalPages(response?.totalPages || 1)
//         setTotalCount(response?.length || 0)
//       } else if (typeParam === "tasks") {
//         dataList = response?.tasks || []
//         setTotalPages(response?.totalPages || 1)
//         setTotalCount(response?.length || 0)
//       } else if (typeParam === "ads") {
//         dataList = response?.ads || []
//         setTotalPages(response?.totalPages || 1)
//         setTotalCount(response?.length || 0)
//       } else if (typeParam === "dailyreward") {
//         dataList = response?.rewards || []
//         setTotalPages(response?.totalPages || 1)
//         setTotalCount(response?.length || 0)
//       } else if (typeParam === "referral") {
//         dataList = response?.data || []
//         setTotalPages(response?.totalPages || 1)
//         setTotalCount(response?.length || response?.totalReferralsCount || 0)
//       } else if (typeParam === "withdrawal") {
//         dataList = response?.withdrawals || []
//         setTotalPages(response?.totalPages || 1)
//         setTotalCount(response?.length || 0)
//       }

//       // Sort the data by createdAt (newest first)
//       const sortedData = sortDataByDate(dataList)
//       setUsers(sortedData)
//       setFilteredUsers(sortedData)
//     } catch (error) {
//       console.error(`Error fetching ${historyType} data:`, error)
//       setError({
//         type: historyType,
//         message: `Unable to fetch ${historyType} data.`,
//         details: error.message || "Unknown error",
//       })
//       setUsers([])
//       setFilteredUsers([])
//       setTotalPages(1)
//       setTotalCount(0)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData({ resetPage: true })
//     // Reset search and date filters when history type changes
//     setSearchTerm("")
//     setFromDate("")
//     setToDate("")
//     // Reset current page to 1 when history type changes
//     setCurrentPage(1)
//   }, [historyType])

//   // Only fetch data when historyType or currentPage changes
//   useEffect(() => {
//     fetchData()
//   }, [historyType, currentPage])

//   // Update handleSearch to call fetchData with current filters
//   const handleSearch = () => {
//     setCurrentPage(1)
//     fetchData()
//   }

//   // Update handleFromDateChange and handleToDateChange to only set state
//   const handleFromDateChange = (e) => {
//     setFromDate(e.target.value)
//   }

//   const handleToDateChange = (e) => {
//     setToDate(e.target.value)
//   }

//   const handleRetry = () => {
//     fetchData()
//   }

//   const handleReset = () => {
//     setSearchTerm("")
//     setFromDate("")
//     setToDate("")
//     setCurrentPage(1)
//     fetchData()
//   }

//   const currentUsers = filteredUsers // Use backend-paginated data directly

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1)
//     }
//   }

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1)
//     }
//   }

//   // Fixed function to handle username click - navigate to user details page
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

//   // FIXED: Download Excel function - now fetches ALL data
//   const downloadExcel = async () => {
//     setIsExporting(true)

//     try {
//       // Fetch ALL data for export (not just paginated data)
//       const allData = await fetchAllDataForExport()

//       if (!allData || allData.length === 0) {
//         alert("No data to export")
//         return
//       }

//       let formattedData = []

//       if (historyType === "game") {
//         formattedData = allData.map((user, index) => ({
//           SNo: index + 1,
//           UserName: user.username || "N/A",
//           GameTitle: user.gameTitle || "N/A",
//           CreatedAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
//           UpdatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A",
//           InitialBalance: user.initialbalance || 0,
//           BetAmount: user.betAmount || 0,
//           Prize: user.winAmount || 0,
//           FinalBalance: user.finalbalance || 0,
//           PlayedStatus: user.playedStatus || "N/A",
//         }))
//       } else if (historyType === "task") {
//         formattedData = allData.map((task, index) => ({
//           SNo: index + 1,
//           UserName: task.username || "N/A",
//           Initiated: task.CompletionTime ? new Date(task.CompletionTime).toLocaleString() : "N/A",
//           InitialBalance: task.InitialBalance || 0,
//           RewardAmount: task.Rewardpoints || 0,
//           FinalBalance: task.FinalBalance || 0,
//           Status: task.Status || "Completed",
//         }))
//       } else if (historyType === "ads") {
//         formattedData = allData.map((ad, index) => ({
//           SNo: index + 1,
//           UserName: ad.username || "N/A",
//           Initiated: ad.CompletionTime ? new Date(ad.CompletionTime).toLocaleString() : "N/A",
//           InitialBalance: ad.InitialBalance || 0,
//           RewardPoints: ad.Rewardpoints || 0,
//           FinalBalance: ad.FinalBalance || 0,
//         }))
//       } else if (historyType === "dailyReward") {
//         formattedData = allData.map((claim, index) => ({
//           SNo: index + 1,
//           UserName: claim.username || "N/A",
//           Initiated: claim.claimedAt ? new Date(claim.claimedAt).toLocaleString() : "N/A",
//           InitialBalance: claim.initialBalance || 0,
//           RewardPoints: claim.rewardPoints || 0,
//           FinalBalance: claim.finalBalance || 0,
//           Status: claim.Status || "Claimed",
//         }))
//       } else if (historyType === "referral") {
//         formattedData = allData.map((referral, index) => ({
//           SNo: index + 1,
//           ReferringUser: referral.referringUser?.username || "N/A",
//           ReferredUser: referral.referredUser?.username || "N/A",
//           Initiated: referral.createdAt ? new Date(referral.createdAt).toLocaleString() : "N/A",
//           InitialBalance: referral.initialBalance || 0,
//           ReferralAmount: referral.referralamount || 0,
//           FinalBalance: referral.finalBalance || 0,
//         }))
//       } else if (historyType === "withdrawal") {
//         formattedData = allData.map((withdrawal, index) => ({
//           SNo: index + 1,
//           UserName: withdrawal.username || "N/A",
//           Initiated: withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleString() : "N/A",
//           Amount: withdrawal.withdrawalAmount || withdrawal.amount || 0,
//           Balance: withdrawal.USDT_Amount || 0,
//           Status: "Transferred",
//         }))
//       }

//       const ws = XLSX.utils.json_to_sheet(formattedData)
//       const wb = XLSX.utils.book_new()
//       XLSX.utils.book_append_sheet(wb, ws, `${historyType}History`)

//       const fileName = `${historyType}_history_${new Date().toISOString().split("T")[0]}.xlsx`
//       XLSX.writeFile(wb, fileName)

//       // Show success message with record count
//       // alert(`Successfully exported ${formattedData.length} records to Excel!`)
//     } catch (error) {
//       console.error("Error exporting to Excel:", error)
//       alert("Error exporting data to Excel. Please try again.")
//     } finally {
//       setIsExporting(false)
//     }
//   }

//   // Render different table headers and rows based on history type
//   const renderTableHeaders = () => {
//     if (historyType === "game") {
//       return (
//         <tr>
//           <th>S.No</th>
//           <th>User Name</th>
//           <th>Game Title</th>
//           <th>CreatedAt</th>
//           <th>UpdatedAt</th>
//           <th>Initial Balance</th>
//           <th>Bet Amount</th>
//           <th>Prize</th>
//           <th>Final Balance</th>
//           <th>Played Status</th>
//         </tr>
//       );
//     } else if (historyType === "task") {
//       return (
//         <tr>
//           <th>S.No</th>
//           <th>User Name</th>
//           <th>Initiated</th>
//           <th>Initial Balance</th>
//           <th>Reward Amount</th>
//           <th>Final Balance</th>
//           <th>Status</th>
//         </tr>
//       );
//     } else if (historyType === "ads") {
//       return (
//         <tr>
//           <th>S.No</th>
//           <th>User Name</th>
//           <th>Initiated</th>
//           <th>Initial Balance</th>
//           <th>Reward Points</th>
//           <th>Final Balance</th>
//         </tr>
//       );
//     } else if (historyType === "dailyReward") {
//       return (
//         <tr>
//           <th>S.No</th>
//           <th>User Name</th>
//           <th>Initiated</th>
//           <th>Initial Balance</th>
//           <th>Reward Amount</th>
//           <th>Final Balance</th>
//           <th>Status</th>
//         </tr>
//       );
//     } else if (historyType === "referral") {
//       return (
//         <tr>
//           <th>S.No</th>
//           <th>Referring User</th>
//           <th>Referred User</th>
//           <th>Initiated</th>
//           <th>Initial Balance</th>
//           <th>Referral Amount</th>
//           <th>Final Balance</th>
//         </tr>
//       );
//     } else if (historyType === "withdrawal") {
//       return (
//         <tr>
//           <th>S.No</th>
//           <th>User Name</th>
//           <th>Initiated</th>
//           <th>Amount</th>
//           <th>USDT_Amount</th>
//           <th>Status</th>
//         </tr>
//       );
//     } else {
//       return (
//         <tr>
//           <th>S.No</th>
//           <th>User Name</th>
//           <th>Type</th>
//           <th>Details</th>
//           <th>Date</th>
//         </tr>
//       );
//     }
//   };

//   const renderTableRows = () => {
//     if (currentUsers.length === 0) {
//       const colSpan =
//         historyType === "game"
//           ? 10
//           : historyType === "task"
//             ? 7
//             : historyType === "ads"
//               ? 6
//               : historyType === "dailyReward"
//                 ? 7
//                 : historyType === "referral"
//                   ? 7
//                   : historyType === "withdrawal"
//                     ? 6
//                     : 5;
//       return (
//         <tr>
//           <td colSpan={colSpan} className="text-center text-muted py-4">
//             <h6>No {historyType} history available</h6>
//           </td>
//         </tr>
//       );
//     }

//     if (historyType === "game") {
//       return currentUsers.map((user, index) => (
//         <tr key={user._id || user.id || index} className="table-light">
//           <td className="fw-bold">
//             {(currentPage - 1) * usersPerPage + index + 1}
//           </td>
//           <td>
//             <span
//               className="text-primary"
//               style={{ cursor: "pointer", textDecoration: "underline" }}
//               onClick={() =>
//                 handleUsernameClick(user.username, user.userId || user._id)
//               }
//             >
//               {user.username || "N/A"}
//             </span>
//           </td>
//           <td>{user.gameTitle || "N/A"}</td>
//           <td>
//             {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
//           </td>
//           <td>
//             {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
//           </td>
//           <td>{user.initialbalance || 0}</td>
//           <td>{user.betAmount || 0}</td>
//           <td>{user.winAmount || 0}</td>
//           <td>{user.finalbalance || 0}</td>
//           <td>{user.playedStatus || "N/A"}</td>
//         </tr>
//       ));
//     } else if (historyType === "task") {
//       return currentUsers.map((task, index) => (
//         <tr key={task._id || task.id || index} className="table-light">
//           <td className="fw-bold">
//             {(currentPage - 1) * usersPerPage + index + 1}
//           </td>
//           <td>
//             <span
//               className="text-primary"
//               style={{ cursor: "pointer", textDecoration: "underline" }}
//               onClick={() =>
//                 handleUsernameClick(task.username, task.userId || task._id)
//               }
//             >
//               {task.username || "N/A"}
//             </span>
//           </td>
//           <td>
//             {task.CompletionTime
//               ? new Date(task.CompletionTime).toLocaleString()
//               : "N/A"}
//           </td>
//           <td>{task.InitialBalance || 0}</td>
//           <td>{task.Rewardpoints || 0}</td>
//           <td>{task.FinalBalance || 0}</td>
//           <td>{task.Status || "Completed"}</td>
//         </tr>
//       ));
//     } else if (historyType === "ads") {
//       return currentUsers.map((ad, index) => (
//         <tr key={ad._id || ad.id || index} className="table-light">
//           <td className="fw-bold">
//             {(currentPage - 1) * usersPerPage + index + 1}
//           </td>
//           <td>
//             <span
//               className="text-primary"
//               style={{ cursor: "pointer", textDecoration: "underline" }}
//               onClick={() =>
//                 handleUsernameClick(ad.username, ad.userId || ad._id)
//               }
//             >
//               {ad.username || "N/A"}
//             </span>
//           </td>
//           <td>
//             {ad.CompletionTime
//               ? new Date(ad.CompletionTime).toLocaleString()
//               : "N/A"}
//           </td>
//           <td>{ad.InitialBalance || 0}</td>
//           <td>{ad.Rewardpoints || 0}</td>
//           <td>{ad.FinalBalance || 0}</td>
//         </tr>
//       ));
//     } else if (historyType === "dailyReward") {
//       return currentUsers.map((claim, index) => (
//         <tr key={claim._id || claim.id || index} className="table-light">
//           <td className="fw-bold">
//             {(currentPage - 1) * usersPerPage + index + 1}
//           </td>
//           <td>
//             <span
//               className="text-primary"
//               style={{ cursor: "pointer", textDecoration: "underline" }}
//               onClick={() =>
//                 handleUsernameClick(claim.username, claim.userId || claim._id)
//               }
//             >
//               {claim.username || "N/A"}
//             </span>
//           </td>
//           <td>
//             {claim.claimedAt
//               ? new Date(claim.claimedAt).toLocaleString()
//               : "N/A"}
//           </td>
//           <td>{claim.initialBalance || 0}</td>
//           <td>{claim.rewardPoints || 0}</td>
//           <td>{claim.finalBalance || 0}</td>
//           <td>{claim.Status || "Claimed"}</td>
//         </tr>
//       ));
//     } else if (historyType === "referral") {
//       return currentUsers.map((referral, index) => (
//         <tr key={referral._id || referral.id || index} className="table-light">
//           <td className="fw-bold">
//             {(currentPage - 1) * usersPerPage + index + 1}
//           </td>
//           <td>
//             <span
//               className="text-primary"
//               style={{ cursor: "pointer", textDecoration: "underline" }}
//               onClick={() =>
//                 handleUsernameClick(
//                   referral.referringUser?.username,
//                   referral.referringUser?._id
//                 )
//               }
//             >
//               {referral.referringUser?.username || "N/A"}
//             </span>
//           </td>
//           <td>
//             <span>{referral.referredUser?.username || "N/A"}</span>
//           </td>
//           <td>
//             {referral.createdAt
//               ? new Date(referral.createdAt).toLocaleString()
//               : "N/A"}
//           </td>
//           <td>{referral.initialBalance || 0}</td>
//           <td>{referral.referralamount || 0}</td>
//           <td>{referral.finalBalance || 0}</td>
//         </tr>
//       ));
//     } else if (historyType === "withdrawal") {
//       return currentUsers.map((withdrawal, index) => (
//         <tr
//           key={withdrawal._id || withdrawal.id || index}
//           className="table-light"
//         >
//           <td className="fw-bold">
//             {(currentPage - 1) * usersPerPage + index + 1}
//           </td>
//           <td>
//             <span
//               className="text-primary"
//               style={{ cursor: "pointer", textDecoration: "underline" }}
//               onClick={() =>
//                 handleUsernameClick(
//                   withdrawal.username,
//                   withdrawal.userId || withdrawal._id
//                 )
//               }
//             >
//               {withdrawal.username || "N/A"}
//             </span>
//           </td>
//           <td>
//             {withdrawal.createdAt
//               ? new Date(withdrawal.createdAt).toLocaleString()
//               : "N/A"}
//           </td>
//           <td>{withdrawal.withdrawalAmount || withdrawal.amount || 0}</td>
//           <td>{withdrawal.USDT_Amount || 0}</td>
//           <td>
//             <span className="badge bg-success">Transferred</span>
//           </td>
//         </tr>
//       ));
//     } else {
//       return currentUsers.map((item, index) => (
//         <tr key={item._id || item.id || index} className="table-light">
//           <td className="fw-bold">
//             {(currentPage - 1) * usersPerPage + index + 1}
//           </td>
//           <td>
//             <span
//               className="text-primary"
//               style={{ cursor: "pointer", textDecoration: "underline" }}
//               onClick={() =>
//                 handleUsernameClick(
//                   item.username || item.referringUser?.username,
//                   item.userId || item._id
//                 )
//               }
//             >
//               {item.username || item.referringUser?.username || "N/A"}
//             </span>
//           </td>
//           <td>{historyType}</td>
//           <td>{"Details not available"}</td>
//           <td>
//             {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}
//           </td>
//         </tr>
//       ));
//     }
//   };

//   const getSearchPlaceholder = () => {
//     switch (historyType) {
//       case "game":
//         return "Search by username";
//       case "task":
//         return "Search by username";
//       case "ads":
//         return "Search by username";
//       case "dailyReward":
//         return "Search by username";
//       case "referral":
//         return "Search by referringUserName";
//       case "withdrawal":
//         return "Search by username";
//       default:
//         return "Search";
//     }
//   };

//   return (
//     <CCard className="mb-4 shadow-lg rounded">
//       <CCardHeader
//         style={{
//           backgroundColor: "#00B5E2",
//           color: "white",
//         }}
//         className="text-center"
//       >
//         <h5 className="fw-bold">
//           {historyType.charAt(0).toUpperCase() + historyType.slice(1)}
//           {historyType === "withdrawal" ? " (Transferred)" : ""} History
//         </h5>
//       </CCardHeader>
//       <CCardBody>
//         <div className="container mb-4">
//           <div className="d-flex flex-wrap gap-3 align-items-end">
//             <div style={{ flex: "1 1 200px" }}>
//               <label className="d-block mb-2">Search</label>
//               <CFormInput
//                 type="text"
//                 placeholder={getSearchPlaceholder()}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{
//                   backgroundColor: "#f8f9fa",
//                   borderRadius: "4px",
//                   height: "40px",
//                 }}
//               />
//             </div>
//             <div style={{ flex: "1 1 200px" }}>
//               <label className="d-block mb-2">From</label>
//               <CFormInput
//                 type="date"
//                 value={fromDate}
//                 onChange={handleFromDateChange}
//                 style={{
//                   backgroundColor: "#f8f9fa",
//                   borderRadius: "4px",
//                   height: "40px",
//                 }}
//               />
//             </div>
//             <div style={{ flex: "1 1 200px" }}>
//               <label className="d-block mb-2">To</label>
//               <CFormInput
//                 type="date"
//                 value={toDate}
//                 onChange={handleToDateChange}
//                 style={{
//                   backgroundColor: "#f8f9fa",
//                   borderRadius: "4px",
//                   height: "40px",
//                 }}
//               />
//             </div>
//             <div style={{ flex: "1 1 200px" }}>
//               <label className="d-block mb-2">History Type</label>
//               <CFormSelect
//                 value={historyType}
//                 onChange={(e) => setHistoryType(e.target.value)}
//                 style={{
//                   backgroundColor: "#f8f9fa",
//                   borderRadius: "4px",
//                   height: "40px",
//                 }}
//               >
//                 {historyTypeOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </CFormSelect>
//             </div>
//             <div style={{ flex: "1 1 200px" }}>
//               <div className="d-flex gap-2">
//                 <CButton
//                   style={{
//                     backgroundColor: "#00B5E2",
//                     borderColor: "#00B5E2",
//                     color: "white",
//                     height: "40px",
//                   }}
//                   onClick={handleSearch}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Loading..." : "Search"}
//                 </CButton>
//                 <CButton
//                   style={{
//                     backgroundColor: "#f8f9fa",
//                     borderColor: "#dee2e6",
//                     color: "#333",
//                     height: "40px",
//                   }}
//                   onClick={handleReset}
//                   disabled={isLoading}
//                 >
//                   Reset
//                 </CButton>
//               </div>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <CAlert
//             color="danger"
//             className="d-flex align-items-center justify-content-between mb-4"
//           >
//             <div>
//               <strong>Error:</strong> {error.message}
//               {error.details && (
//                 <div className="mt-1 small">{error.details}</div>
//               )}
//             </div>
//             <CButton color="danger" variant="outline" onClick={handleRetry}>
//               Retry
//             </CButton>
//           </CAlert>
//         )}

//         <div className="container">
//           <div className="d-flex justify-content-end mb-3">
//             <CButton
//               style={{
//                 backgroundColor: "#00B5E2",
//                 borderColor: "#00B5E2",
//                 color: "white",
//               }}
//               onClick={downloadExcel}
//               disabled={filteredUsers.length === 0 || isLoading || isExporting}
//             >
//               {isExporting ? (
//                 <>
//                   <div
//                     className="spinner-border spinner-border-sm me-2"
//                     role="status"
//                   >
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                   EXPORTING...
//                 </>
//               ) : (
//                 "EXPORT AS EXCEL"
//               )}
//             </CButton>
//           </div>
//         </div>

//         <CRow>
//           <div className="container">
//             {isLoading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <p className="mt-2">Loading {historyType} data...</p>
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-bordered table-hover text-center align-middle">
//                   <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
//                     {renderTableHeaders()}
//                   </thead>
//                   <tbody>{renderTableRows()}</tbody>
//                 </table>
//               </div>
//             )}

//             <div className="d-flex justify-content-center mt-3">
//               <nav aria-label="Page navigation">
//                 <div className="d-flex align-items-center gap-1 p-2 bg-white rounded shadow-sm border">
//                   {/* Previous Button */}
//                   <button
//                     className={`btn d-flex align-items-center justify-content-center ${
//                       currentPage === 1
//                         ? "text-muted border-0 bg-light"
//                         : "text-white border-0"
//                     }`}
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       backgroundColor:
//                         currentPage === 1 ? "#f8f9fa" : "#00BFFF",
//                       cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                     }}
//                     disabled={currentPage === 1 || isLoading}
//                     onClick={prevPage}
//                   >
//                     &#8249;
//                   </button>

//                   {/* Page Numbers */}
//                   {(() => {
//                     // Use backend totalPages
//                     const pages = [];
//                     if (totalPages <= 7) {
//                       for (let i = 1; i <= totalPages; i++) {
//                         pages.push(
//                           <button
//                             key={i}
//                             className={`btn d-flex align-items-center justify-content-center border-0 ${
//                               currentPage === i
//                                 ? "text-white"
//                                 : "text-dark bg-light hover-bg-gray"
//                             }`}
//                             style={{
//                               width: "40px",
//                               height: "40px",
//                               backgroundColor:
//                                 currentPage === i ? "#00BFFF" : "#f8f9fa",
//                               fontWeight: currentPage === i ? "bold" : "normal",
//                             }}
//                             onClick={() => setCurrentPage(i)}
//                           >
//                             {i}
//                           </button>
//                         );
//                       }
//                     } else {
//                       // Complex pagination logic for many pages
//                       if (currentPage <= 3) {
//                         // Show first 3 pages, ellipsis, last page
//                         for (let i = 1; i <= 3; i++) {
//                           pages.push(
//                             <button
//                               key={i}
//                               className={`btn d-flex align-items-center justify-content-center border-0 ${
//                                 currentPage === i
//                                   ? "text-white"
//                                   : "text-dark bg-light hover-bg-gray"
//                               }`}
//                               style={{
//                                 width: "40px",
//                                 height: "40px",
//                                 backgroundColor:
//                                   currentPage === i ? "#00BFFF" : "#f8f9fa",
//                                 fontWeight:
//                                   currentPage === i ? "bold" : "normal",
//                               }}
//                               onClick={() => setCurrentPage(i)}
//                             >
//                               {i}
//                             </button>
//                           );
//                         }
//                         if (totalPages > 4) {
//                           pages.push(
//                             <span
//                               key="ellipsis1"
//                               className="d-flex align-items-center px-2 text-muted"
//                             >
//                               ...
//                             </span>
//                           );
//                           pages.push(
//                             <button
//                               key={totalPages}
//                               className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
//                               style={{ width: "40px", height: "40px" }}
//                               onClick={() => setCurrentPage(totalPages)}
//                             >
//                               {totalPages}
//                             </button>
//                           );
//                         }
//                       } else if (currentPage >= totalPages - 2) {
//                         // Show first page, ellipsis, last 3 pages
//                         pages.push(
//                           <button
//                             key={1}
//                             className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
//                             style={{ width: "40px", height: "40px" }}
//                             onClick={() => setCurrentPage(1)}
//                           >
//                             1
//                           </button>
//                         );
//                         pages.push(
//                           <span
//                             key="ellipsis2"
//                             className="d-flex align-items-center px-2 text-muted"
//                           >
//                             ...
//                           </span>
//                         );
//                         for (let i = totalPages - 2; i <= totalPages; i++) {
//                           pages.push(
//                             <button
//                               key={i}
//                               className={`btn d-flex align-items-center justify-content-center border-0 ${
//                                 currentPage === i
//                                   ? "text-white"
//                                   : "text-dark bg-light hover-bg-gray"
//                               }`}
//                               style={{
//                                 width: "40px",
//                                 height: "40px",
//                                 backgroundColor:
//                                   currentPage === i ? "#00BFFF" : "#f8f9fa",
//                                 fontWeight:
//                                   currentPage === i ? "bold" : "normal",
//                               }}
//                               onClick={() => setCurrentPage(i)}
//                             >
//                               {i}
//                             </button>
//                           );
//                         }
//                       } else {
//                         // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
//                         pages.push(
//                           <button
//                             key={1}
//                             className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
//                             style={{ width: "40px", height: "40px" }}
//                             onClick={() => setCurrentPage(1)}
//                           >
//                             1
//                           </button>
//                         );
//                         pages.push(
//                           <span
//                             key="ellipsis3"
//                             className="d-flex align-items-center px-2 text-muted"
//                           >
//                             ...
//                           </span>
//                         );
//                         for (
//                           let i = currentPage - 1;
//                           i <= currentPage + 1;
//                           i++
//                         ) {
//                           pages.push(
//                             <button
//                               key={i}
//                               className={`btn d-flex align-items-center justify-content-center border-0 ${
//                                 currentPage === i
//                                   ? "text-white"
//                                   : "text-dark bg-light hover-bg-gray"
//                               }`}
//                               style={{
//                                 width: "40px",
//                                 height: "40px",
//                                 backgroundColor:
//                                   currentPage === i ? "#00BFFF" : "#f8f9fa",
//                                 fontWeight:
//                                   currentPage === i ? "bold" : "normal",
//                               }}
//                               onClick={() => setCurrentPage(i)}
//                             >
//                               {i}
//                             </button>
//                           );
//                         }
//                         pages.push(
//                           <span
//                             key="ellipsis4"
//                             className="d-flex align-items-center px-2 text-muted"
//                           >
//                             ...
//                           </span>
//                         );
//                         pages.push(
//                           <button
//                             key={totalPages}
//                             className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
//                             style={{ width: "40px", height: "40px" }}
//                             onClick={() => setCurrentPage(totalPages)}
//                           >
//                             {totalPages}
//                           </button>
//                         );
//                       }
//                     }

//                     return pages;
//                   })()}

//                   {/* Next Button */}
//                   <button
//                     className={`btn d-flex align-items-center justify-content-center ${
//                       currentPage >= totalPages
//                         ? "text-muted border-0 bg-light"
//                         : "text-white border-0"
//                     }`}
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       backgroundColor:
//                         currentPage >= totalPages ? "#f8f9fa" : "#00BFFF",
//                       cursor:
//                         currentPage >= totalPages ? "not-allowed" : "pointer",
//                     }}
//                     disabled={currentPage >= totalPages || isLoading}
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
//   );
// };

// export default Gamehistory;



"use client"

import { useState, useEffect } from "react"
import { CRow, CCard, CCardHeader, CCardBody, CButton, CFormInput, CFormSelect, CAlert } from "@coreui/react"
import { getData } from "../../../apiConfigs/apiCalls"
import { SEARCH } from "../../../apiConfigs/endpoints"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx"

const Gamehistory = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [historyType, setHistoryType] = useState("game")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const usersPerPage = 10

  const historyTypeOptions = [
    { value: "game", label: "Game" },
    { value: "task", label: "Task" },
    { value: "ads", label: "Ads" },
    { value: "dailyReward", label: "Daily Reward" },
    { value: "referral", label: "Referral" },
    { value: "withdrawal", label: "Withdrawal" },
  ]

  // Function to sort data by createdAt (newest first)
  const sortDataByDate = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.CompletionTime || a.completionTime || a.claimedAt || a.CompletedAt || a.initiated || 0,
      )
      const dateB = new Date(
        b.createdAt || b.CompletionTime || b.completionTime || b.claimedAt || b.CompletedAt || b.initiated || 0,
      )
      return dateB - dateA // Descending order (newest first)
    })
  }

  // Function to fetch ALL data for export (without pagination)
  const fetchAllDataForExport = async () => {
    try {
      let typeParam = historyType
      if (typeParam === "dailyReward") typeParam = "dailyreward"
      if (typeParam === "game") typeParam = "gamehistory"
      if (typeParam === "task") typeParam = "tasks"

      // Prepare query params with high limit to get all data
      const params = {
        type: typeParam,
        limit: 10000, // High limit to get all data
      }
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate
      if (searchTerm) {
        // Changed to use userId instead of username
        params.userId = searchTerm
      }

      // Add status filter for withdrawals to only get transferred ones
      if (typeParam === "withdrawal") {
        params.status = "transferred"
      }

      // Build query string
      const queryString = Object.entries(params)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
        .join("&")

      const response = await getData(`${SEARCH}?${queryString}`)

      let dataList = []
      // Extract data based on type
      if (typeParam === "gamehistory") {
        dataList = response?.history || []
      } else if (typeParam === "tasks") {
        dataList = response?.tasks || []
      } else if (typeParam === "ads") {
        dataList = response?.ads || []
      } else if (typeParam === "dailyreward") {
        dataList = response?.rewards || []
      } else if (typeParam === "referral") {
        dataList = response?.data || []
      } else if (typeParam === "withdrawal") {
        dataList = response?.withdrawals || []
      }

      // Sort the data by createdAt (newest first)
      return sortDataByDate(dataList)
    } catch (error) {
      console.error("Error fetching all data for export:", error)
      throw error
    }
  }

  // Fetch data for the selected history type using the SEARCH endpoint
  const fetchData = async (paramsOverride = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      let response
      let dataList = []
      let typeParam = historyType
      if (typeParam === "dailyReward") typeParam = "dailyreward"
      if (typeParam === "game") typeParam = "gamehistory"
      if (typeParam === "task") typeParam = "tasks"

      // Prepare query params - use page 1 when history type changes
      const params = {
        type: typeParam,
        page: paramsOverride.resetPage ? 1 : currentPage,
        limit: usersPerPage,
        ...paramsOverride,
      }
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate
      if (searchTerm) {
        // Changed to use userId instead of username
        params.userId = searchTerm
      }

      // Add status filter for withdrawals to only get transferred ones
      if (typeParam === "withdrawal") {
        params.status = "transferred"
      }

      // Build query string
      const queryString = Object.entries(params)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
        .join("&")

      response = await getData(`${SEARCH}?${queryString}`)

      // Extract data based on type
      if (typeParam === "gamehistory") {
        dataList = response?.history || []
        setTotalPages(response?.totalPages || 1)
        setTotalCount(response?.length || 0)
      } else if (typeParam === "tasks") {
        dataList = response?.tasks || []
        setTotalPages(response?.totalPages || 1)
        setTotalCount(response?.length || 0)
      } else if (typeParam === "ads") {
        dataList = response?.ads || []
        setTotalPages(response?.totalPages || 1)
        setTotalCount(response?.length || 0)
      } else if (typeParam === "dailyreward") {
        dataList = response?.rewards || []
        setTotalPages(response?.totalPages || 1)
        setTotalCount(response?.length || 0)
      } else if (typeParam === "referral") {
        dataList = response?.data || []
        setTotalPages(response?.totalPages || 1)
        setTotalCount(response?.length || response?.totalReferralsCount || 0)
      } else if (typeParam === "withdrawal") {
        dataList = response?.withdrawals || []
        setTotalPages(response?.totalPages || 1)
        setTotalCount(response?.length || 0)
      }

      // Sort the data by createdAt (newest first)
      const sortedData = sortDataByDate(dataList)
      setUsers(sortedData)
      setFilteredUsers(sortedData)
    } catch (error) {
      console.error(`Error fetching ${historyType} data:`, error)
      setError({
        type: historyType,
        message: `Unable to fetch ${historyType} data.`,
        details: error.message || "Unknown error",
      })
      setUsers([])
      setFilteredUsers([])
      setTotalPages(1)
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData({ resetPage: true })
    // Reset search and date filters when history type changes
    setSearchTerm("")
    setFromDate("")
    setToDate("")
    // Reset current page to 1 when history type changes
    setCurrentPage(1)
  }, [historyType])

  // Only fetch data when historyType or currentPage changes
  useEffect(() => {
    fetchData()
  }, [historyType, currentPage])

  // Update handleSearch to call fetchData with current filters
  const handleSearch = () => {
    setCurrentPage(1)
    fetchData()
  }

  // Update handleFromDateChange and handleToDateChange to only set state
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value)
  }

  const handleToDateChange = (e) => {
    setToDate(e.target.value)
  }

  const handleRetry = () => {
    fetchData()
  }

  const handleReset = () => {
    setSearchTerm("")
    setFromDate("")
    setToDate("")
    setCurrentPage(1)
    fetchData()
  }

  const currentUsers = filteredUsers // Use backend-paginated data directly

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Fixed function to handle userId click - navigate to user details page
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

  // FIXED: Download Excel function - now fetches ALL data
  const downloadExcel = async () => {
    setIsExporting(true)

    try {
      // Fetch ALL data for export (not just paginated data)
      const allData = await fetchAllDataForExport()

      if (!allData || allData.length === 0) {
        alert("No data to export")
        return
      }

      let formattedData = []

      if (historyType === "game") {
        formattedData = allData.map((user, index) => ({
          SNo: index + 1,
          UserId: user.userId || "N/A",
          UserName: user.username || "N/A",
          GameTitle: user.gameTitle || "N/A",
          CreatedAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
          UpdatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A",
          InitialBalance: user.initialbalance || 0,
          BetAmount: user.betAmount || 0,
          Prize: user.winAmount || 0,
          FinalBalance: user.finalbalance || 0,
          PlayedStatus: user.playedStatus || "N/A",
        }))
      } else if (historyType === "task") {
        formattedData = allData.map((task, index) => ({
          SNo: index + 1,
          UserId: task.userId || "N/A",
          UserName: task.username || "N/A",
          Initiated: task.CompletionTime ? new Date(task.CompletionTime).toLocaleString() : "N/A",
          InitialBalance: task.InitialBalance || 0,
          RewardAmount: task.Rewardpoints || 0,
          FinalBalance: task.FinalBalance || 0,
          Status: task.Status || "Completed",
        }))
      } else if (historyType === "ads") {
        formattedData = allData.map((ad, index) => ({
          SNo: index + 1,
          UserId: ad.userId || "N/A",
          UserName: ad.username || "N/A",
          Initiated: ad.CompletionTime ? new Date(ad.CompletionTime).toLocaleString() : "N/A",
          InitialBalance: ad.InitialBalance || 0,
          RewardPoints: ad.Rewardpoints || 0,
          FinalBalance: ad.FinalBalance || 0,
        }))
      } else if (historyType === "dailyReward") {
        formattedData = allData.map((claim, index) => ({
          SNo: index + 1,
          UserId: claim.userId || "N/A",
          UserName: claim.username || "N/A",
          Initiated: claim.claimedAt ? new Date(claim.claimedAt).toLocaleString() : "N/A",
          InitialBalance: claim.initialBalance || 0,
          RewardPoints: claim.rewardPoints || 0,
          FinalBalance: claim.finalBalance || 0,
          Status: claim.Status || "Claimed",
        }))
      } else if (historyType === "referral") {
        formattedData = allData.map((referral, index) => ({
          SNo: index + 1,
          ReferringUserId: referral.referringUser?._id || "N/A",
          ReferringUserName: referral.referringUser?.username || "N/A",
          ReferredUserId: referral.referredUser?._id || "N/A",
          ReferredUserName: referral.referredUser?.username || "N/A",
          Initiated: referral.createdAt ? new Date(referral.createdAt).toLocaleString() : "N/A",
          InitialBalance: referral.initialBalance || 0,
          ReferralAmount: referral.referralamount || 0,
          FinalBalance: referral.finalBalance || 0,
        }))
      } else if (historyType === "withdrawal") {
        formattedData = allData.map((withdrawal, index) => ({
          SNo: index + 1,
          UserId: withdrawal.userId || "N/A",
          UserName: withdrawal.username || "N/A",
          Initiated: withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleString() : "N/A",
          Amount: withdrawal.withdrawalAmount || withdrawal.amount || 0,
          USDT_Amount: withdrawal.USDT_Amount || 0,
          Status: "Transferred",
        }))
      }

      const ws = XLSX.utils.json_to_sheet(formattedData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, `${historyType}History`)

      const fileName = `${historyType}_history_${new Date().toISOString().split("T")[0]}.xlsx`
      XLSX.writeFile(wb, fileName)

      // Show success message with record count
      // alert(`Successfully exported ${formattedData.length} records to Excel!`)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Error exporting data to Excel. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  // Render different table headers and rows based on history type
  const renderTableHeaders = () => {
    if (historyType === "game") {
      return (
        <tr>
          <th>S.No</th>
          <th>User ID</th>
          <th>User Name</th>
          <th>Game Title</th>
          <th>CreatedAt</th>
          <th>UpdatedAt</th>
          <th>Initial Balance</th>
          <th>Bet Amount</th>
          <th>Prize</th>
          <th>Final Balance</th>
          <th>Played Status</th>
        </tr>
      )
    } else if (historyType === "task") {
      return (
        <tr>
          <th>S.No</th>
          <th>User ID</th>
          <th>User Name</th>
          <th>Initiated</th>
          <th>Initial Balance</th>
          <th>Reward Amount</th>
          <th>Final Balance</th>
          <th>Status</th>
        </tr>
      )
    } else if (historyType === "ads") {
      return (
        <tr>
          <th>S.No</th>
          <th>User ID</th>
          <th>User Name</th>
          <th>Initiated</th>
          <th>Initial Balance</th>
          <th>Reward Points</th>
          <th>Final Balance</th>
        </tr>
      )
    } else if (historyType === "dailyReward") {
      return (
        <tr>
          <th>S.No</th>
          <th>User ID</th>
          <th>User Name</th>
          <th>Initiated</th>
          <th>Initial Balance</th>
          <th>Reward Amount</th>
          <th>Final Balance</th>
          <th>Status</th>
        </tr>
      )
    } else if (historyType === "referral") {
      return (
        <tr>
          <th>S.No</th>
          <th>Referring User ID</th>
          <th>Referring User Name</th>
          <th>Referred User ID</th>
          <th>Referred User Name</th>
          <th>Initiated</th>
          <th>Initial Balance</th>
          <th>Referral Amount</th>
          <th>Final Balance</th>
        </tr>
      )
    } else if (historyType === "withdrawal") {
      return (
        <tr>
          <th>S.No</th>
          <th>User ID</th>
          <th>User Name</th>
          <th>Initiated</th>
          <th>Amount</th>
          <th>USDT_Amount</th>
          <th>Status</th>
        </tr>
      )
    } else {
      return (
        <tr>
          <th>S.No</th>
          <th>User ID</th>
          <th>User Name</th>
          <th>Type</th>
          <th>Details</th>
          <th>Date</th>
        </tr>
      )
    }
  }

  const renderTableRows = () => {
    if (currentUsers.length === 0) {
      const colSpan =
        historyType === "game"
          ? 10
          : historyType === "task"
            ? 7
            : historyType === "ads"
              ? 6
              : historyType === "dailyReward"
                ? 7
                : historyType === "referral"
                  ? 7
                  : historyType === "withdrawal"
                    ? 6
                    : 5
      return (
        <tr>
          <td colSpan={colSpan} className="text-center text-muted py-4">
            <h6>No {historyType} history available</h6>
          </td>
        </tr>
      )
    }

    if (historyType === "game") {
      return currentUsers.map((user, index) => (
        <tr key={user._id || user.id || index} className="table-light">
          <td className="fw-bold">{(currentPage - 1) * usersPerPage + index + 1}</td>
          <td>
            <span
              className="text-primary"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleUserIdClick(user.userId || user._id)}
            >
              {user.userId || user._id || "N/A"}
            </span>
          </td>
          <td>{user.username || "N/A"}</td>
          <td>{user.gameTitle || "N/A"}</td>
          <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}</td>
          <td>{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}</td>
          <td>{user.initialbalance || 0}</td>
          <td>{user.betAmount || 0}</td>
          <td>{user.winAmount || 0}</td>
          <td>{user.finalbalance || 0}</td>
          <td>{user.playedStatus || "N/A"}</td>
        </tr>
      ))
    } else if (historyType === "task") {
      return currentUsers.map((task, index) => (
        <tr key={task._id || task.id || index} className="table-light">
          <td className="fw-bold">{(currentPage - 1) * usersPerPage + index + 1}</td>
          <td>
            <span
              className="text-primary"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleUserIdClick(task.userId || task._id)}
            >
              {task.userId || task._id || "N/A"}
            </span>
          </td>
          <td>{task.username || "N/A"}</td>
          <td>{task.CompletionTime ? new Date(task.CompletionTime).toLocaleString() : "N/A"}</td>
          <td>{task.InitialBalance || 0}</td>
          <td>{task.Rewardpoints || 0}</td>
          <td>{task.FinalBalance || 0}</td>
          <td>{task.Status || "Completed"}</td>
        </tr>
      ))
    } else if (historyType === "ads") {
      return currentUsers.map((ad, index) => (
        <tr key={ad._id || ad.id || index} className="table-light">
          <td className="fw-bold">{(currentPage - 1) * usersPerPage + index + 1}</td>
          <td>
            <span
              className="text-primary"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleUserIdClick(ad.userId || ad._id)}
            >
              {ad.userId || ad._id || "N/A"}
            </span>
          </td>
          <td>{ad.username || "N/A"}</td>
          <td>{ad.CompletionTime ? new Date(ad.CompletionTime).toLocaleString() : "N/A"}</td>
          <td>{ad.InitialBalance || 0}</td>
          <td>{ad.Rewardpoints || 0}</td>
          <td>{ad.FinalBalance || 0}</td>
        </tr>
      ))
    } else if (historyType === "dailyReward") {
      return currentUsers.map((claim, index) => (
        <tr key={claim._id || claim.id || index} className="table-light">
          <td className="fw-bold">{(currentPage - 1) * usersPerPage + index + 1}</td>
          <td>
            <span
              className="text-primary"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleUserIdClick(claim.userId || claim._id)}
            >
              {claim.userId || claim._id || "N/A"}
            </span>
          </td>
          <td>{claim.username || "N/A"}</td>
          <td>{claim.claimedAt ? new Date(claim.claimedAt).toLocaleString() : "N/A"}</td>
          <td>{claim.initialBalance || 0}</td>
          <td>{claim.rewardPoints || 0}</td>
          <td>{claim.finalBalance || 0}</td>
          <td>{claim.Status || "Claimed"}</td>
        </tr>
      ))
    } else if (historyType === "referral") {
      return currentUsers.map((referral, index) => (
        <tr key={referral._id || referral.id || index} className="table-light">
          <td className="fw-bold">{(currentPage - 1) * usersPerPage + index + 1}</td>
          <td>
            <span
              className="text-primary"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleUserIdClick(referral.referringUser?._id)}
            >
              {referral.referringUser?._id || "N/A"}
            </span>
          </td>
          <td>
            <span>{referral.referringUser?.username || "N/A"}</span>
          </td>
          <td>
            <span>{referral.referredUser?._id || "N/A"}</span>
          </td>
           <td>
            <span>{referral.referredUser?.username || "N/A"}</span>
          </td>
          <td>{referral.createdAt ? new Date(referral.createdAt).toLocaleString() : "N/A"}</td>
          <td>{referral.initialBalance || 0}</td>
          <td>{referral.referralamount || 0}</td>
          <td>{referral.finalBalance || 0}</td>
        </tr>
      ))
    } else if (historyType === "withdrawal") {
      return currentUsers.map((withdrawal, index) => (
        <tr key={withdrawal._id || withdrawal.id || index} className="table-light">
          <td className="fw-bold">{(currentPage - 1) * usersPerPage + index + 1}</td>
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
          <td>{withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleString() : "N/A"}</td>
          <td>{withdrawal.withdrawalAmount || withdrawal.amount || 0}</td>
          <td>{withdrawal.USDT_Amount || 0}</td>
          <td>
            <span className="badge bg-success">Transferred</span>
          </td>
        </tr>
      ))
    } else {
      return currentUsers.map((item, index) => (
        <tr key={item._id || item.id || index} className="table-light">
          <td className="fw-bold">{(currentPage - 1) * usersPerPage + index + 1}</td>
          <td>
            <span
              className="text-primary"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleUserIdClick(item.userId || item._id)}
            >
              {item.userId || item._id || "N/A"}
            </span>
          </td>
          <td>{historyType}</td>
          <td>{"Details not available"}</td>
          <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}</td>
        </tr>
      ))
    }
  }

  const getSearchPlaceholder = () => {
    switch (historyType) {
      case "game":
        return "Search by User ID"
      case "task":
        return "Search by User ID"
      case "ads":
        return "Search by User ID"
      case "dailyReward":
        return "Search by User ID"
      case "referral":
        return "Search by Referring User ID"
      case "withdrawal":
        return "Search by User ID"
      default:
        return "Search by User ID"
    }
  }

  return (
    <CCard className="mb-4 shadow-lg rounded">
      <CCardHeader
        style={{
          backgroundColor: "#00B5E2",
          color: "white",
        }}
        className="text-center"
      >
        <h5 className="fw-bold">
          {historyType.charAt(0).toUpperCase() + historyType.slice(1)}
          {historyType === "withdrawal" ? " (Transferred)" : ""} History
        </h5>
      </CCardHeader>
      <CCardBody>
        <div className="container mb-4">
          <div className="d-flex flex-wrap gap-3 align-items-end">
            <div style={{ flex: "1 1 200px" }}>
              <label className="d-block mb-2">Search</label>
              <CFormInput
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  height: "40px",
                }}
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label className="d-block mb-2">From</label>
              <CFormInput
                type="date"
                value={fromDate}
                onChange={handleFromDateChange}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  height: "40px",
                }}
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label className="d-block mb-2">To</label>
              <CFormInput
                type="date"
                value={toDate}
                onChange={handleToDateChange}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  height: "40px",
                }}
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label className="d-block mb-2">History Type</label>
              <CFormSelect
                value={historyType}
                onChange={(e) => setHistoryType(e.target.value)}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  height: "40px",
                }}
              >
                {historyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <div className="d-flex gap-2">
                <CButton
                  style={{
                    backgroundColor: "#00B5E2",
                    borderColor: "#00B5E2",
                    color: "white",
                    height: "40px",
                  }}
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Search"}
                </CButton>
                <CButton
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderColor: "#dee2e6",
                    color: "#333",
                    height: "40px",
                  }}
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Reset
                </CButton>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <CAlert color="danger" className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <strong>Error:</strong> {error.message}
              {error.details && <div className="mt-1 small">{error.details}</div>}
            </div>
            <CButton color="danger" variant="outline" onClick={handleRetry}>
              Retry
            </CButton>
          </CAlert>
        )}

        <div className="container">
          <div className="d-flex justify-content-end mb-3">
            <CButton
              style={{
                backgroundColor: "#00B5E2",
                borderColor: "#00B5E2",
                color: "white",
              }}
              onClick={downloadExcel}
              disabled={filteredUsers.length === 0 || isLoading || isExporting}
            >
              {isExporting ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  EXPORTING...
                </>
              ) : (
                "EXPORT AS EXCEL"
              )}
            </CButton>
          </div>
        </div>

        <CRow>
          <div className="container">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading {historyType} data...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle">
                  <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>{renderTableHeaders()}</thead>
                  <tbody>{renderTableRows()}</tbody>
                </table>
              </div>
            )}

            <div className="d-flex justify-content-center mt-3">
              <nav aria-label="Page navigation">
                <div className="d-flex align-items-center gap-1 p-2 bg-white rounded shadow-sm border">
                  {/* Previous Button */}
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
                    disabled={currentPage === 1 || isLoading}
                    onClick={prevPage}
                  >
                    &#8249;
                  </button>

                  {/* Page Numbers */}
                  {(() => {
                    // Use backend totalPages
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
                            onClick={() => setCurrentPage(i)}
                          >
                            {i}
                          </button>,
                        )
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
                                currentPage === i ? "text-white" : "text-dark bg-light hover-bg-gray"
                              }`}
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: currentPage === i ? "#00BFFF" : "#f8f9fa",
                                fontWeight: currentPage === i ? "bold" : "normal",
                              }}
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>,
                          )
                        }
                        if (totalPages > 4) {
                          pages.push(
                            <span key="ellipsis1" className="d-flex align-items-center px-2 text-muted">
                              ...
                            </span>,
                          )
                          pages.push(
                            <button
                              key={totalPages}
                              className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
                              style={{ width: "40px", height: "40px" }}
                              onClick={() => setCurrentPage(totalPages)}
                            >
                              {totalPages}
                            </button>,
                          )
                        }
                      } else if (currentPage >= totalPages - 2) {
                        // Show first page, ellipsis, last 3 pages
                        pages.push(
                          <button
                            key={1}
                            className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
                            style={{ width: "40px", height: "40px" }}
                            onClick={() => setCurrentPage(1)}
                          >
                            1
                          </button>,
                        )
                        pages.push(
                          <span key="ellipsis2" className="d-flex align-items-center px-2 text-muted">
                            ...
                          </span>,
                        )
                        for (let i = totalPages - 2; i <= totalPages; i++) {
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
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>,
                          )
                        }
                      } else {
                        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
                        pages.push(
                          <button
                            key={1}
                            className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
                            style={{ width: "40px", height: "40px" }}
                            onClick={() => setCurrentPage(1)}
                          >
                            1
                          </button>,
                        )
                        pages.push(
                          <span key="ellipsis3" className="d-flex align-items-center px-2 text-muted">
                            ...
                          </span>,
                        )
                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
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
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>,
                          )
                        }
                        pages.push(
                          <span key="ellipsis4" className="d-flex align-items-center px-2 text-muted">
                            ...
                          </span>,
                        )
                        pages.push(
                          <button
                            key={totalPages}
                            className="btn d-flex align-items-center justify-content-center border-0 text-dark bg-light hover-bg-gray"
                            style={{ width: "40px", height: "40px" }}
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </button>,
                        )
                      }
                    }

                    return pages
                  })()}

                  {/* Next Button */}
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
                    disabled={currentPage >= totalPages || isLoading}
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

export default Gamehistory

