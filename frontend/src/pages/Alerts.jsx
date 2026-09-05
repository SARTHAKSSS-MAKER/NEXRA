import { useEffect, useMemo, useState } from "react"
import { getAlerts, getEvaluation } from "../api"

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [evaluation, setEvaluation] = useState(null)
  const [filter, setFilter] = useState("All Alerts")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      getAlerts(),
      getEvaluation(),
    ])
      .then(([alertsData, evaluationData]) => {
        setAlerts(Array.isArray(alertsData) ? alertsData : [])
        setEvaluation(evaluationData)
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
        "Suspicious financial transaction detected",

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
          (alert) =>
            alert.level.toLowerCase() === filter.toLowerCase()
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

  const modelRecall =
    evaluation?.recall != null
      ? (evaluation.recall * 100).toFixed(1)
      : "0.0"

  const modelPrecision =
    evaluation?.precision != null
      ? (evaluation.precision * 100).toFixed(1)
      : "0.0"

  const falsePositives =
    evaluation?.false_positive ??
    evaluation?.confusion_matrix?.[0]?.[1] ??
    0

  const falseNegatives =
    evaluation?.false_negative ??
    evaluation?.confusion_matrix?.[1]?.[0] ??
    0

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

      <div className="page-heading">

        <div>
          <p className="eyebrow">
            THREAT INTELLIGENCE
          </p>

          <h1>
            Alerts
          </h1>

          <p className="subtitle">
            Review and investigate suspicious financial activity
          </p>
        </div>

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

      <section className="alert-summary">

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

      <section
        className="panel"
        style={{
          marginBottom: "20px",
        }}
      >

        <div
          className="panel-header"
          style={{
            alignItems: "center",
          }}
        >

          <div>
            <h2>
              Fraud Detection Performance
            </h2>

            <p>
              Current held-out evaluation of the financial transaction model
            </p>
          </div>

          <span
            style={{
              fontSize: "12px",
              opacity: 0.6,
            }}
          >
            {evaluation?.test_samples?.toLocaleString() || 0} test samples
          </span>

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            padding: "0 20px 20px",
          }}
        >

          <div>
            <small style={{ opacity: 0.6 }}>
              Accuracy
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "5px",
              }}
            >
              {evaluation
                ? `${(evaluation.accuracy * 100).toFixed(1)}%`
                : "—"}
            </strong>
          </div>

          <div>
            <small style={{ opacity: 0.6 }}>
              Precision
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "5px",
              }}
            >
              {modelPrecision}%
            </strong>
          </div>

          <div>
            <small style={{ opacity: 0.6 }}>
              Fraud Recall
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "5px",
              }}
            >
              {modelRecall}%
            </strong>
          </div>

          <div>
            <small style={{ opacity: 0.6 }}>
              False Negatives
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "5px",
              }}
            >
              {falseNegatives}
            </strong>
          </div>

        </div>

      </section>

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

                  <span className="alert-user">
                    {alert.user}
                  </span>

                  <strong className="alert-amount">
                    {alert.amount}
                  </strong>

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

                  <span
                    className={`alert-level ${levelClass}`}
                  >
                    {alert.level}
                  </span>

                  <span
                    className={`alert-status ${statusClass}`}
                  >
                    {alert.status}
                  </span>

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