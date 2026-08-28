import { useEffect, useMemo, useState } from "react"
import { getAlerts } from "../api"

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState("All Alerts")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getAlerts()
      .then((data) => {
        setAlerts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Alerts API error:", error)
        setError("Unable to connect to NEXRA backend")
        setLoading(false)
      })
  }, [])

  const normalizedAlerts = useMemo(() => {
    return alerts.map((alert) => ({
      id: alert.id ?? alert.alert_id ?? "ALT-0000",

      title:
        alert.title ??
        alert.type ??
        alert.name ??
        "Security Alert",

      description:
        alert.description ??
        alert.message ??
        "Suspicious activity detected",

      user:
        alert.user ??
        alert.user_name ??
        alert.customer ??
        "Unknown User",

      amount:
        alert.amount !== undefined && alert.amount !== null
          ? `₹${Number(alert.amount).toLocaleString("en-IN")}`
          : "—",

      risk: Number(
        alert.risk ??
        alert.risk_score ??
        0
      ),

      level:
        alert.level ??
        alert.severity ??
        "Medium",

      status:
        alert.status ??
        "Open",

      time:
        alert.time ??
        alert.timestamp ??
        "Recently",
    }))
  }, [alerts])

  const filteredAlerts =
    filter === "All Alerts"
      ? normalizedAlerts
      : normalizedAlerts.filter(
          (alert) => alert.level.toLowerCase() === filter.toLowerCase()
        )

  const activeAlerts = normalizedAlerts.filter(
    (alert) =>
      alert.status.toLowerCase() !== "resolved"
  )

  const criticalAlerts = normalizedAlerts.filter(
    (alert) =>
      alert.level.toLowerCase() === "critical"
  )

  const investigatingAlerts = normalizedAlerts.filter(
    (alert) =>
      alert.status.toLowerCase() === "investigating" ||
      alert.status.toLowerCase() === "review"
  )

  const resolvedAlerts = normalizedAlerts.filter(
    (alert) =>
      alert.status.toLowerCase() === "resolved"
  )

  if (loading) {
    return (
      <div className="page alerts-page">
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Loading NEXRA alerts...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page alerts-page">
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#ff6b6b",
          }}
        >
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="page alerts-page">

      {/* PAGE HEADING */}
      <div className="page-heading">

        <div>
          <p className="eyebrow">
            THREAT INTELLIGENCE
          </p>

          <h1>
            Alerts
          </h1>

          <p className="subtitle">
            Review and investigate suspicious activity
          </p>
        </div>


        {/* FILTER */}
        <div className="alert-filter-wrapper">

          <button
            type="button"
            className="alert-filter-button"
            onClick={() => {
              if (filter === "All Alerts") {
                setFilter("Critical")
              } else if (filter === "Critical") {
                setFilter("High")
              } else if (filter === "High") {
                setFilter("Medium")
              } else {
                setFilter("All Alerts")
              }
            }}
          >
            <span>
              {filter}
            </span>

            <span className="filter-arrow">
              ⌄
            </span>

          </button>

        </div>

      </div>


      {/* ALERT SUMMARY */}
      <section className="alert-summary">

        {/* ACTIVE */}
        <div className="alert-summary-card">

          <div className="summary-top">
            <span>
              Active Alerts
            </span>

            <i></i>
          </div>

          <strong>
            {activeAlerts.length}
          </strong>

          <small>
            Currently active
          </small>

        </div>


        {/* CRITICAL */}
        <div className="alert-summary-card critical-card">

          <div className="summary-top">
            <span>
              Critical
            </span>

            <i></i>
          </div>

          <strong>
            {criticalAlerts.length}
          </strong>

          <small>
            Requires immediate action
          </small>

        </div>


        {/* INVESTIGATING */}
        <div className="alert-summary-card">

          <div className="summary-top">
            <span>
              Investigating
            </span>

            <i></i>
          </div>

          <strong>
            {investigatingAlerts.length}
          </strong>

          <small>
            Currently under review
          </small>

        </div>


        {/* RESOLVED */}
        <div className="alert-summary-card safe-card">

          <div className="summary-top">
            <span>
              Resolved
            </span>

            <i></i>
          </div>

          <strong>
            {resolvedAlerts.length}
          </strong>

          <small>
            Resolved alerts
          </small>

        </div>

      </section>


      {/* ALERT LIST */}
      <section className="panel alerts-panel">

        <div className="panel-header alerts-panel-header">

          <div>
            <h2>
              Alert Queue
            </h2>

            <p>
              Latest security alerts generated by the risk engine
            </p>
          </div>

          <span className="alert-count">
            {filteredAlerts.length} alerts
          </span>

        </div>


        {/* TABLE HEADER */}
        <div className="alerts-table-head">

          <span>
            Alert
          </span>

          <span>
            User
          </span>

          <span>
            Amount
          </span>

          <span>
            Risk Score
          </span>

          <span>
            Level
          </span>

          <span>
            Status
          </span>

          <span>
            Time
          </span>

        </div>


        {/* ALERT ROWS */}
        <div className="alerts-list">

          {filteredAlerts.length === 0 ? (

            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#888",
              }}
            >
              No alerts found.
            </div>

          ) : (

            filteredAlerts.map((alert) => {

              const levelClass =
                alert.level
                  .toLowerCase()
                  .replace(/\s+/g, "-")

              const statusClass =
                alert.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")

              return (

                <div
                  className="alert-table-row"
                  key={alert.id}
                >

                  {/* ALERT */}
                  <div className="alert-main">

                    <div
                      className={`alert-icon ${levelClass}`}
                    >
                      !
                    </div>

                    <div>

                      <strong>
                        {alert.title}
                      </strong>

                      <small>
                        {alert.id} · {alert.description}
                      </small>

                    </div>

                  </div>


                  {/* USER */}
                  <span className="alert-user">
                    {alert.user}
                  </span>


                  {/* AMOUNT */}
                  <strong className="alert-amount">
                    {alert.amount}
                  </strong>


                  {/* RISK */}
                  <div className="alert-risk">

                    <div className="alert-risk-bar">

                      <i
                        style={{
                          width: `${Math.min(
                            Math.max(alert.risk, 0),
                            100
                          )}%`,
                        }}
                      ></i>

                    </div>

                    <strong>
                      {alert.risk}
                    </strong>

                  </div>


                  {/* LEVEL */}
                  <span
                    className={`alert-level ${levelClass}`}
                  >
                    {alert.level}
                  </span>


                  {/* STATUS */}
                  <span
                    className={`alert-status ${statusClass}`}
                  >
                    {alert.status}
                  </span>


                  {/* TIME */}
                  <span className="alert-time">
                    {alert.time}
                  </span>

                </div>

              )
            })

          )}

        </div>

      </section>

    </div>
  )
}

export default Alerts