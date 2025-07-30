"use client"

import { useState, useEffect } from "react"
import {
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CAlert,
  CSpinner,
  CCardFooter,
} from "@coreui/react"
import { getData, postData } from "../../../apiConfigs/apiCalls"
import { GET_ALL_LEVELS, UPDATE_GAME } from "../../../apiConfigs/endpoints"

const LevelMultiplier = () => {
  const [games, setGames] = useState([])
  const [selectedGame, setSelectedGame] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [levelRows, setLevelRows] = useState([])
  const [adSDKRows, setAdSDKRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [minTicket, setMinTicket] = useState("10")
  const [maxTicket, setMaxTicket] = useState("1000")
  const [currentPage, setCurrentPage] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [addLevelModalVisible, setAddLevelModalVisible] = useState(false)
  const [editLevelModalVisible, setEditLevelModalVisible] = useState(false)
  const [addAdSDKModalVisible, setAddAdSDKModalVisible] = useState(false)
  const [editAdSDKModalVisible, setEditAdSDKModalVisible] = useState(false)
  const [editingLevelIndex, setEditingLevelIndex] = useState(-1)
  const [editingAdSDKIndex, setEditingAdSDKIndex] = useState(-1)
  const [editingLevel, setEditingLevel] = useState({
    level: "",
    roadspeed: "",
    enemyspeed: "",
    obstaclespawnrate: "",
    coinvalue: "",
    potholerate: "",
    coinseriescount: "",
    coinseriesspacing: "",
    coinseriesdistance: "",
    lastpotholedistance: "",
    leveldistance: "",
    adwatchesleft: "",
    lives: "",
  })
  const [newLevel, setNewLevel] = useState({
    level: "",
    roadspeed: "",
    enemyspeed: "",
    obstaclespawnrate: "",
    coinvalue: "",
    potholerate: "",
    coinseriescount: "",
    coinseriesspacing: "",
    coinseriesdistance: "",
    lastpotholedistance: "",
    leveldistance: "",
    adwatchesleft: "",
    lives: "",
  })
  const [newAdSDK, setNewAdSDK] = useState({
    adSDK: "",
    expiryTime: "",
  })
  const [editingAdSDK, setEditingAdSDK] = useState({
    adSDK: "",
    expiryTime: "",
  })
  const [expiryTime, setExpiryTime] = useState("")
  const gamesPerPage = 10

  // Fetch all games/levels from the backend
  const fetchGames = async () => {
    setLoading(true)
    try {
      const response = await getData(GET_ALL_LEVELS)
      console.log("GET_ALL_LEVELS Response:", response)
      setGames(response.data || [])
      setError(null)
    } catch (error) {
      // setError("Failed to load games. Please try again.")
      console.error("Error fetching games:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  // Pagination logic
  const indexOfLastGame = currentPage * gamesPerPage
  const indexOfFirstGame = indexOfLastGame - gamesPerPage
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame)

  const nextPage = () => {
    if (indexOfLastGame < games.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const openModal = (game) => {
    setSelectedGame(game)
    // Use the level data directly from the game object if available
    if (game.level && Array.isArray(game.level)) {
      setLevelRows(game.level)
    } else {
      // Default level rows if none exist
      setLevelRows([
        {
          level: "1",
          roadspeed: "",
          enemyspeed: "",
          obstaclespawnrate: "",
          coinvalue: "",
          potholerate: "",
          coinseriescount: "",
          coinseriesspacing: "",
          coinseriesdistance: "",
          lastpotholedistance: "",
          leveldistance: "",
          adwatchesleft: "",
          lives: "",
        },
      ])
    }

    // Set adSDK data if available
    if (game.adSDK && Array.isArray(game.adSDK)) {
      setAdSDKRows(game.adSDK)
    } else {
      setAdSDKRows([])
    }

    setMinTicket(game.min || "10")
    setMaxTicket(game.max || "1000")
    setExpiryTime(game.ExpiryTime || "")
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedGame(null)
  }

  const handleEditClick = (game) => {
    setSelectedGame(game)
    // Use the level data directly from the game object if available
    if (game.level && Array.isArray(game.level)) {
      setLevelRows(game.level)
    } else {
      // Default level rows if none exist
      setLevelRows([
        {
          level: "1",
          roadspeed: "",
          enemyspeed: "",
          obstaclespawnrate: "",
          coinvalue: "",
          potholerate: "",
          coinseriescount: "",
          coinseriesspacing: "",
          coinseriesdistance: "",
          lastpotholedistance: "",
          leveldistance: "",
          adwatchesleft: "",
          lives: "",
        },
      ])
    }

    // Set adSDK data if available
    if (game.adSDK && Array.isArray(game.adSDK)) {
      setAdSDKRows(game.adSDK)
    } else {
      setAdSDKRows([])
    }

    setMinTicket(game.min || "10")
    setMaxTicket(game.max || "1000")
    setExpiryTime(game.ExpiryTime || "")
    setEditModalVisible(true)
  }

  // Open the edit level modal for a specific level
  const handleEditLevel = (index) => {
    setEditingLevelIndex(index)
    setEditingLevel({ ...levelRows[index] })
    setEditLevelModalVisible(true)
  }

  // Open the edit adSDK modal for a specific adSDK
  const handleEditAdSDK = (index) => {
    setEditingAdSDKIndex(index)
    setEditingAdSDK({
      adSDK: adSDKRows[index].adSDK,
      expiryTime: adSDKRows[index].expiryTime || "",
    })
    setEditAdSDKModalVisible(true)
  }

  // Add a new level row with default values
  const handleAddLevel = () => {
    const highestLevel = levelRows.reduce((max, row) => {
      const levelNum = Number.parseInt(row.level) || 0
      return levelNum > max ? levelNum : max
    }, 0)

    // Set up the new level with the next number
    setNewLevel({
      level: (highestLevel + 1).toString(),
      roadspeed: "",
      enemyspeed: "",
      obstaclespawnrate: "",
      coinvalue: "",
      potholerate: "",
      coinseriescount: "",
      coinseriesspacing: "",
      coinseriesdistance: "",
      lastpotholedistance: "",
      leveldistance: "",
      adwatchesleft: "",
      lives: "",
    })

    // Open the add level modal
    setAddLevelModalVisible(true)
  }

  // Add a new adSDK entry
  const handleAddAdSDK = () => {
    setNewAdSDK({
      adSDK: "",
      expiryTime: "",
      _id: "",
    })
    setAddAdSDKModalVisible(true)
  }

  const handleRemoveLevel = (index) => {
    const newRows = [...levelRows]
    newRows.splice(index, 1)
    setLevelRows(newRows)
  }

  const handleRemoveAdSDK = (index) => {
    const newRows = [...adSDKRows]
    newRows.splice(index, 1)
    setAdSDKRows(newRows)
  }

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value)
  }

  const handleNewLevelChange = (field, value) => {
    setNewLevel({
      ...newLevel,
      [field]: value,
    })
  }

  const handleEditingLevelChange = (field, value) => {
    setEditingLevel({
      ...editingLevel,
      [field]: value,
    })
  }

  // Update the handleNewAdSDKChange function to handle both adSDK and expiryTime
  const handleNewAdSDKChange = (field, value) => {
    setNewAdSDK({
      ...newAdSDK,
      [field]: value,
    })
  }

  const handleEditingAdSDKChange = (field, value) => {
    setEditingAdSDK({
      ...editingAdSDK,
      [field]: value,
    })
  }

  const handleSaveNewLevel = () => {
    // Add the new level to the existing levels
    setLevelRows([...levelRows, newLevel])

    // Close the modal
    setAddLevelModalVisible(false)

    // Reset the new level form
    setNewLevel({
      level: "",
      roadspeed: "",
      enemyspeed: "",
      obstaclespawnrate: "",
      coinvalue: "",
      potholerate: "",
      coinseriescount: "",
      coinseriesspacing: "",
      coinseriesdistance: "",
      lastpotholedistance: "",
      leveldistance: "",
      adwatchesleft: "",
      lives: "",
    })
  }

  const handleSaveNewAdSDK = () => {
    // Add the new adSDK to the existing adSDKs
    setAdSDKRows([
      ...adSDKRows,
      {
        adSDK: newAdSDK.adSDK,
        expiryTime: newAdSDK.expiryTime,
      },
    ])

    // Close the modal
    setAddAdSDKModalVisible(false)

    // Reset the new adSDK form
    setNewAdSDK({
      adSDK: "",
      expiryTime: "",
    })
  }

  const handleSaveEditingLevel = () => {
    // Update the level in the levelRows array
    const newRows = [...levelRows]
    newRows[editingLevelIndex] = editingLevel
    setLevelRows(newRows)

    // Close the modal
    setEditLevelModalVisible(false)
    setEditingLevelIndex(-1)
  }

  const handleSaveEditingAdSDK = () => {
    // Update the adSDK in the adSDKRows array
    const newRows = [...adSDKRows]
    // Preserve the _id if it exists and update both adSDK and expiryTime
    newRows[editingAdSDKIndex] = {
      ...newRows[editingAdSDKIndex],
      adSDK: editingAdSDK.adSDK,
      expiryTime: editingAdSDK.expiryTime,
    }
    setAdSDKRows(newRows)

    // Close the modal
    setEditAdSDKModalVisible(false)
    setEditingAdSDKIndex(-1)
  }

  // Update the handleSaveChanges function to ensure adSDK data includes expiryTime
  const handleSaveChanges = async () => {
    if (!selectedGame || !selectedGame._id) {
      setError("Game ID is missing. Cannot update.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare the data for the API call
      // Make sure adSDK entries include both adSDK and expiryTime fields
      const formattedAdSDKRows = adSDKRows.map((row) => ({
        adSDK: row.adSDK
      }))

      const gameData = {
        gameId: selectedGame._id,
        min: minTicket,
        max: maxTicket,
        level: levelRows,
        adSDK: formattedAdSDKRows,
        ExpiryTime: expiryTime,
      }

      console.log("Saving changes for game:", selectedGame._id)
      console.log("Update data:", gameData)

      // Make the API call to update the game
      const response = await postData(`${UPDATE_GAME}/${selectedGame._id}`, gameData)

      console.log("Update response:", response)
      setSuccess("Game settings updated successfully!")

      // Close modal after a short delay to show the success message
      setTimeout(() => {
        setEditModalVisible(false)
        fetchGames() // Refresh the games list
      }, 1500)
    } catch (error) {
      setError(`Failed to update game settings: ${error.response?.data?.message || error.message || "Unknown error"}`)
      console.error("Error updating game:", error)
    } finally {
      setLoading(false)
    }
  }

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
          <h5 className="fw-bold">Level Management</h5>
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

          {loading && !modalVisible && !editModalVisible && (
            <div className="text-center my-3">
              <CSpinner color="primary" />
              <p className="mt-2">Loading games...</p>
            </div>
          )}

          <CRow>
            <div className="container">
              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle">
                  <thead style={{ backgroundColor: "#00B5E2", color: "black" }}>
                    <tr>
                      <th>S.No</th>
                      <th>Game Title</th>
                      <th>Level</th>
                      <th>ADSDK</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentGames.length > 0 ? (
                      currentGames.map((game, index) => (
                        <tr key={game._id} className="table-light">
                          <td className="fw-bold">{indexOfFirstGame + index + 1}</td>
                          <td>{game.gameTitle || game.name || "Game " + (index + 1)}</td>
                          <td>{game.level && Array.isArray(game.level) ? game.level.length : 0}</td>
                          <td>{game.adSDK && Array.isArray(game.adSDK) ? game.adSDK.length : 0}</td>
                          <td>
                            <CButton
                              style={{
                                color: "black",
                              }}
                              className="me-2"
                              onClick={() => openModal(game)}
                            >
                              <i className="fas fa-eye" style={{ color: "black" }}></i>
                            </CButton>
                            <CButton
                              style={{
                                color: "black",
                              }}
                              className="me-2"
                              onClick={() => handleEditClick(game)}
                            >
                              <i className="fas fa-edit" style={{ color: "black" }}></i>
                            </CButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted fw-bold py-3">
                          {loading ? "Loading..." : "No levels available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {games.length > gamesPerPage && (
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
                    Page {currentPage} of {Math.ceil(games.length / gamesPerPage)}
                  </span>
                  <CButton
                    style={{
                      backgroundColor: "#00B5E2",
                      borderColor: "#00B5E2",
                      color: "black",
                    }}
                    className="ms-3"
                    disabled={indexOfLastGame >= games.length}
                    onClick={nextPage}
                  >
                    Next →
                  </CButton>
                </div>
              )}
            </div>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Modal for Viewing Level */}
      <CModal visible={modalVisible} onClose={closeModal} backdrop="static" size="xl" fullscreen="lg" scrollable>
        <CModalHeader closeButton>
          <CModalTitle>View Level</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: "1.0rem" }}>
          {loading ? (
            <div className="text-center my-3">
              <CSpinner color="primary" />
              <p className="mt-2">Loading level data...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p>
                  Admin can modify the Min number of level, which enables user to withdraw the reward after completing
                  that level with Equivalent Multiplier for that level.
                </p>
              </div>

              {/* Game Minimum Ticket */}
              <div className="mb-3">
                <CFormLabel>Game Minimum Ticket</CFormLabel>
                <CFormInput type="number" value={minTicket} style={{ backgroundColor: "#f8f9fa" }} readOnly />
              </div>

              {/* Game Maximum Ticket */}
              <div className="mb-4">
                <CFormLabel>Game Maximum Ticket</CFormLabel>
                <CFormInput type="number" value={maxTicket} style={{ backgroundColor: "#f8f9fa" }} readOnly />
              </div>

              {/* Game Expiry Time */}
              <div className="mb-4">
                <CFormLabel>Expiry Time</CFormLabel>
                <CFormInput type="number" value={expiryTime} readOnly style={{ backgroundColor: "#f8f9fa" }} />
              </div>

              {/* Level Data Table */}
              <h5 className="mb-3">Level Data (Total: {levelRows.length})</h5>
              <div className="table-responsive mb-4">
                <table className="table table-bordered table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th>Level</th>
                      <th>RoadSpeed</th>
                      <th>EnemySpeed</th>
                      <th>ObstacleSpawnRate</th>
                      <th>CoinValue</th>
                      <th>PotholeRate</th>
                      <th>CoinSeriesCount</th>
                      <th>CoinSeriesSpacing</th>
                      <th>CoinSeriesDistance</th>
                      <th>LastPotholeDistance</th>
                      <th>LevelDistance</th>
                      <th>AdWatchesLeft</th>
                      <th>Lives</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelRows.map((row, index) => (
                      <tr key={index}>
                        <td>{row.level}</td>
                        <td>{row.roadspeed}</td>
                        <td>{row.enemyspeed}</td>
                        <td>{row.obstaclespawnrate}</td>
                        <td>{row.coinvalue}</td>
                        <td>{row.potholerate}</td>
                        <td>{row.coinseriescount}</td>
                        <td>{row.coinseriesspacing}</td>
                        <td>{row.coinseriesdistance}</td>
                        <td>{row.lastpotholedistance}</td>
                        <td>{row.leveldistance}</td>
                        <td>{row.adwatchesleft}</td>
                        <td>{row.lives}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AdSDK Data Table */}
              <h5 className="mb-3">ADSDK Data (Total: {adSDKRows.length})</h5>
              <div className="table-responsive mb-4">
                <table className="table table-bordered table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th>S.No</th>
                      <th>ADSDK</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adSDKRows.length > 0 ? (
                      adSDKRows.map((row, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{row.adSDK}</td>
                          <td>{row._id}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-3">
                          No ADSDK data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <hr className="my-4" />

              <div className="d-flex justify-content-end">
                <CButton
                  onClick={closeModal}
                  style={{
                    backgroundColor: "#00B5E2",
                    borderColor: "#00B5E2",
                    color: "white",
                  }}
                >
                  Go Back
                </CButton>
              </div>
            </>
          )}
        </CModalBody>
      </CModal>

      {/* Edit Modal */}
      <CModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        backdrop="static"
        size="xl"
        fullscreen="lg"
        scrollable
      >
        <CModalHeader closeButton>
          <CModalTitle>Edit Level</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: "1.0rem" }}>
          {loading ? (
            <div className="text-center my-3">
              <CSpinner color="primary" />
              <p className="mt-2">Loading level data...</p>
            </div>
          ) : (
            <>
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

              <div className="mb-4">
                <p>
                  Admin can modify the Min number of level, which enables user to withdraw the reward after completing
                  that level with Equivalent Multiplier for that level.
                </p>
              </div>

              {/* Game Minimum Ticket */}
              <div className="mb-3">
                <CFormLabel>Game Minimum Ticket</CFormLabel>
                <CFormInput
                  type="number"
                  value={minTicket}
                  onChange={handleInputChange(setMinTicket)}
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Game Maximum Ticket */}
              <div className="mb-4">
                <CFormLabel>Game Maximum Ticket</CFormLabel>
                <CFormInput
                  type="number"
                  value={maxTicket}
                  onChange={handleInputChange(setMaxTicket)}
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Game Expiry Time */}
              <div className="mb-4">
                <CFormLabel>Expiry Time</CFormLabel>
                <CFormInput
                  type="number"
                  value={expiryTime}
                  onChange={(e) => setExpiryTime(e.target.value)}
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Level Data Table */}
              <h5 className="mb-3">Level Data (Total: {levelRows.length})</h5>
              <div className="table-responsive mb-4">
                <table className="table table-bordered">
                  <thead className="bg-light">
                    <tr>
                      <th>Level</th>
                      <th>RoadSpeed</th>
                      <th>EnemySpeed</th>
                      <th>ObstacleSpawnRate</th>
                      <th>CoinValue</th>
                      <th>PotholeRate</th>
                      <th>CoinSeriesCount</th>
                      <th>CoinSeriesSpacing</th>
                      <th>CoinSeriesDistance</th>
                      <th>LastPotholeDistance</th>
                      <th>LevelDistance</th>
                      <th>AdWatchesLeft</th>
                      <th>Lives</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelRows.map((row, index) => (
                      <tr key={index}>
                        <td>{row.level}</td>
                        <td>{row.roadspeed}</td>
                        <td>{row.enemyspeed}</td>
                        <td>{row.obstaclespawnrate}</td>
                        <td>{row.coinvalue}</td>
                        <td>{row.potholerate}</td>
                        <td>{row.coinseriescount}</td>
                        <td>{row.coinseriesspacing}</td>
                        <td>{row.coinseriesdistance}</td>
                        <td>{row.lastpotholedistance}</td>
                        <td>{row.leveldistance}</td>
                        <td>{row.adwatchesleft}</td>
                        <td>{row.lives}</td>
                        <td>
                          <CButton color="primary" size="sm" className="me-1" onClick={() => handleEditLevel(index)}>
                            <i className="fas fa-edit"></i>
                          </CButton>
                          {index > 0 && (
                            <CButton color="danger" size="sm" onClick={() => handleRemoveLevel(index)}>
                              <i className="fas fa-trash"></i>
                            </CButton>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Level Button */}
              <div className="d-flex justify-content-end mb-4">
                <CButton
                  style={{
                    backgroundColor: "#00B5E2",
                    borderColor: "#00B5E2",
                    color: "white",
                  }}
                  onClick={handleAddLevel}
                >
                  <i className="fas fa-plus me-2"></i> Add Level
                </CButton>
              </div>

              {/* AdSDK Data Table */}
              <h5 className="mb-3">ADSDK Data (Total: {adSDKRows.length})</h5>
              <div className="table-responsive mb-4">
                <table className="table table-bordered">
                  <thead className="bg-light">
                    <tr>
                      <th>S.No</th>
                      <th>ADSDK</th>
                      <th>ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adSDKRows.length > 0 ? (
                      adSDKRows.map((row, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{row.adSDK}</td>
                          <td>{row._id}</td>
                          <td>
                            <CButton color="primary" size="sm" className="me-1" onClick={() => handleEditAdSDK(index)}>
                              <i className="fas fa-edit"></i>
                            </CButton>
                            <CButton color="danger" size="sm" onClick={() => handleRemoveAdSDK(index)}>
                              <i className="fas fa-trash"></i>
                            </CButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-3">
                          No ADSDK data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add ADSDK Button */}
              <div className="d-flex justify-content-end mb-4">
                <CButton
                  style={{
                    backgroundColor: "#00B5E2",
                    borderColor: "#00B5E2",
                    color: "white",
                  }}
                  onClick={handleAddAdSDK}
                >
                  <i className="fas fa-plus me-2"></i> Add ADSDK
                </CButton>
              </div>

              <hr className="my-4" />

              <div className="d-flex justify-content-end">
                <CButton
                  color="secondary"
                  onClick={() => setEditModalVisible(false)}
                  className="me-2"
                  style={{
                    backgroundColor: "#6c757d",
                    borderColor: "#6c757d",
                  }}
                  disabled={loading}
                >
                  Cancel
                </CButton>
                <CButton
                  onClick={handleSaveChanges}
                  style={{
                    backgroundColor: "#00B5E2",
                    borderColor: "#00B5E2",
                    color: "white",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </CButton>
              </div>
            </>
          )}
        </CModalBody>
      </CModal>

      {/* Add Level Modal */}
      <CModal visible={addLevelModalVisible} onClose={() => setAddLevelModalVisible(false)} backdrop="static" size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Add New Level</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard className="border-0">
            <CCardBody>
              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Level</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.level}
                    onChange={(e) => handleNewLevelChange("level", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Road Speed</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.roadspeed}
                    onChange={(e) => handleNewLevelChange("roadspeed", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Enemy Speed</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.enemyspeed}
                    onChange={(e) => handleNewLevelChange("enemyspeed", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Obstacle Spawn Rate</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.obstaclespawnrate}
                    onChange={(e) => handleNewLevelChange("obstaclespawnrate", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Coin Value</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.coinvalue}
                    onChange={(e) => handleNewLevelChange("coinvalue", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Pothole Rate</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.potholerate}
                    onChange={(e) => handleNewLevelChange("potholerate", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Coin Series Count</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.coinseriescount}
                    onChange={(e) => handleNewLevelChange("coinseriescount", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Coin Series Spacing</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.coinseriesspacing}
                    onChange={(e) => handleNewLevelChange("coinseriesspacing", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Coin Series Distance</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.coinseriesdistance}
                    onChange={(e) => handleNewLevelChange("coinseriesdistance", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Last Pothole Distance</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.lastpotholedistance}
                    onChange={(e) => handleNewLevelChange("lastpotholedistance", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <CFormLabel>Level Distance</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.leveldistance}
                    onChange={(e) => handleNewLevelChange("leveldistance", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <CFormLabel>Ad Watches Left</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.adwatchesleft}
                    onChange={(e) => handleNewLevelChange("adwatchesleft", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <CFormLabel>Lives</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newLevel.lives}
                    onChange={(e) => handleNewLevelChange("lives", e.target.value)}
                  />
                </div>
              </div>
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <CButton color="secondary" onClick={() => setAddLevelModalVisible(false)} className="me-2">
                Cancel
              </CButton>
              <CButton
                style={{
                  backgroundColor: "#00B5E2",
                  borderColor: "#00B5E2",
                  color: "white",
                }}
                onClick={handleSaveNewLevel}
              >
                Save Level
              </CButton>
            </CCardFooter>
          </CCard>
        </CModalBody>
      </CModal>

      {/* Edit Level Modal */}
      <CModal
        visible={editLevelModalVisible}
        onClose={() => setEditLevelModalVisible(false)}
        backdrop="static"
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>Edit Level {editingLevel.level}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard className="border-0">
            <CCardBody>
              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Level</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.level}
                    onChange={(e) => handleEditingLevelChange("level", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Road Speed</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.roadspeed}
                    onChange={(e) => handleEditingLevelChange("roadspeed", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Enemy Speed</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.enemyspeed}
                    onChange={(e) => handleEditingLevelChange("enemyspeed", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Obstacle Spawn Rate</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.obstaclespawnrate}
                    onChange={(e) => handleEditingLevelChange("obstaclespawnrate", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Coin Value</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.coinvalue}
                    onChange={(e) => handleEditingLevelChange("coinvalue", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Pothole Rate</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.potholerate}
                    onChange={(e) => handleEditingLevelChange("potholerate", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Coin Series Count</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.coinseriescount}
                    onChange={(e) => handleEditingLevelChange("coinseriescount", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Coin Series Spacing</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.coinseriesspacing}
                    onChange={(e) => handleEditingLevelChange("coinseriesspacing", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <CFormLabel>Coin Series Distance</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.coinseriesdistance}
                    onChange={(e) => handleEditingLevelChange("coinseriesdistance", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Last Pothole Distance</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.lastpotholedistance}
                    onChange={(e) => handleEditingLevelChange("lastpotholedistance", e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <CFormLabel>Level Distance</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.leveldistance}
                    onChange={(e) => handleEditingLevelChange("leveldistance", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <CFormLabel>Ad Watches Left</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.adwatchesleft}
                    onChange={(e) => handleEditingLevelChange("adwatchesleft", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <CFormLabel>Lives</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingLevel.lives}
                    onChange={(e) => handleEditingLevelChange("lives", e.target.value)}
                  />
                </div>
              </div>
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <CButton color="secondary" onClick={() => setEditLevelModalVisible(false)} className="me-2">
                Cancel
              </CButton>
              <CButton
                style={{
                  backgroundColor: "#00B5E2",
                  borderColor: "#00B5E2",
                  color: "white",
                }}
                onClick={handleSaveEditingLevel}
              >
                Save Level
              </CButton>
            </CCardFooter>
          </CCard>
        </CModalBody>
      </CModal>

      {/* Add ADSDK Modal */}
      <CModal visible={addAdSDKModalVisible} onClose={() => setAddAdSDKModalVisible(false)} backdrop="static" size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Add New ADSDK</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard className="border-0">
            <CCardBody>
              <div className="row mb-3">
                <div className="col-md-12">
                  <CFormLabel>ADSDK</CFormLabel>
                  <CFormInput
                    type="text"
                    value={newAdSDK.adSDK}
                    onChange={(e) => handleNewAdSDKChange("adSDK", e.target.value)}
                    placeholder="Enter ADSDK value (e.g., show_8692316)"
                  />
                </div>
              </div>
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <CButton color="secondary" onClick={() => setAddAdSDKModalVisible(false)} className="me-2">
                Cancel
              </CButton>
              <CButton
                style={{
                  backgroundColor: "#00B5E2",
                  borderColor: "#00B5E2",
                  color: "white",
                }}
                onClick={handleSaveNewAdSDK}
              >
                Save ADSDK
              </CButton>
            </CCardFooter>
          </CCard>
        </CModalBody>
      </CModal>

      {/* Edit ADSDK Modal */}
      <CModal
        visible={editAdSDKModalVisible}
        onClose={() => setEditAdSDKModalVisible(false)}
        backdrop="static"
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>Edit ADSDK</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard className="border-0">
            <CCardBody>
              <div className="row mb-3">
                <div className="col-md-12">
                  <CFormLabel>ADSDK</CFormLabel>
                  <CFormInput
                    type="text"
                    value={editingAdSDK.adSDK}
                    onChange={(e) => handleEditingAdSDKChange("adSDK", e.target.value)}
                    placeholder="Enter ADSDK value (e.g., show_8692316)"
                  />
                </div>
              </div>
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <CButton color="secondary" onClick={() => setEditAdSDKModalVisible(false)} className="me-2">
                Cancel
              </CButton>
              <CButton
                style={{
                  backgroundColor: "#00B5E2",
                  borderColor: "#00B5E2",
                  color: "white",
                }}
                onClick={handleSaveEditingAdSDK}
              >
                Save ADSDK
              </CButton>
            </CCardFooter>
          </CCard>
        </CModalBody>
      </CModal>
    </>
  )
}

export default LevelMultiplier
