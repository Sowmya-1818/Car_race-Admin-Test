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
} from "@coreui/react"
import { getData, postData } from "../../../src/apiConfigs/apiCalls"
import { GET_ALL_DAILY_REWARD, SET_DAILY_REWARD } from "../../../src/apiConfigs/endpoints"

const Dailyrewards = () => {
  const [rewards, setRewards] = useState([])
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState({ rewardPoints: "", Status: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const rewardsPerPage = 10

  const fetchRewards = async () => {
    try {
      const response = await getData(GET_ALL_DAILY_REWARD)
      console.log("GET_ALL_DAILY_REWARD Response:", response)
      setRewards(response?.data || [])
    } catch (error) {
      console.error("Error fetching rewards:", error)
      setError(error.message)
    }
  }

  useEffect(() => {
    fetchRewards()
  }, [])

  const indexOfLastReward = currentPage * rewardsPerPage
  const indexOfFirstReward = indexOfLastReward - rewardsPerPage
  const currentRewards = rewards.slice(indexOfFirstReward, indexOfLastReward)

  const nextPage = () => {
    if (indexOfLastReward < rewards.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleEditClick = (reward) => {
    setSelectedReward({ ...reward })
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedReward((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      await postData(SET_DAILY_REWARD, selectedReward)
      setShowModal(false)
      fetchRewards()
    } catch (error) {
      console.error("Error updating reward:", error)
    }
  }

  return (
    <CCard className="mb-4 shadow-lg">
      <CCardHeader
        style={{
          backgroundColor: "#00B5E2", // Blue background color for the header
          color: "white", // White text color
        }}
        className="text-center"
      >
        <h5 className="fw-bold">Daily Rewards</h5>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <div className="container">
            <div className="table-responsive">
              <table className="table table-bordered table-hover text-center align-middle">
                <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
                  <tr>
                    <th>S.No</th>
                    <th>Points</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRewards.length > 0 ? (
                    currentRewards.map((reward, index) => (
                      <tr key={reward._id} className="table-light">
                        <td className="fw-bold">{indexOfFirstReward + index + 1}</td>
                        <td>{reward.points|| 0}</td>
                        <td>{reward.status|| "N/A"}</td>
                        <td>
                          <CButton
                            style={{
                              // backgroundColor: "#00B5E2", // Blue color for the button
                              // borderColor: "#00B5E2",
                              color: "Black", // White text color
                            }}
                            className="me-2"
                            onClick={() => handleEditClick(reward)}
                          >
                            <i className="fas fa-edit" style={{ fontSize: "15px" }} />
                          </CButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted fw-bold py-3">
                        No rewards available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center align-items-center mt-4">
              <CButton
                style={{
                  backgroundColor: "#00B5E2", // Blue color for the button
                  borderColor: "#00B5E2",
                  color: "black", // Black text color
                }}
                className="me-3"
                disabled={currentPage === 1}
                onClick={prevPage}
              >
                ← Prev
              </CButton>
              <span className="fw-bold text-secondary">
                Page {currentPage} of {Math.ceil(rewards.length / rewardsPerPage)}
              </span>
              <CButton
                style={{
                  backgroundColor: "#00B5E2", // Blue color for the button
                  borderColor: "#00B5E2",
                  color: "black", // Black text color
                }}
                className="ms-3"
                disabled={indexOfLastReward >= rewards.length}
                onClick={nextPage}
              >
                Next →
              </CButton>
            </div>
          </div>
        </CRow>
      </CCardBody>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader
          style={{
            backgroundColor: "#00B5E2", // Blue background color for the header
            color: "white", // White text color
          }}
        >
          Edit Reward
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="rewardPoints"
              name="rewardPoints"
              type="number"
              value={selectedReward?.rewardPoints || ""}
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              label="Status"
              name="Status"
              value={selectedReward?.Status || "Active"}
              onChange={handleChange}
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </CButton>
          <CButton
            style={{
              backgroundColor: "#00B5E2", // Blue color for the button
              borderColor: "#00B5E2",
              color: "white", // White text color
            }}
            onClick={handleSave}
          >
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Dailyrewards
