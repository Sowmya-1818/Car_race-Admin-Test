"use client";

import { useState, useEffect } from "react";
import {
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CButton,
  CAlert,
  CSpinner,
  CFormSelect,
  CFormTextarea,
} from "@coreui/react";
import { getData, postData } from "../../../apiConfigs/apiCalls";
import {
  GET_WITHDRAWAL_LIMITS,
  CREATE_WITHDRAW_LIMITS,
  UPDATE_WITHDRAW_LIMITS,
} from "../../../apiConfigs/endpoints";

const WithdrawalMethods = () => {
  const [methods, setMethods] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const methodsPerPage = 10;

  // Fetch withdrawal methods from API
  const fetchMethods = async () => {
    setLoading(true);
    try {
      const response = await getData(GET_WITHDRAWAL_LIMITS);
      console.log("API Response:", response);

      // Ensure methods is always an array
      let methodsData = [];
      if (response?.data && Array.isArray(response.data)) {
        methodsData = response.data;
      } else if (response?.data) {
        methodsData = [response.data];
      } else if (Array.isArray(response)) {
        methodsData = response;
      }

      setMethods(methodsData);
      setError(null);
    } catch (error) {
      console.error("Fetch methods error:", error);
      setError("Failed to load withdrawal methods. Please try again.");
      setMethods([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  // Ensure methods is an array before slicing
  const safeMethodsArray = Array.isArray(methods) ? methods : [];
  const indexOfLastMethod = currentPage * methodsPerPage;
  const indexOfFirstMethod = indexOfLastMethod - methodsPerPage;
  const currentMethods = safeMethodsArray.slice(
    indexOfFirstMethod,
    indexOfLastMethod
  );

  const nextPage = () => {
    if (indexOfLastMethod < methods.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleAdd = () => {
    setSelectedMethod({
      Token_Mint: "",
      Symbol: "",
      minWithdrawal: 0,
      maxWithdrawal: 0,
      Fixed_Charge: 0,
      Percentage_Charge: 0,
      Fee_wallet: "",
      Withdraw_Note: "",
      withdrawallimits: 0,
      status: "ACTIVE",
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setShowModal(true);
  };

  const handleEditClick = (method) => {
    setSelectedMethod({ ...method });
    setIsEditing(true);
    setError(null);
    setSuccess(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedMethod((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userId = localStorage.getItem("id");
      if (!userId) throw new Error("User ID not found. Please log in again.");

      const requestBody = {
        Token_Mint: selectedMethod.Token_Mint,
        Symbol: selectedMethod.Symbol,
        minWithdrawal: Number(selectedMethod.minWithdrawal),
        maxWithdrawal: Number(selectedMethod.maxWithdrawal),
        Fixed_Charge: Number(selectedMethod.Fixed_Charge),
        Percentage_Charge: Number(selectedMethod.Percentage_Charge),
        Fee_wallet: selectedMethod.Fee_wallet,
        Withdraw_Note: selectedMethod.Withdraw_Note,
        withdrawalCount: Number(selectedMethod.withdrawalCount), // Ensure correct key here
        status: selectedMethod.status,
        addedBy: userId,
      };

      let response;
      if (isEditing) {
        requestBody.id = selectedMethod._id;
        response = await postData(UPDATE_WITHDRAW_LIMITS, requestBody);
      } else {
        response = await postData(CREATE_WITHDRAW_LIMITS, requestBody);
      }

      if (response && response.success) {
        setSuccess(
          `Withdrawal method ${isEditing ? "updated" : "added"} successfully!`
        );
        setTimeout(() => {
          setShowModal(false);
          setSuccess(null);
          fetchMethods();
        }, 1500);
      } else {
        throw new Error("Failed to save withdrawal method");
      }
    } catch (error) {
      console.error("Save error:", error);
      setError(
        `Failed to ${isEditing ? "update" : "add"} method: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CCard className="mb-4 shadow-lg">
      <CCardHeader
        style={{ backgroundColor: "#00B5E2", color: "white" }}
        className="d-flex justify-content-between align-items-center"
      >
        <h5 className="fw-bold">Withdrawal Methods</h5>
        <CButton
          style={{
            backgroundColor: "white",
            color: "black",
            borderColor: "white",
          }}
          className="fw-bold"
          onClick={handleAdd}
        >
          + Add Method
        </CButton>
      </CCardHeader>
      <CCardBody>
        {error && (
          <CAlert color="danger" dismissible onClose={() => setError(null)}>
            {error}
          </CAlert>
        )}

        {success && (
          <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
            {success}
          </CAlert>
        )}

        {loading && !showModal && (
          <div className="text-center my-3">
            <CSpinner color="primary" />
            <p className="mt-2">Loading withdrawal methods...</p>
          </div>
        )}

        <CRow>
          <div className="container">
            <div className="table-responsive">
              <table className="table table-bordered table-hover text-center align-middle">
                <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
                  <tr>
                    <th>S.No</th>
                    <th>Token Mint</th>
                    <th>Symbol</th>
                    <th>Created At</th>
                    <th>Min Withdrawal</th>
                    <th>Max Withdrawal</th>
                    <th>Fixed Charge</th>
                    <th>Percentage Charge</th>
                    <th>Fee Wallet</th>
                    <th>Withdraw Note</th>
                    <th>Withdrawal Limits</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMethods.length > 0 ? (
                    currentMethods.map((method, index) => (
                      <tr key={method._id} className="table-light">
                        <td className="fw-bold">
                          {indexOfFirstMethod + index + 1}
                        </td>
                        <td>
                          <span title={method.Token_Mint}>
                            {method.Token_Mint
                              ? `${method.Token_Mint.slice(0, 6)}...${method.Token_Mint.slice(-4)}`
                              : "N/A"}
                          </span>
                        </td>
                        <td className="fw-bold">{method.Symbol || "N/A"}</td>
                        <td>
                          {method.createdAt|| "N/A"}
                        </td>
                        <td>{method.minWithdrawal ?? 0}</td>
                        <td>{method.maxWithdrawal ?? 0}</td>
                        <td>{method.Fixed_Charge ?? 0}</td>
                        <td>{method.Percentage_Charge ?? 0}%</td>
                        <td>
                          <span title={method.Fee_wallet}>
                            {method.Fee_wallet
                              ? `${method.Fee_wallet.slice(0, 6)}...${method.Fee_wallet.slice(-4)}`
                              : "N/A"}
                          </span>
                        </td>
                        <td>
                          <span title={method.Withdraw_Note}>
                            {method.Withdraw_Note
                              ? method.Withdraw_Note.length > 20
                                ? `${method.Withdraw_Note.slice(0, 20)}...`
                                : method.Withdraw_Note
                              : "N/A"}
                          </span>
                        </td>
                        <td>{method.withdrawalCount ?? 0}</td>
                        <td>
                          <span
                            className={`badge bg-${method.status === "ACTIVE" ? "success" : "secondary"}`}
                          >
                            {method.status}
                          </span>
                        </td>
                        <td>
                          <CButton
                            style={{ color: "black" }}
                            className="me-2"
                            onClick={() => handleEditClick(method)}
                          >
                            <i
                              className="fas fa-edit"
                              style={{ color: "black" }}
                            ></i>
                          </CButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="12"
                        className="text-center text-muted fw-bold py-3"
                      >
                        {loading
                          ? "Loading..."
                          : "No withdrawal methods available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center align-items-center mt-4">
              <CButton
                style={{
                  backgroundColor: "#00B5E2",
                  borderColor: "#00B5E2",
                  color: "black",
                }}
                className="me-3"
                disabled={currentPage === 1}
                onClick={prevPage}
              >
                ← Prev
              </CButton>
              <span className="fw-bold text-secondary">
                Page {currentPage} of{" "}
                {Math.ceil(safeMethodsArray.length / methodsPerPage) || 1}
              </span>
              <CButton
                style={{
                  backgroundColor: "#00B5E2",
                  borderColor: "#00B5E2",
                  color: "black",
                }}
                className="ms-3"
                disabled={indexOfLastMethod >= safeMethodsArray.length}
                onClick={nextPage}
              >
                Next →
              </CButton>
            </div>
          </div>
        </CRow>
      </CCardBody>

      {/* Modal */}
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        backdrop="static"
        size="lg"
      >
        <CModalHeader style={{ backgroundColor: "#00B5E2", color: "white" }}>
          {isEditing ? "Edit Withdrawal Method" : "Add New Withdrawal Method"}
        </CModalHeader>
        <CModalBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}

          {success && (
            <CAlert
              color="success"
              dismissible
              onClose={() => setSuccess(null)}
            >
              {success}
            </CAlert>
          )}

          <CForm>
            <div className="row">
              <div className="col-md-6">
                <CFormInput
                  label="Token Mint Address"
                  name="Token_Mint"
                  value={selectedMethod.Token_Mint || ""}
                  onChange={handleChange}
                  className="mb-3"
                  placeholder="Enter token mint address"
                  required
                />
              </div>
              <div className="col-md-6">
                <CFormInput
                  label="Symbol"
                  name="Symbol"
                  value={selectedMethod.Symbol || ""}
                  onChange={handleChange}
                  className="mb-3"
                  placeholder="e.g., SOL, USDT, BTC"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <CFormInput
                  label="Minimum Withdrawal"
                  name="minWithdrawal"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={selectedMethod.minWithdrawal || ""}
                  onChange={handleChange}
                  className="mb-3"
                  placeholder="Enter minimum withdrawal amount"
                />
              </div>
              <div className="col-md-6">
                <CFormInput
                  label="Maximum Withdrawal"
                  name="maxWithdrawal"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={selectedMethod.maxWithdrawal || ""}
                  onChange={handleChange}
                  className="mb-3"
                  placeholder="Enter maximum withdrawal amount"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <CFormInput
                  label="Fixed Charge"
                  name="Fixed_Charge"
                  type="number"
                  step="0.000001"
                  min="0"
                  value={selectedMethod.Fixed_Charge || ""}
                  onChange={handleChange}
                  className="mb-3"
                  placeholder="Enter fixed charge amount"
                />
              </div>
              <div className="col-md-6">
                <CFormInput
                  label="Percentage Charge (%)"
                  name="Percentage_Charge"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={selectedMethod.Percentage_Charge || ""}
                  onChange={handleChange}
                  className="mb-3"
                  placeholder="Enter percentage charge"
                />
              </div>
            </div>

            <CFormInput
              label="Fee Wallet Address"
              name="Fee_wallet"
              value={selectedMethod.Fee_wallet || ""}
              onChange={handleChange}
              className="mb-3"
              placeholder="Enter fee wallet address"
              required
            />

            <CFormTextarea
              label="Withdrawal Note"
              name="Withdraw_Note"
              value={selectedMethod.Withdraw_Note || ""}
              onChange={handleChange}
              className="mb-3"
              placeholder="Enter withdrawal instructions or notes"
              rows={3}
            />

            <CFormInput
              label="Withdrawal Limits"
              name="withdrawalCount"
              type="number"
              min="0"
              value={selectedMethod.withdrawalCount || ""}
              onChange={handleChange}
              className="mb-3"
              placeholder="Enter withdrawal limits count"
            />

            <CFormSelect
              label="Status"
              name="status"
              value={selectedMethod.status || "ACTIVE"}
              onChange={handleChange}
              className="mb-3"
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowModal(false)}
            disabled={loading}
          >
            Cancel
          </CButton>
          <CButton
            style={{
              backgroundColor: "#00B5E2",
              borderColor: "#00B5E2",
              color: "white",
            }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Add Method"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default WithdrawalMethods;
