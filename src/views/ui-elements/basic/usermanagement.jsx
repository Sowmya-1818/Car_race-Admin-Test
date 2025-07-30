// "use client"

// import { useState, useEffect } from "react"
// import {
//   CRow,
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CButton,
//   CFormInput,
//   CModal,
//   CModalBody,
//   CModalFooter,
//   CModalHeader,
//   CModalTitle,
// } from "@coreui/react"
// import { getData } from "../../../apiConfigs/apiCalls"
// import { useNavigate } from "react-router-dom"
// import { GET_ALL_USERS } from "../../../apiConfigs/endpoints"
// import * as XLSX from "xlsx"

// const Usermanagement = () => {
//   const [users, setUsers] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [modalVisible, setModalVisible] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const usersPerPage = 10

//   const navigate = useNavigate()

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

//   const fetchUsers = async () => {
//     try {
//       setIsLoading(true)
//       let allUsers = []
//       const currentPage = 1
//       let totalPages = 1

//       // Fetch first page to get total pages
//       const firstResponse = await getData(`${GET_ALL_USERS}?page=1&limit=100`) // Increase limit to get more users per request
//       console.log("GET_ALL_USERS Response:", firstResponse)

//       if (firstResponse?.users) {
//         allUsers = [...firstResponse.users]
//         totalPages = firstResponse.totalPages || 1

//         // If there are more pages, fetch them
//         if (totalPages > 1) {
//           const promises = []
//           for (let page = 2; page <= totalPages; page++) {
//             promises.push(getData(`${GET_ALL_USERS}?page=${page}&limit=100`))
//           }

//           const responses = await Promise.all(promises)
//           responses.forEach((response) => {
//             if (response?.users) {
//               allUsers = [...allUsers, ...response.users]
//             }
//           })
//         }
//       }

//       setUsers(allUsers)
//       console.log(`Fetched ${allUsers.length} total users`)
//     } catch (error) {
//       console.error("Error fetching users:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   // Filtered users based on search term
//   const filteredUsers = users.filter((user) =>
//     [user.username].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase())),
//   )

//   const indexOfLastUser = currentPage * usersPerPage
//   const indexOfFirstUser = indexOfLastUser - usersPerPage
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

//   const nextPage = () => {
//     const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1)
//     }
//   }

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1)
//     }
//   }

//   const openModal = (user) => {
//     setSelectedUser(user)
//     setModalVisible(true)
//   }

//   const closeModal = () => {
//     setModalVisible(false)
//     setSelectedUser(null)
//   }

//   // Function to download the users data as an Excel file
//   const downloadExcel = async () => {
//     setIsLoading(true)
//     try {
//       // Always fetch all users fresh before exporting
//       let allUsers = []
//       const firstResponse = await getData(`${GET_ALL_USERS}?page=1&limit=100`)
//       if (firstResponse?.users) {
//         allUsers = [...firstResponse.users]
//         const totalPages = firstResponse.totalPages || 1
//         if (totalPages > 1) {
//           const promises = []
//           for (let page = 2; page <= totalPages; page++) {
//             promises.push(getData(`${GET_ALL_USERS}?page=${page}&limit=100`))
//           }
//           const responses = await Promise.all(promises)
//           responses.forEach((response) => {
//             if (response?.users) {
//               allUsers = [...allUsers, ...response.users]
//             }
//           })
//         }
//       }
//       const formattedData = allUsers.map((user, index) => ({
//         UserName: user.username || "N/A",
//         UserPoints: user.ticketBalance || 0,
//         Email: user.email || "N/A",
//         LoginType: user.loginType || "N/A",
//       }))
//       const ws = XLSX.utils.json_to_sheet(formattedData)
//       const wb = XLSX.utils.book_new()
//       XLSX.utils.book_append_sheet(wb, ws, "Users")
//       XLSX.writeFile(wb, "users_data.xlsx")
//     } catch (error) {
//       console.error("Error exporting users to Excel:", error)
//       alert("Failed to export users. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <>
//       <CCard className="mb-4 shadow-lg">
//         <CCardHeader
//           style={{
//             backgroundColor: "#00B5E2", // Blue background color for the header
//             color: "white", // White text color
//           }}
//           className="text-center"
//         >
//           <h5 className="fw-bold">User Management</h5>
//         </CCardHeader>

//         <CCardBody>
//           <CRow>
//             <div className="container">
//               {/* Search Bar */}
//               <div className="mb-3 d-flex justify-content-between">
//                 <CFormInput
//                   type="text"
//                   placeholder="Search by Username"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value)
//                     setCurrentPage(1) // Reset to first page when searching
//                   }}
//                   className="w-50"
//                 />
//                 {/* Download Excel Button */}
//                 <CButton
//                   style={{
//                     backgroundColor: "#00B5E2",
//                     borderColor: "#00B5E2",
//                     color: "black",
//                   }}
//                   onClick={downloadExcel}
//                   className="align-self-center"
//                   disabled={false}
//                 >
//                   EXPORT AS EXCEL
//                 </CButton>
//               </div>

//               <div className="table-responsive">
//                 <table className="table table-bordered table-hover text-center align-middle">
//                   <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
//                     <tr>
//                       <th>S.No</th>
//                       <th>User Name</th>
//                       <th>User Points</th>
//                       <th>Email</th>
//                       <th>Login Type</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {isLoading ? (
//                       <tr>
//                         <td colSpan="6" className="text-center py-4">
//                           <div className="d-flex justify-content-center align-items-center">
//                             <div className="spinner-border text-primary me-2" role="status">
//                               <span className="visually-hidden">Loading...</span>
//                             </div>
//                             Loading users...
//                           </div>
//                         </td>
//                       </tr>
//                     ) : currentUsers.length > 0 ? (
//                       currentUsers.map((user, index) => (
//                         <tr key={user._id} className="table-light">
//                           <td className="fw-bold">{indexOfFirstUser + index + 1}</td>
//                           <td>
//                             <span
//                               className="text-primary"
//                               style={{ cursor: "pointer", textDecoration: "underline" }}
//                               onClick={() => handleUsernameClick(user.username, user._id)}
//                             >
//                               {user.username || "N/A"}
//                             </span>
//                           </td>
//                           <td>{user.ticketBalance || 0}</td>
//                           <td>{user.email || "N/A"}</td>
//                           <td>{user.loginType || "N/A"}</td>
//                           <td>
//                             <CButton
//                               style={{
//                                 color: "black", // Black text color
//                               }}
//                               className="me-2"
//                               onClick={() => openModal(user)}
//                             >
//                               <i className="fas fa-eye" style={{ color: "black" }}></i> {/* Black icon */}
//                             </CButton>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="6" className="text-center text-muted fw-bold py-3">
//                           No users available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Advanced Pagination */}
//               {/* Debug info - remove this after testing */}
//               {/* <div className="mb-2 text-muted small">
//                 Total users: {users.length} | Filtered users: {filteredUsers.length} | Users per page: {usersPerPage} |
//                 Current page: {currentPage}
//               </div> */}

//               {/* Pagination - show when there are more than usersPerPage items */}
//               {filteredUsers.length > 0 && (
//                 <div className="d-flex justify-content-center mt-3">
//                   <nav aria-label="Page navigation">
//                     <div className="d-flex align-items-center gap-1 p-2 bg-white rounded shadow-sm border">
//                       {/* Previous Button */}
//                       <button
//                         className="btn d-flex align-items-center justify-content-center border-0"
//                         style={{
//                           width: "40px",
//                           height: "40px",
//                           backgroundColor: currentPage === 1 ? "#e9ecef" : "#00B5E2",
//                           color: currentPage === 1 ? "#6c757d" : "#ffffff",
//                           fontWeight: "bold",
//                           cursor: currentPage === 1 ? "not-allowed" : "pointer",
//                         }}
//                         disabled={currentPage === 1}
//                         onClick={prevPage}
//                       >
//                         &#8249;
//                       </button>

//                       {/* Page Numbers */}
//                       {(() => {
//                         const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
//                         const pages = []

//                         // Only show pagination if there are multiple pages
//                         if (totalPages <= 1) {
//                           pages.push(
//                             <button
//                               key={1}
//                               className="btn d-flex align-items-center justify-content-center border-0"
//                               style={{
//                                 width: "40px",
//                                 height: "40px",
//                                 backgroundColor: "#00B5E2",
//                                 color: "#ffffff",
//                                 fontWeight: "bold",
//                                 border: "1px solid #00B5E2",
//                               }}
//                               disabled
//                             >
//                               1
//                             </button>,
//                           )
//                         } else {
//                           const getButtonStyle = (pageNum) => ({
//                             width: "40px",
//                             height: "40px",
//                             backgroundColor: currentPage === pageNum ? "#00B5E2" : "#ffffff",
//                             color: currentPage === pageNum ? "#ffffff" : "#000000",
//                             fontWeight: currentPage === pageNum ? "bold" : "normal",
//                             border: "1px solid #00B5E2",
//                           })

//                           const renderPageButton = (i) => (
//                             <button
//                               key={i}
//                               className="btn d-flex align-items-center justify-content-center border-0"
//                               style={getButtonStyle(i)}
//                               onClick={() => setCurrentPage(i)}
//                             >
//                               {i}
//                             </button>
//                           )

//                           if (totalPages <= 7) {
//                             for (let i = 1; i <= totalPages; i++) pages.push(renderPageButton(i))
//                           } else {
//                             if (currentPage <= 3) {
//                               for (let i = 1; i <= 3; i++) pages.push(renderPageButton(i))
//                               pages.push(
//                                 <span key="ellipsis1" className="d-flex align-items-center px-2 text-muted">
//                                   ...
//                                 </span>,
//                               )
//                               pages.push(renderPageButton(totalPages))
//                             } else if (currentPage >= totalPages - 2) {
//                               pages.push(renderPageButton(1))
//                               pages.push(
//                                 <span key="ellipsis2" className="d-flex align-items-center px-2 text-muted">
//                                   ...
//                                 </span>,
//                               )
//                               for (let i = totalPages - 2; i <= totalPages; i++) pages.push(renderPageButton(i))
//                             } else {
//                               pages.push(renderPageButton(1))
//                               pages.push(
//                                 <span key="ellipsis3" className="d-flex align-items-center px-2 text-muted">
//                                   ...
//                                 </span>,
//                               )
//                               for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(renderPageButton(i))
//                               pages.push(
//                                 <span key="ellipsis4" className="d-flex align-items-center px-2 text-muted">
//                                   ...
//                                 </span>,
//                               )
//                               pages.push(renderPageButton(totalPages))
//                             }
//                           }
//                         }

//                         return pages
//                       })()}

//                       {/* Next Button */}
//                       <button
//                         className="btn d-flex align-items-center justify-content-center border-0"
//                         style={{
//                           width: "40px",
//                           height: "40px",
//                           backgroundColor: indexOfLastUser >= filteredUsers.length ? "#e9ecef" : "#00B5E2",
//                           color: indexOfLastUser >= filteredUsers.length ? "#6c757d" : "#ffffff",
//                           fontWeight: "bold",
//                           cursor: indexOfLastUser >= filteredUsers.length ? "not-allowed" : "pointer",
//                         }}
//                         disabled={indexOfLastUser >= filteredUsers.length}
//                         onClick={nextPage}
//                       >
//                         &#8250;
//                       </button>
//                     </div>
//                   </nav>
//                 </div>
//               )}
//             </div>
//           </CRow>
//         </CCardBody>
//       </CCard>

//       {/* Modal for Viewing User - Updated with theme color */}
//       <CModal visible={modalVisible} onClose={closeModal} backdrop="static">
//         <CModalHeader
//           style={{
//             backgroundColor: "#00B5E2",
//             color: "white",
//             border: "none",
//           }}
//         >
//           <CModalTitle>User Details</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedUser ? (
//             <div className="px-3">
//               <p>
//                 <strong>User Name:</strong> {selectedUser.username || "N/A"}
//               </p>
//               <p>
//                 <strong>User Points:</strong> {selectedUser.ticketBalance || 0}
//               </p>
//               <p>
//                 <strong>Email:</strong> {selectedUser.email || "N/A"}
//               </p>
//               <p>
//                 <strong>Login Type:</strong> {selectedUser.loginType || "N/A"}
//               </p>
//             </div>
//           ) : (
//             <p className="text-center">No user selected</p>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton
//             style={{
//               backgroundColor: "#00B5E2",
//               borderColor: "#00B5E2",
//               color: "white",
//             }}
//             onClick={closeModal}
//           >
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   )
// }

// export default Usermanagement


"use client"

import { useState, useEffect } from "react"
import {
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react"
import { getData } from "../../../apiConfigs/apiCalls"
import { useNavigate } from "react-router-dom"
import { GET_ALL_USERS } from "../../../apiConfigs/endpoints"
import * as XLSX from "xlsx"

const Usermanagement = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const usersPerPage = 10

  const navigate = useNavigate()

  // Function to handle username click - navigate to user details page using userId
  const handleUsernameClick = async (username, userId) => {
    if (!userId) {
      alert("User ID is required")
      return
    }

    try {
      // Store the userId in sessionStorage for the user details page
      sessionStorage.setItem("selectedUserId", userId)
      sessionStorage.setItem("selectedUsername", username) // Keep username for display purposes

      // Navigate directly to the user details page with the userId
      navigate(`/user-game-details/${encodeURIComponent(userId)}`)
    } catch (error) {
      console.error("Error navigating to user details:", error)
      alert("Error navigating to user details. Please try again.")
    }
  }

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      let allUsers = []
      const currentPage = 1
      let totalPages = 1

      // Fetch first page to get total pages
      const firstResponse = await getData(`${GET_ALL_USERS}?page=1&limit=100`) // Increase limit to get more users per request
      console.log("GET_ALL_USERS Response:", firstResponse)

      if (firstResponse?.users) {
        allUsers = [...firstResponse.users]
        totalPages = firstResponse.totalPages || 1

        // If there are more pages, fetch them
        if (totalPages > 1) {
          const promises = []
          for (let page = 2; page <= totalPages; page++) {
            promises.push(getData(`${GET_ALL_USERS}?page=${page}&limit=100`))
          }

          const responses = await Promise.all(promises)
          responses.forEach((response) => {
            if (response?.users) {
              allUsers = [...allUsers, ...response.users]
            }
          })
        }
      }

      setUsers(allUsers)
      console.log(`Fetched ${allUsers.length} total users`)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filtered users based on search term
  const filteredUsers = users.filter((user) =>
    [user.username].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const nextPage = () => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const openModal = (user) => {
    setSelectedUser(user)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedUser(null)
  }

  // Function to download the users data as an Excel file
  const downloadExcel = async () => {
    setIsLoading(true)
    try {
      // Always fetch all users fresh before exporting
      let allUsers = []
      const firstResponse = await getData(`${GET_ALL_USERS}?page=1&limit=100`)
      if (firstResponse?.users) {
        allUsers = [...firstResponse.users]
        const totalPages = firstResponse.totalPages || 1
        if (totalPages > 1) {
          const promises = []
          for (let page = 2; page <= totalPages; page++) {
            promises.push(getData(`${GET_ALL_USERS}?page=${page}&limit=100`))
          }
          const responses = await Promise.all(promises)
          responses.forEach((response) => {
            if (response?.users) {
              allUsers = [...allUsers, ...response.users]
            }
          })
        }
      }
      const formattedData = allUsers.map((user, index) => ({
        UserName: user.username || "N/A",
        UserPoints: user.ticketBalance || 0,
        Email: user.email || "N/A",
        LoginType: user.loginType || "N/A",
      }))
      const ws = XLSX.utils.json_to_sheet(formattedData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Users")
      XLSX.writeFile(wb, "users_data.xlsx")
    } catch (error) {
      console.error("Error exporting users to Excel:", error)
      alert("Failed to export users. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CCard className="mb-4 shadow-lg">
        <CCardHeader
          style={{
            backgroundColor: "#00B5E2", // Blue background color for the header
            color: "white", // White text color
          }}
          className="text-center"
        >
          <h5 className="fw-bold">User Management</h5>
        </CCardHeader>

        <CCardBody>
          <CRow>
            <div className="container">
              {/* Search Bar */}
              <div className="mb-3 d-flex justify-content-between">
                <CFormInput
                  type="text"
                  placeholder="Search by Username"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page when searching
                  }}
                  className="w-50"
                />
                {/* Download Excel Button */}
                <CButton
                  style={{
                    backgroundColor: "#00B5E2",
                    borderColor: "#00B5E2",
                    color: "black",
                  }}
                  onClick={downloadExcel}
                  className="align-self-center"
                  disabled={false}
                >
                  EXPORT AS EXCEL
                </CButton>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle">
                  <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
                    <tr>
                      <th>S.No</th>
                      {/* <th>User ID</th> */}
                      <th>User Name</th>
                      <th>User Points</th>
                      <th>Email</th>
                      <th>Login Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Loading users...
                          </div>
                        </td>
                      </tr>
                    ) : currentUsers.length > 0 ? (
                      currentUsers.map((user, index) => (
                        <tr key={user._id} className="table-light">
                          <td className="fw-bold">{indexOfFirstUser + index + 1}</td>
                          {/* <td>
                            <span className="text-muted small">{user._id || "N/A"}</span>
                          </td> */}
                          <td>
                            <span
                              className="text-primary"
                              style={{ cursor: "pointer", textDecoration: "underline" }}
                              onClick={() => handleUsernameClick(user.username, user._id)}
                            >
                              {user.username || "N/A"}
                            </span>
                          </td>
                          <td>{user.ticketBalance || 0}</td>
                          <td>{user.email || "N/A"}</td>
                          <td>{user.loginType || "N/A"}</td>
                          <td>
                            <CButton
                              style={{
                                color: "black", // Black text color
                              }}
                              className="me-2"
                              onClick={() => openModal(user)}
                            >
                              <i className="fas fa-eye" style={{ color: "black" }}></i> {/* Black icon */}
                            </CButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted fw-bold py-3">
                          No users available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Advanced Pagination */}
              {/* Debug info - remove this after testing */}
              {/* <div className="mb-2 text-muted small">
                Total users: {users.length} | Filtered users: {filteredUsers.length} | Users per page: {usersPerPage} |
                Current page: {currentPage}
              </div> */}

              {/* Pagination - show when there are more than usersPerPage items */}
              {filteredUsers.length > 0 && (
                <div className="d-flex justify-content-center mt-3">
                  <nav aria-label="Page navigation">
                    <div className="d-flex align-items-center gap-1 p-2 bg-white rounded shadow-sm border">
                      {/* Previous Button */}
                      <button
                        className="btn d-flex align-items-center justify-content-center border-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: currentPage === 1 ? "#e9ecef" : "#00B5E2",
                          color: currentPage === 1 ? "#6c757d" : "#ffffff",
                          fontWeight: "bold",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        }}
                        disabled={currentPage === 1}
                        onClick={prevPage}
                      >
                        &#8249;
                      </button>

                      {/* Page Numbers */}
                      {(() => {
                        const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
                        const pages = []

                        // Only show pagination if there are multiple pages
                        if (totalPages <= 1) {
                          pages.push(
                            <button
                              key={1}
                              className="btn d-flex align-items-center justify-content-center border-0"
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#00B5E2",
                                color: "#ffffff",
                                fontWeight: "bold",
                                border: "1px solid #00B5E2",
                              }}
                              disabled
                            >
                              1
                            </button>,
                          )
                        } else {
                          const getButtonStyle = (pageNum) => ({
                            width: "40px",
                            height: "40px",
                            backgroundColor: currentPage === pageNum ? "#00B5E2" : "#ffffff",
                            color: currentPage === pageNum ? "#ffffff" : "#000000",
                            fontWeight: currentPage === pageNum ? "bold" : "normal",
                            border: "1px solid #00B5E2",
                          })

                          const renderPageButton = (i) => (
                            <button
                              key={i}
                              className="btn d-flex align-items-center justify-content-center border-0"
                              style={getButtonStyle(i)}
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>
                          )

                          if (totalPages <= 7) {
                            for (let i = 1; i <= totalPages; i++) pages.push(renderPageButton(i))
                          } else {
                            if (currentPage <= 3) {
                              for (let i = 1; i <= 3; i++) pages.push(renderPageButton(i))
                              pages.push(
                                <span key="ellipsis1" className="d-flex align-items-center px-2 text-muted">
                                  ...
                                </span>,
                              )
                              pages.push(renderPageButton(totalPages))
                            } else if (currentPage >= totalPages - 2) {
                              pages.push(renderPageButton(1))
                              pages.push(
                                <span key="ellipsis2" className="d-flex align-items-center px-2 text-muted">
                                  ...
                                </span>,
                              )
                              for (let i = totalPages - 2; i <= totalPages; i++) pages.push(renderPageButton(i))
                            } else {
                              pages.push(renderPageButton(1))
                              pages.push(
                                <span key="ellipsis3" className="d-flex align-items-center px-2 text-muted">
                                  ...
                                </span>,
                              )
                              for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(renderPageButton(i))
                              pages.push(
                                <span key="ellipsis4" className="d-flex align-items-center px-2 text-muted">
                                  ...
                                </span>,
                              )
                              pages.push(renderPageButton(totalPages))
                            }
                          }
                        }

                        return pages
                      })()}

                      {/* Next Button */}
                      <button
                        className="btn d-flex align-items-center justify-content-center border-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: indexOfLastUser >= filteredUsers.length ? "#e9ecef" : "#00B5E2",
                          color: indexOfLastUser >= filteredUsers.length ? "#6c757d" : "#ffffff",
                          fontWeight: "bold",
                          cursor: indexOfLastUser >= filteredUsers.length ? "not-allowed" : "pointer",
                        }}
                        disabled={indexOfLastUser >= filteredUsers.length}
                        onClick={nextPage}
                      >
                        &#8250;
                      </button>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Modal for Viewing User - Updated with theme color */}
      <CModal visible={modalVisible} onClose={closeModal} backdrop="static">
        <CModalHeader
          style={{
            backgroundColor: "#00B5E2",
            color: "white",
            border: "none",
          }}
        >
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser ? (
            <div className="px-3">
              <p>
                <strong>User ID:</strong> {selectedUser._id || "N/A"}
              </p>
              <p>
                <strong>User Name:</strong> {selectedUser.username || "N/A"}
              </p>
              <p>
                <strong>User Points:</strong> {selectedUser.ticketBalance || 0}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email || "N/A"}
              </p>
              <p>
                <strong>Login Type:</strong> {selectedUser.loginType || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-center">No user selected</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            style={{
              backgroundColor: "#00B5E2",
              borderColor: "#00B5E2",
              color: "white",
            }}
            onClick={closeModal}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Usermanagement
