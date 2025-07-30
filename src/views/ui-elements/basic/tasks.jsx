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
} from "@coreui/react";
import { getData, postData } from "../../../apiConfigs/apiCalls";
import { GET_TASK, ADD_TASK, UPDATE_TASK } from "../../../apiConfigs/endpoints";

const AddTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const [loading, setLoading] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await getData(GET_TASK);
      setTasks(response?.allTasks || []);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const nextPage = () => {
    if (indexOfLastTask < tasks.length) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Open modal for new task
  const handleAddTask = () => {
    setSelectedTask({
      TaskName: "",
      TaskImage: "",
      Subtask: "",
      Description: "",
      Rewardpoints: 0,
      Sitelink: "",
      Siteimg: "",
      Status: "ACTIVE",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Open modal for editing task
  const handleEditClick = (task) => {
    setSelectedTask({ ...task });
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask((prev) => ({ ...prev, [name]: value }));
  };

  // Save or update task
  const handleSave = async () => {
    setLoading(true);
    try {
      const requestBody = { ...selectedTask };
      if (isEditing) {
        requestBody.taskId = selectedTask._id;
        await postData(UPDATE_TASK, requestBody);
        setSuccess("Task updated successfully!");
      } else {
        await postData(ADD_TASK, requestBody);
        setSuccess("Task added successfully!");
      }
      setTimeout(() => {
        setShowModal(false);
        fetchTasks();
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CCard className="mb-4 shadow-lg">
      <CCardHeader
        style={{
          backgroundColor: "#00B5E2", 
          color: "white", 
        }}
        className="d-flex justify-content-between align-items-center"
      >
        <h5 className="fw-bold">Tasks</h5>
        <CButton
          style={{
            backgroundColor: "white",
            color: "black",
            borderColor: "white",
          }}
          className="fw-bold"
          onClick={handleAddTask}
        >
          + Add Task
        </CButton>
      </CCardHeader>
      <CCardBody>
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
        <CRow>
          <div className="container">
            <div className="table-responsive">
              <table className="table table-bordered table-hover text-center align-middle">
                <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
                  <tr>
                    <th>S.No</th>
                    <th>Task Name</th>
                    <th>Task Image</th>
                    <th>Sub Task</th>
                    <th>Task Description</th>
                    <th>Reward Points</th>
                    <th>Site Link</th>
                    <th>Site Image</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.length > 0 ? (
                    currentTasks.map((task, index) => (
                      <tr key={task._id} className="table-light">
                        <td className="fw-bold">
                          {indexOfFirstTask + index + 1}
                        </td>
                        <td>{task.TaskName || "N/A"}</td>
                        <td>
                          {task.TaskImage ? (
                            <img
                              src={task.TaskImage}
                              alt="Task"
                              style={{
                                width: "30px",
                                height: "30px",
                                objectFit: "contain",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                // e.target.src = "/placeholder.svg"; // fallback image if loading fails
                              }}
                            />
                          ) : (
                            <span>No image</span>
                          )}
                        </td>
                        <td>{task.Subtask || "N/A"}</td>
                        <td>{task.Description || "N/A"}</td>
                        <td>{task.Rewardpoints || "N/A"}</td>
                        <td>{task.Sitelink || "N/A"}</td>
                        <td>
                          {task.Siteimg ? (
                            <img
                              src={task.Siteimg}
                              alt="Site"
                              style={{
                                width: "30px",
                                height: "30px",
                                objectFit: "contain",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                // e.target.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <span>No image</span>
                          )}
                        </td>
                        <td>{task.Status || "N/A"}</td>
                        <td>
                          <CButton
                            style={{
                              color: "black", // Black text color for the button
                            }}
                            className="me-2"
                            onClick={() => handleEditClick(task)}
                          >
                            <i
                              className="fas fa-edit"
                              style={{ color: "black" }}
                            ></i>{" "}
                            {/* Black icon */}
                          </CButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center text-muted fw-bold py-3"
                      >
                        No tasks available
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
                Page {currentPage} of {Math.ceil(tasks.length / tasksPerPage)}
              </span>
              <CButton
                style={{
                  backgroundColor: "#00B5E2", // Blue color for the button
                  borderColor: "#00B5E2",
                  color: "black", // Black text color
                }}
                className="ms-3"
                disabled={indexOfLastTask >= tasks.length}
                onClick={nextPage}
              >
                Next →
              </CButton>
            </div>
          </div>
        </CRow>
      </CCardBody>
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        backdrop="static"
      >
        <CModalHeader
          style={{
            backgroundColor: "#00B5E2", // Blue background color for the header
            color: "white", // White text color
          }}
        >
          {isEditing ? "Edit Task" : "Add New Task"}
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Task Name"
              name="TaskName"
              value={selectedTask?.TaskName || ""}
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              label="Task Image"
              name="TaskImage"
              value={selectedTask?.TaskImage || ""}
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              label="Sub Task"
              name="Subtask"
              value={selectedTask?.Subtask || ""}
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              label="Task Description"
              name="Description"
              value={selectedTask?.Description || ""}
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              label="Reward Points"
              name="Rewardpoints"
              value={selectedTask?.Rewardpoints || ""}
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              label="Site Link"
              name="Sitelink"
              value={selectedTask?.Sitelink || ""}
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              label="Site Image"
              name="Siteimg"
              value={selectedTask?.Siteimg || ""}
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              label="Status"
              name="Status"
              value={selectedTask?.Status || ""}
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
              backgroundColor: "#00B5E2",
              borderColor: "#00B5E2",
              color: "white",
            }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />{" "}
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Add Task"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default AddTasks;

