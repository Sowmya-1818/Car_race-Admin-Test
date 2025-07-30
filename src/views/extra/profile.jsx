"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CCard, CCardHeader, CCardBody, CButton, CForm, CFormInput, CSpinner, CAlert } from "@coreui/react"
import { getData, postData, putData } from "../../apiConfigs/apiCalls"
import { GET_PROFILE, EDIT_PROFILE, CHANGE_PASSWORD } from "../../apiConfigs/endpoints"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [editedUser, setEditedUser] = useState({})
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })
  const [profileImage, setProfileImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const userId = localStorage.getItem("id")

  useEffect(() => {
    fetchProfileData()
  }, [userId])

  const fetchProfileData = async () => {
    if (!userId) {
      setError("User is not logged in. Please log in again.")
      setLoading(false)
      return
    }
    try {
      const response = await getData(GET_PROFILE(userId))
      if (response?.user) {
        setUser(response.user)
        setEditedUser(response.user)
        if (response.user.profilepic) {
          setProfileImage(response.user.profilepic)
        }
      }
    } catch (error) {
      setError("Failed to fetch profile data. Try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => setIsEditing(true)
  const handlePasswordChange = () => setIsChangingPassword(true)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedUser = { ...editedUser, profilepic: profileImage }
      const response = await putData(EDIT_PROFILE(userId), updatedUser) // Use PUT request for editing profile

      if (response?.user) {
        setUser(response.user)
        setEditedUser(response.user)
        setProfileImage(response.user.profilepic)
        setMessage("Profile updated successfully!")
      }
      setIsEditing(false)
    } catch (error) {
      setError("Failed to update profile. Try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSave = async () => {
    setLoading(true)
    try {
      const response = await postData(CHANGE_PASSWORD, {
        email: user.email,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      })
      if (response?.message === "Password changed successfully") {
        setMessage("Password updated successfully!")
      } else {
        setError(response?.message || "Failed to change password.")
      }
      setIsChangingPassword(false)
    } catch (error) {
      setError("Failed to change password. Try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageURL = URL.createObjectURL(file)
      setProfileImage(imageURL)
    }
  }

  if (loading) return <CSpinner color="primary" className="d-flex justify-content-center" />
  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <CCard className="mb-4 shadow-lg" style={{ borderRadius: "1rem" }}>
      <CCardHeader
        style={{
          backgroundColor: "#00B5E2", // Blue background color for the header
          color: "white", // White text color
        }}
        className="text-center"
      >
        <h3>Profile</h3>
      </CCardHeader>
      <CCardBody>
        {message && <CAlert color="success">{message}</CAlert>}
        <div className="text-center">
          {profileImage ? (
            <img
              src={profileImage || "/placeholder.svg"}
              alt="Profile"
              className="rounded-circle mb-3 shadow"
              width="150"
              height="150"
            />
          ) : (
            <p>No profile image available</p>
          )}
          {isEditing && <CFormInput type="file" accept="image/*" onChange={handleImageChange} />}
        </div>
        {isEditing ? (
          <CForm>
            <div className="mb-3">
              <CFormInput label="User Name :" name="username" value={editedUser.username || ""} onChange={handleChange} />
            </div>
            <div className="d-flex gap-3">
              <CButton
                style={{
                  backgroundColor: "#00B5E2", // Blue color for the button
                  borderColor: "#00B5E2",
                  color: "white", // White text color
                }}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <CSpinner size="sm" /> : "Save"}
              </CButton>
              <CButton color="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </CButton>
            </div>
          </CForm>
        ) : isChangingPassword ? (
          <CForm>
            <CFormInput
              label="Current Password"
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordInputChange}
              className="mb-3"
            />
            <CFormInput
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              className="mb-3"
            />
            <CFormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              className="mb-3" // Added margin-bottom for spacing
            />
            <div className="d-flex gap-2">
              <CButton
                style={{
                  backgroundColor: "#00B5E2", // Blue color for the button
                  borderColor: "#00B5E2",
                  color: "white", // White text color
                }}
                onClick={handlePasswordSave}
                disabled={loading}
              >
                Change Password
              </CButton>
              <CButton color="secondary" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </CButton>
            </div>
          </CForm>
        ) : (
          <div className="p-3">
            <p>
              <strong>User Name:</strong> {user.username || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "N/A"}
            </p>
            <p>
              <strong>Login Type:</strong> {user.loginType || "N/A"}
            </p>
            <p>
              <strong>User Points:</strong> {user.ticketBalance || 0}
            </p>
            <CButton
              style={{
                backgroundColor: "#00B5E2", // Blue color for the button
                borderColor: "#00B5E2",
                color: "white", // White text color
              }}
              className="mt-3"
              onClick={handleEdit}
            >
              Edit Profile
            </CButton>
            <CButton
              style={{
                backgroundColor: "#00B5E2", // Blue color for the button
                borderColor: "#00B5E2",
                color: "white", // White text color
              }}
              className="mt-3 ms-3"
              onClick={handlePasswordChange}
            >
              Change Password
            </CButton>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default Profile

