import { useEffect, useMemo, useState } from "react"
import {
  getRisk,
  getTransactions,
  getAlerts,
} from "../api"

function RiskMonitor() {
  const [risk, setRisk] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [alerts, setAlerts] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      getRisk(),
      getTransactions(),
      getAlerts(),
    ])
      .then(([riskData, transactionsData, alertsData]) => {
        setRisk(riskData)
        setTransactions(transactionsData || [])
        setAlerts(alertsData || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Risk Monitor API error:", error)
        setError("Unable to connect to NEXRA backend")
        setLoading(false)
      })
  }, [])

  /*
   * Calculate risk totals
   */
  const riskTotals = useMemo(() => {
    const high = Number(risk?.high_risk || 0)
    const medium = Number(risk?.medium_risk || 0)
    const low = Number(risk?.low_risk || 0)

    const total = high + medium + low

    return {
      high,
      medium,
      low,
      total,
    }
  }, [risk])

  /*
   * Current risk score
   * Uses the highest risk score from the available transaction stream.
   */
  const currentRiskScore = useMemo(() => {
    if (!transactions.length) return 0

    return Math.max(
      ...transactions.map((transaction) =>
        Number(transaction.risk_score || 0)
      )
    )
  }, [transactions])

  /*
   * Risk level
   */
  const currentRiskLevel =
    currentRiskScore >= 80
      ? "HIGH RISK"
      : currentRiskScore >= 60
      ? "MEDIUM RISK"
      : "LOW RISK"

  /*
   * Active high-priority alerts
   */
  const highPriorityAlerts = alerts.filter(
    (alert) =>
      alert.severity === "Critical" ||
      alert.severity === "High"
  )

  /*
   * Transaction statistics
   */
  const highRiskTransactions = transactions.filter(
    (transaction) =>
      Number(transaction.risk_score || 0) >= 80
  ).length

  const mediumRiskTransactions = transactions.filter(
    (transaction) => {
      const score = Number(transaction.risk_score || 0)

      return score >= 60 && score < 80
    }
  ).length

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="risk-monitor-page">
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Loading NEXRA risk monitor...
        </div>
      </div>
    )
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div className="risk-monitor-page">
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
    <div className="risk-monitor-page">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="risk-monitor-heading">

        <div>
          <p className="risk-monitor-eyebrow">
            LIVE RISK ANALYSIS
          </p>

          <h1>Risk Monitor</h1>

          <p className="risk-monitor-subtitle">
            Monitor transactions and identify high-risk activity in real time
          </p>
        </div>

        <div className="risk-monitor-status">
          <span className="risk-live-dot"></span>
          <span>System Live</span>
        </div>

      </div>


      {/* =========================
          STAT CARDS
      ========================== */}

      <section className="risk-monitor-stats">

        {/* CURRENT RISK SCORE */}

        <div className="risk-stat-card">

          <span className="risk-stat-label">
            Current Risk Score
          </span>

          <strong className="risk-stat-value">
            {currentRiskScore}
            <span>/100</span>
          </strong>

          <small
            className={
              currentRiskScore >= 80
                ? "risk-danger-text"
                : currentRiskScore >= 60
                ? "risk-warning-text"
                : "risk-safe-text"
            }
          >
            {currentRiskLevel}
          </small>

        </div>


        {/* TRANSACTIONS SCANNED */}

        <div className="risk-stat-card">

          <span className="risk-stat-label">
            Transactions Scanned
          </span>

          <strong className="risk-stat-value">
            {transactions.length.toLocaleString("en-IN")}
          </strong>

          <small>
            Available transaction stream
          </small>

        </div>


        {/* HIGH RISK DETECTED */}

        <div className="risk-stat-card">

          <span className="risk-stat-label">
            High Risk Detected
          </span>

          <strong className="risk-stat-value">
            {riskTotals.high.toLocaleString("en-IN")}
          </strong>

          <small className="risk-danger-text">
            {riskTotals.total > 0
              ? `${(
                  (riskTotals.high / riskTotals.total) *
                  100
                ).toFixed(1)}% of total risk data`
              : "No risk data"}
          </small>

        </div>


        {/* DETECTION ACCURACY */}

        <div className="risk-stat-card">

          <span className="risk-stat-label">
            Risk Coverage
          </span>

          <strong className="risk-stat-value risk-positive">
            {riskTotals.total > 0
              ? `${(
                  ((riskTotals.high + riskTotals.medium) /
                    riskTotals.total) *
                  100
                ).toFixed(1)}%`
              : "0%"}
          </strong>

          <small className="risk-safe-text">
            High + medium risk coverage
          </small>

        </div>

      </section>


      {/* =========================
          MAIN GRID
      ========================== */}

      <section className="risk-monitor-main-grid">


        {/* =========================
            LIVE RISK ANALYSIS
        ========================== */}

        <div className="risk-monitor-panel">

          <div className="risk-monitor-panel-header">

            <div>
              <h2>Live Risk Analysis</h2>

              <p>
                Real-time transaction risk monitoring
              </p>
            </div>

            <span className="risk-analysis-live">
              <i></i>
              LIVE
            </span>

          </div>


          {/* RISK METER */}

          <div className="risk-meter-wrapper">

            <div
              className="risk-meter-circle"
              style={{
                "--risk-score": `${currentRiskScore * 3.6}deg`,
              }}
            >

              <div className="risk-meter-inner">

                <strong>
                  {currentRiskScore}
                </strong>

                <span>
                  {currentRiskLevel}
                </span>

              </div>

            </div>

          </div>


          {/* RISK FACTORS */}

          <div className="risk-factor-list">


            {/* TRANSACTION VELOCITY */}

            <div className="risk-factor">

              <div>
                <span>
                  Transaction Velocity
                </span>

                <small>
                  Activity frequency
                </small>
              </div>

              <strong
                className={
                  highRiskTransactions > 0
                    ? "factor-high"
                    : "factor-medium"
                }
              >
                {highRiskTransactions > 0
                  ? "High"
                  : "Normal"}
              </strong>

            </div>


            {/* HIGH RISK ACTIVITY */}

            <div className="risk-factor">

              <div>
                <span>
                  High Risk Activity
                </span>

                <small>
                  Transactions above risk threshold
                </small>
              </div>

              <strong
                className={
                  highRiskTransactions > 0
                    ? "factor-danger"
                    : "factor-medium"
                }
              >
                {highRiskTransactions > 0
                  ? `${highRiskTransactions} Detected`
                  : "None"}
              </strong>

            </div>


            {/* MEDIUM RISK ACTIVITY */}

            <div className="risk-factor">

              <div>
                <span>
                  Medium Risk Activity
                </span>

                <small>
                  Transactions requiring monitoring
                </small>
              </div>

              <strong className="factor-medium">
                {mediumRiskTransactions}
              </strong>

            </div>

          </div>

        </div>


        {/* =========================
            ACTIVE RISK EVENTS
        ========================== */}

        <div className="risk-monitor-panel">

          <div className="risk-monitor-panel-header">

            <div>
              <h2>Active Risk Events</h2>

              <p>
                Events requiring attention
              </p>
            </div>

            <span className="risk-event-count">
              {highPriorityAlerts.length} High
            </span>

          </div>


          <div className="risk-event-list">

            {alerts.length === 0 ? (

              <div
                style={{
                  padding: "30px 10px",
                  textAlign: "center",
                  color: "#888",
                }}
              >
                No active risk events
              </div>

            ) : (

              alerts.slice(0, 4).map((alert) => {

                const alertClass =
                  alert.severity === "Critical" ||
                  alert.severity === "High"
                    ? "high"
                    : "medium"

                return (
                  <div
                    className="risk-event-card"
                    key={alert.id}
                  >

                    <div
                      className={`risk-event-icon ${alertClass}`}
                    >
                      !
                    </div>


                    <div className="risk-event-info">

                      <strong>
                        {alert.type}
                      </strong>

                      <span>
                        {alert.message}
                      </span>

                      <small>
                        {alert.status}
                      </small>

                    </div>


                    <b
                      className={`risk-event-level ${alertClass}`}
                    >
                      {alert.severity}
                    </b>

                  </div>
                )
              })

            )}

          </div>

        </div>

      </section>


      {/* =========================
          LIVE TRANSACTION STREAM
      ========================== */}

      <section className="risk-monitor-panel transaction-stream-panel">

        <div className="risk-monitor-panel-header">

          <div>
            <h2>Live Transaction Stream</h2>

            <p>
              Latest transactions being analyzed by the model
            </p>
          </div>

          <button className="risk-panel-action">
            View All →
          </button>

        </div>


        <div className="risk-transaction-table">

          {/* TABLE HEADER */}

          <div className="risk-transaction-head">

            <span>
              TRANSACTION
            </span>

            <span>
              AMOUNT
            </span>

            <span>
              LOCATION
            </span>

            <span>
              RISK
            </span>

            <span>
              STATUS
            </span>

          </div>


          {/* TRANSACTIONS */}

          {transactions.length === 0 ? (

            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#888",
              }}
            >
              No transactions available
            </div>

          ) : (

            transactions.slice(0, 6).map((transaction) => {

              const riskScore =
                Number(transaction.risk_score || 0)

              const riskClass =
                riskScore >= 80
                  ? "high"
                  : riskScore >= 60
                  ? "medium"
                  : "low"

              const statusClass =
                transaction.status === "Blocked"
                  ? "blocked"
                  : transaction.status === "Review"
                  ? "review"
                  : "approved"

              return (
                <div
                  className="risk-transaction-row"
                  key={transaction.id}
                >

                  <span className="transaction-id">
                    #{transaction.id}
                  </span>


                  <span>
                    ₹
                    {Number(
                      transaction.amount || 0
                    ).toLocaleString("en-IN")}
                  </span>


                  <span>
                    {transaction.location || "—"}
                  </span>


                  <strong
                    className={`transaction-risk ${riskClass}`}
                  >
                    {riskScore}
                  </strong>


                  <b
                    className={`transaction-status ${statusClass}`}
                  >
                    {transaction.status || "Unknown"}
                  </b>

                </div>
              )
            })

          )}

        </div>

      </section>

    </div>
  )
}

export default RiskMonitor