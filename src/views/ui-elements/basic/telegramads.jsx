"use client"

import { useState, useEffect } from "react"
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
} from "@coreui/react"
import { getData, postData } from "../../../apiConfigs/apiCalls"
import { GET_ALL_ADS, ADD_AD, UPDATE_AD } from "../../../apiConfigs/endpoints"

const TelegramAds = () => {
  const [ads, setAds] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedAd, setSelectedAd] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [isLoadingAds, setIsLoadingAds] = useState(false)

  // Backend pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAds, setTotalAds] = useState(0)
  const adsPerPage = 10

  // Updated fetchAds function to use backend pagination
  const fetchAds = async (page = 1, limit = adsPerPage) => {
    setIsLoadingAds(true)
    try {
      // Build query parameters for backend pagination
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      const response = await getData(`${GET_ALL_ADS}?${queryParams.toString()}`)

      // Update state with backend pagination data
      setAds(response?.data || response?.ads || [])
      setTotalPages(response?.totalPages || 1)
      setTotalAds(response?.count || response?.total || response?.total_no_of_ads || 0)
      setCurrentPage(response?.page || page)
      setError(null)
    } catch (error) {
      setError("Failed to load ads. Please try again.")
      // Reset to empty state on error
      setAds([])
      setTotalPages(1)
      setTotalAds(0)
      setCurrentPage(1)
    } finally {
      setIsLoadingAds(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchAds(1, adsPerPage)
  }, [])

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage)
      fetchAds(newPage, adsPerPage)
    }
  }

  const nextPage = () => {
    handlePageChange(currentPage + 1)
  }

  const prevPage = () => {
    handlePageChange(currentPage - 1)
  }

  const handleAddAd = () => {
    setSelectedAd({
      AdName: "",
      AdSDK: "",
      AdCount: 0,
      AdTimer_InMinutes: 1,
      AdImage: "",
      Rewardpoints: 0,
      Status: "ACTIVE",
    })
    setIsEditing(false)
    setError(null)
    setSuccess(null)
    setShowModal(true)
  }

  const handleEditClick = (ad) => {
    setSelectedAd({ ...ad })
    setIsEditing(true)
    setError(null)
    setSuccess(null)
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedAd((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const userId = localStorage.getItem("id")

      if (!userId) {
        throw new Error("User ID not found. Please log in again.")
      }

      const requestBody = {
        AdName: selectedAd.AdName,
        AdSDK: selectedAd.AdSDK,
        AdCount: selectedAd.AdCount,
        AdTimer_InMinutes: selectedAd.AdTimer_InMinutes,
        AdImage: selectedAd.AdImage,
        Rewardpoints: selectedAd.Rewardpoints,
        Status: selectedAd.Status,
        AddedBy: userId,
      }

      let response
      if (isEditing) {
        requestBody.AdId = selectedAd._id
        response = await postData(UPDATE_AD, requestBody)
      } else {
        response = await postData(ADD_AD, requestBody)
      }

      setSuccess(`${isEditing ? "Ad updated" : "Ad added"} successfully!`)

      setTimeout(() => {
        setShowModal(false)
        // Refresh current page data
        fetchAds(currentPage, adsPerPage)
      }, 1500)
    } catch (error) {
      setError(
        `Failed to ${isEditing ? "update" : "add"} ad: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard className="mb-4 shadow-lg">
      <CCardHeader
        style={{ backgroundColor: "#00B5E2", color: "white" }}
        className="d-flex justify-content-between align-items-center"
      >
        <h5 className="fw-bold">Telegram Ads</h5>
        <CButton
          style={{ backgroundColor: "white", color: "black", borderColor: "white" }}
          className="fw-bold"
          onClick={handleAddAd}
        >
          + Add
        </CButton>
      </CCardHeader>
      <CCardBody>
        {error && !showModal && (
          <CAlert color="danger" dismissible onClose={() => setError(null)}>
            {error}
          </CAlert>
        )}

        {success && !showModal && (
          <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
            {success}
          </CAlert>
        )}

        <CRow>
          <div className="container">
            {/* Remove the entire search bar section and replace with just the total count */}
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {isLoadingAds && (
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
              {/* <span className="text-muted small">Total Ads: {totalAds}</span> */}
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover text-center align-middle">
                <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
                  <tr>
                    <th>S.No</th>
                    <th>Ad Name</th>
                    <th>Ad Function</th>
                    <th>Ad Count</th>
                    <th>Ad Timer (Minutes)</th>
                    <th>Ad Image</th>
                    <th>Reward Points</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingAds ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2">Loading ads...</div>
                      </td>
                    </tr>
                  ) : ads.length > 0 ? (
                    ads.map((ad, index) => (
                      <tr key={ad._id} className="table-light">
                        <td className="fw-bold">{(currentPage - 1) * adsPerPage + index + 1}</td>
                        <td>{ad.AdName || "N/A"}</td>
                        <td>{ad.AdSDK || "N/A"}</td>
                        <td>{ad.AdCount || 0}</td>
                        <td>{ad.AdTimer_InMinutes || 0}</td>
                        <td>
                          {ad.AdImage ? (
                            <img
                              src={ad.AdImage || "/placeholder.svg"}
                              alt="Ad"
                              style={{ width: "30px", height: "30px", objectFit: "contain" }}
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/placeholder.svg?height=30&width=30"
                              }}
                            />
                          ) : (
                            <span>No image</span>
                          )}
                        </td>
                        <td>{ad.Rewardpoints || 0}</td>
                        <td>
                          <span className={`badge bg-${ad.Status === "ACTIVE" ? "success" : "secondary"}`}>
                            {ad.Status}
                          </span>
                        </td>
                        <td>
                          <CButton className="me-2" onClick={() => handleEditClick(ad)}>
                            <i className="fas fa-edit" style={{ color: "black" }}></i>
                          </CButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center text-muted fw-bold py-3">
                        No ads available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Backend Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted small">
                  Showing {(currentPage - 1) * adsPerPage + 1} to {Math.min(currentPage * adsPerPage, totalAds)} of{" "}
                  {totalAds} ads
                </div>

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
                      disabled={currentPage === 1 || isLoadingAds}
                      onClick={prevPage}
                    >
                      &#8249;
                    </button>

                    {/* Page Numbers */}
                    {(() => {
                      const pages = []
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
                          onClick={() => handlePageChange(i)}
                          disabled={isLoadingAds}
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

                      return pages
                    })()}

                    {/* Next Button */}
                    <button
                      className="btn d-flex align-items-center justify-content-center border-0"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: currentPage >= totalPages ? "#e9ecef" : "#00B5E2",
                        color: currentPage >= totalPages ? "#6c757d" : "#ffffff",
                        fontWeight: "bold",
                        cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                      }}
                      disabled={currentPage >= totalPages || isLoadingAds}
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

      {/* Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
        <CModalHeader style={{ backgroundColor: "#00B5E2", color: "white" }}>
          {isEditing ? "Edit Ad" : "Add New Ad"}
        </CModalHeader>
        <CModalBody>
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

          <CForm>
            <CFormInput
              label="Ad Name"
              name="AdName"
              value={selectedAd.AdName}
              onChange={handleChange}
              className="mb-3"
              required
            />
            <CFormInput
              label="Ad Function (SDK)"
              name="AdSDK"
              value={selectedAd.AdSDK}
              onChange={handleChange}
              className="mb-3"
              required
            />
            <CFormInput
              label="Ad Count"
              name="AdCount"
              type="number"
              value={selectedAd.AdCount}
              onChange={handleChange}
              className="mb-3"
              required
            />
            <CFormInput
              label="Timer (Minutes)"
              name="AdTimer_InMinutes"
              type="number"
              value={selectedAd.AdTimer_InMinutes}
              onChange={handleChange}
              className="mb-3"
              required
            />
            <CFormInput
              label="Image URL"
              name="AdImage"
              value={selectedAd.AdImage}
              onChange={handleChange}
              className="mb-3"
            />
            {selectedAd.AdImage && (
              <div className="text-center mb-3">
                <img
                  src={selectedAd.AdImage || "/placeholder.svg"}
                  alt="Ad Preview"
                  style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?height=150&width=200"
                  }}
                />
              </div>
            )}
            <CFormInput
              label="Reward Points"
              name="Rewardpoints"
              type="number"
              value={selectedAd.Rewardpoints}
              onChange={handleChange}
              className="mb-3"
              required
            />
            <CFormSelect
              label="Status"
              name="Status"
              value={selectedAd.Status}
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
          <CButton color="secondary" onClick={() => setShowModal(false)} disabled={loading}>
            Cancel
          </CButton>
          <CButton style={{ backgroundColor: "#00B5E2", color: "white" }} onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" /> {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Add"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default TelegramAds
