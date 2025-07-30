// import React, { useEffect, useState } from "react";
// import { Row, Col, Card, Button } from "react-bootstrap";
// import { Link } from "react-router-dom"; // Import Link for navigation
// import { FaUsers, FaExchangeAlt, FaGamepad } from "react-icons/fa";
// import { CircularProgressbar } from "react-circular-progressbar";
// import { getData } from "../../../src/apiConfigs/apiCalls";
// import {
//   TOTAL_GAME_HISTORY,
//   GET_TASK,
//   GET_ALL_USERS,
//   GET_ALL_WITHDRAWALS,
// } from "../../../src/apiConfigs/endpoints";

// // Styles for circular progress bar
// import "react-circular-progressbar/dist/styles.css"; // Import the circular progress bar styles

// const DashDefault = () => {
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalTasks, setTotalTasks] = useState(0);
//   const [totalGames, setTotalGames] = useState(0);
//   const [totalTransactions, setTotalTransactions] = useState(0);

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       const usersRes = await getData(GET_ALL_USERS);
//       if (!usersRes) {
//         setTotalUsers(0);
//       } else {
//         setTotalUsers(usersRes?.users?.length || 0);
//       }
//       // const tasksRes = await getData(GET_TASK);
//       const gamesRes = await getData(TOTAL_GAME_HISTORY);
//       if (!gamesRes) {
//         setTotalGames(0);
//       } else {
//         setTotalGames(gamesRes?.history?.length || 0);
//       }
//       const transactionsRes = await getData(GET_ALL_WITHDRAWALS);
//       if (!transactionsRes) {
//         setTotalTransactions(0);
//       } else {
//         setTotalTransactions(transactionsRes?.withdrawals?.length || 0);
//       }
//       console.log(usersRes, gamesRes, "transactionsRes");

//       // setTotalTasks(tasksRes?.allTasks?.length || 0);
//     };

//     console.log(totalUsers, totalGames, totalTransactions, "totalTransactions");

//     fetchData();
//   }, []);

//   // Data for cards
//   const dashSalesData = [
//     {
//       title: "Total Registered Users",
//       value: totalUsers,
//       color: "#00B5E2",
//       icon: <FaUsers size={30} />,
//       link: "/usermanagement",
//     },
//     {
//       title: "Total Transaction Users",
//       value: totalTransactions,
//       color: "#00B5E2",
//       icon: <FaExchangeAlt size={30} />,
//       link: "/allwithdrawals",
//     },
//     {
//       title: "Total Games",
//       value: totalGames,
//       color: "#00B5E2",
//       icon: <FaGamepad size={30} />,
//       link: "/gamehistory",
//     },
//   ];

//   return (
//     <React.Fragment>
//       <Row className="justify-content-center mt-4">
//         {dashSalesData.map((data, index) => (
//           <Col key={index} xl={4} md={6} sm={12} className="mb-4">
//             <Card className="shadow-sm rounded-lg" style={{ border: "none" }}>
//               <Card.Body
//                 className="text-center p-4"
//                 style={{
//                   color: "#34495e",
//                   borderLeft: `8px solid ${data.color}`,
//                 }}
//               >
//                 <div className="d-flex justify-content-center mb-3">
//                   <div
//                     style={{
//                       width: 50,
//                       height: 50,
//                       borderRadius: "50%",
//                       backgroundColor: `${data.color}20`,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     {data.icon}
//                   </div>
//                 </div>
//                 <h6
//                   className="mb-3"
//                   style={{ fontWeight: "600", fontSize: "18px" }}
//                 >
//                   {data.title}
//                 </h6>
//                 <h3
//                   style={{
//                     fontWeight: "300",
//                     color: data.color,
//                     fontSize: "30px",
//                   }}
//                 >
//                   {data.value.toLocaleString()}
//                 </h3>
//                 <Link
//                   to={data.link}
//                   style={{ textDecoration: "none", color: data.color }}
//                 >
//                   <Button
//                     variant="link"
//                     style={{
//                       fontWeight: "500",
//                       fontSize: "14px",
//                       color: data.color,
//                     }}
//                   >
//                     View Details
//                   </Button>
//                 </Link>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </React.Fragment>
//   );
// };

// export default DashDefault;


"use client"

import React, { useEffect, useState } from "react"
import { Row, Col, Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom" // Import Link for navigation
import { FaUsers, FaExchangeAlt, FaGamepad } from "react-icons/fa"
import { getData } from "../../../src/apiConfigs/apiCalls"
import { DASHBOARD } from "../../../src/apiConfigs/endpoints"

// Styles for circular progress bar
import "react-circular-progressbar/dist/styles.css" // Import the circular progress bar styles

const DashDefault = () => {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalGames, setTotalGames] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from single DASHBOARD API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const dashboardRes = await getData(DASHBOARD)

        if (!dashboardRes) {
          setError("Failed to fetch dashboard data")
          setTotalUsers(0)
          setTotalGames(0)
          setTotalTransactions(0)
        } else {
          // Set data from single API response
          setTotalUsers(dashboardRes.totalUsers || 0)
          setTotalGames(dashboardRes.totalGames || 0)
          setTotalTransactions(dashboardRes.totalTransacions || 0) // Note: keeping the typo from backend

          console.log("Dashboard data fetched successfully:", dashboardRes)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Error fetching dashboard data")
        setTotalUsers(0)
        setTotalGames(0)
        setTotalTransactions(0)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Data for cards
  const dashSalesData = [
    {
      title: "Total Registered Users",
      value: totalUsers,
      color: "#00B5E2",
      icon: <FaUsers size={30} />,
      link: "/usermanagement",
    },
    {
      title: "Total Transaction Users",
      value: totalTransactions,
      color: "#00B5E2",
      icon: <FaExchangeAlt size={30} />,
      link: "/allwithdrawals",
    },
    {
      title: "Total Games",
      value: totalGames,
      color: "#00B5E2",
      icon: <FaGamepad size={30} />,
      link: "/gamehistory",
    },
  ]

  // Loading state
  if (loading) {
    return (
      <React.Fragment>
        <Row className="justify-content-center mt-4">
          <Col className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading dashboard data...</p>
          </Col>
        </Row>
      </React.Fragment>
    )
  }

  // Error state
  if (error) {
    return (
      <React.Fragment>
        <Row className="justify-content-center mt-4">
          <Col className="text-center">
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
            <Button variant="primary" onClick={() => window.location.reload()} className="mt-2">
              <i className="fas fa-refresh mr-2"></i>
              Retry
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Row className="justify-content-center mt-4">
        {dashSalesData.map((data, index) => (
          <Col key={index} xl={4} md={6} sm={12} className="mb-4">
            <Card className="shadow-sm rounded-lg" style={{ border: "none" }}>
              <Card.Body
                className="text-center p-4"
                style={{
                  color: "#34495e",
                  borderLeft: `8px solid ${data.color}`,
                }}
              >
                <div className="d-flex justify-content-center mb-3">
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: `${data.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {data.icon}
                  </div>
                </div>
                <h6 className="mb-3" style={{ fontWeight: "600", fontSize: "18px" }}>
                  {data.title}
                </h6>
                <h3
                  style={{
                    fontWeight: "300",
                    color: data.color,
                    fontSize: "30px",
                  }}
                >
                  {data.value.toLocaleString()}
                </h3>
                <Link to={data.link} style={{ textDecoration: "none", color: data.color }}>
                  <Button
                    variant="link"
                    style={{
                      fontWeight: "500",
                      fontSize: "14px",
                      color: data.color,
                    }}
                  >
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Summary Row */}
      <Row className="justify-content-center mt-4">
        <Col xl={12}>
          <Card className="shadow-sm">
            {/* <Card.Body className="text-center p-3">
              <h5 className="mb-0" style={{ color: "#34495e" }}>
                <i className="fas fa-chart-bar mr-2"></i>
                Dashboard Summary: {totalUsers} Users | {totalGames} Games | {totalTransactions} Transactions
              </h5>
            </Card.Body> */}
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default DashDefault