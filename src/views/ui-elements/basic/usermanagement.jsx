"use client";

import { useState, useEffect } from "react";
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
} from "@coreui/react";
import { getData } from "../../../apiConfigs/apiCalls";
import { useNavigate } from "react-router-dom";
import { GET_ALL_USERS } from "../../../apiConfigs/endpoints";
import * as XLSX from "xlsx";

const Usermanagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const usersPerPage = 10;

  const navigate = useNavigate();

  // Fetch users from backend with pagination and search
  const fetchUsers = async (page = 1, username = "") => {
    setIsLoading(true);
    try {
      // const url = `${GET_ALL_USERS}?page=${page}&limit=${usersPerPage}${username ? `&username=${encodeURIComponent(username)}` : ""}`;
      const response = await getData(`${GET_ALL_USERS}?page=1&limit=10000000000000000000000000000000000000000000`)
      if (response?.users) {
        setUsers(response.users);
        setTotalPages(response.totalPages || 1);
        setCount(response.count || 0);
      } else {
        setUsers([]);
        setTotalPages(1);
        setCount(0);
      }
    } catch (error) {
      setUsers([]);
      setTotalPages(1);
      setCount(0);
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  // Download all users as Excel (fetch all pages from backend)
const downloadExcel = async () => {
  setIsLoading(true);
  try {
    // Use a reasonable high limit, e.g., 100000 (not a huge number)
    const response = await getData(`${GET_ALL_USERS}?page=1&limit=100000000000000000000000000000000${searchTerm ? `&username=${encodeURIComponent(searchTerm)}` : ""}`);
    const allUsers = response?.users || [];

    if (!allUsers.length) {
      alert("No data to export");
      return;
    }

    const formattedData = allUsers.map((user, index) => ({
      UserId: user._id || "N/A",
      UserName: user.username || "N/A",
      UserPoints: user.ticketBalance || 0,
      Email: user.email || "N/A",
      LoginType: user.loginType || "N/A"
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AllUsers");
    XLSX.writeFile(wb, "all_users.xlsx");
  } catch (error) {
    alert("Failed to export users. Please try again.");
    console.error("Error exporting users to Excel:", error);
  } finally {
    setIsLoading(false);
  }
};

  // Function to handle username click - navigate to user details page using userId
  const handleUsernameClick = async (username, userId) => {
    if (!userId) {
      alert("User ID is required");
      return;
    }

    try {
      // Store the userId in sessionStorage for the user details page
      sessionStorage.setItem("selectedUserId", userId);
      sessionStorage.setItem("selectedUsername", username); // Keep username for display purposes

      // Navigate directly to the user details page with the userId
      navigate(`/user-game-details/${encodeURIComponent(userId)}`);
    } catch (error) {
      console.error("Error navigating to user details:", error);
      alert("Error navigating to user details. Please try again.");
    }
  };

  return (
    <>
      <CCard className="mb-4 shadow-lg">
        <CCardHeader
          style={{
            backgroundColor: "#00B5E2",
            color: "white",
          }}
          className="text-center"
        >
          <h5 className="fw-bold">User Management</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <div className="container">
              <div className="mb-3 d-flex justify-content-between">
                <CFormInput
                  type="text"
                  placeholder="Search by Username"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-50"
                />
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
                        <td colSpan="6" className="text-center py-4">
                          <div className="d-flex justify-content-center align-items-center">
                            <div
                              className="spinner-border text-primary me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            Loading users...
                          </div>
                        </td>
                      </tr>
                    ) : users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user._id} className="table-light">
                          <td className="fw-bold">
                            {(currentPage - 1) * usersPerPage + index + 1}
                          </td>
                          <td>
                            <span
                              className="text-primary"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() =>
                                handleUsernameClick(user.username, user._id)
                              }
                            >
                              {user.username || "N/A"}
                            </span>
                          </td>
                          <td>{user.ticketBalance || 0}</td>
                          <td>{user.email || "N/A"}</td>
                          <td>{user.loginType || "N/A"}</td>
                          <td>
                            <CButton
                              style={{ color: "black" }}
                              className="me-2"
                              onClick={() => openModal(user)}
                            >
                              <i
                                className="fas fa-eye"
                                style={{ color: "black" }}
                              ></i>
                            </CButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center text-muted fw-bold py-3"
                        >
                          No users available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
             {/* Pagination */}
{totalPages > 1 && (
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

        {/* Page Numbers with Ellipsis */}
        {currentPage > 3 && (
          <>
            <button
              className="btn d-flex align-items-center justify-content-center border-0"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: currentPage === 1 ? "#00B5E2" : "#ffffff",
                color: currentPage === 1 ? "#ffffff" : "#000000",
                fontWeight: currentPage === 1 ? "bold" : "normal",
                border: "1px solid #00B5E2",
              }}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <span
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#6c757d",
              }}
            >
              ...
            </span>
          </>
        )}

        {[...Array(totalPages)]
          .map((_, i) => i + 1)
          .filter(
            (page) =>
              page === currentPage || // Always show the current page
              page === currentPage - 1 || // Show the page before the current page
              page === currentPage + 1 // Show the page after the current page
          )
          .map((page) => (
            <button
              key={page}
              className="btn d-flex align-items-center justify-content-center border-0"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: currentPage === page ? "#00B5E2" : "#ffffff",
                color: currentPage === page ? "#ffffff" : "#000000",
                fontWeight: currentPage === page ? "bold" : "normal",
                border: "1px solid #00B5E2",
              }}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

        {currentPage < totalPages - 2 && (
          <>
            <span
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#6c757d",
              }}
            >
              ...
            </span>
            <button
              className="btn d-flex align-items-center justify-content-center border-0"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: currentPage === totalPages ? "#00B5E2" : "#ffffff",
                color: currentPage === totalPages ? "#ffffff" : "#000000",
                fontWeight: currentPage === totalPages ? "bold" : "normal",
                border: "1px solid #00B5E2",
              }}
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          className="btn d-flex align-items-center justify-content-center border-0"
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: currentPage === totalPages ? "#e9ecef" : "#00B5E2",
            color: currentPage === totalPages ? "#6c757d" : "#ffffff",
            fontWeight: "bold",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
          disabled={currentPage === totalPages}
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
  );
};

export default Usermanagement;
