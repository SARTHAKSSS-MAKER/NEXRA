import { useEffect, useState } from "react"
import {
  getDashboard,
  getTransactions,
  getAlerts,
  getRisk,
  getEvaluation,
} from "../api"

function Dashboard({ onNavigate}) {
  const [dashboard, setDashboard] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [alerts, setAlerts] = useState([])
  const [risk, setRisk] = useState(null)
  const [evaluation, setEvaluation] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          dashboardData,
          transactionsData,
          alertsData,
          riskData,
          evaluationData,
        ] = await Promise.all([
          getDashboard(),
          getTransactions(),
          getAlerts(),
          getRisk(),
          getEvaluation(),
        ])

        setDashboard(dashboardData)
        setTransactions(
          Array.isArray(transactionsData)
            ? transactionsData
            : []
        )
        setAlerts(
          Array.isArray(alertsData)
            ? alertsData
            : []
        )
        setRisk(riskData)
        setEvaluation(evaluationData)
      } catch (error) {
        console.error("Dashboard API error:", error)
        setError("Unable to connect to NEXRA backend")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-page">
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Loading NEXRA dashboard...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-page">
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

  const totalRisk =
    Number(risk?.high_risk || 0) +
    Number(risk?.medium_risk || 0) +
    Number(risk?.low_risk || 0)

  const highRiskPercentage =
    totalRisk > 0
      ? (
          (Number(risk?.high_risk || 0) /
            totalRisk) *
          100
        ).toFixed(1)
      : "0.0"

  const mediumRiskPercentage =
    totalRisk > 0
      ? (
          (Number(risk?.medium_risk || 0) /
            totalRisk) *
          100
        ).toFixed(1)
      : "0.0"

  const lowRiskPercentage =
    totalRisk > 0
      ? (
          (Number(risk?.low_risk || 0) /
            totalRisk) *
          100
        ).toFixed(1)
      : "0.0"

  const highPriorityAlerts = alerts.filter(
    (alert) =>
      alert.severity === "Critical" ||
      alert.severity === "High"
  ).length

  const realAccuracy =
    evaluation?.accuracy != null
      ? (Number(evaluation.accuracy) * 100).toFixed(1)
      : Number(
          dashboard?.detection_accuracy || 0
        ).toFixed(1)

  const realRecall =
    evaluation?.recall != null
      ? (Number(evaluation.recall) * 100).toFixed(1)
      : null

  return (
    <div className="dashboard-page">

      <div className="page-heading dashboard-heading">

        <div>

          <p className="eyebrow">
            SECURITY OVERVIEW
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="subtitle">
            Real-time fraud intelligence and transaction risk overview
          </p>

        </div>

        <div className="dashboard-status">

          <span className="live-dot"></span>

          System Live

        </div>

      </div>


      <section className="dashboard-stats">

        <div className="dashboard-stat-card">

          <div className="stat-top">

            <span>
              Total Transactions
            </span>

            <div className="stat-icon">
              ↗
            </div>

          </div>

          <strong>
            {Number(
              dashboard?.total_transactions || 0
            ).toLocaleString("en-IN")}
          </strong>

          <div className="stat-bottom positive">

            ↑ 12.8%

            <span>
              vs last month
            </span>

          </div>

        </div>


        <div className="dashboard-stat-card">

          <div className="stat-top">

            <span>
              High Risk Transactions
            </span>

            <div className="stat-icon danger">
              !
            </div>

          </div>

          <strong>
            {Number(
              dashboard?.high_risk_transactions || 0
            ).toLocaleString("en-IN")}
          </strong>

          <div className="stat-bottom danger-text">

            ↑ 4.7%

            <span>
              requires attention
            </span>

          </div>

        </div>


        <div className="dashboard-stat-card">

          <div className="stat-top">

            <span>
              Detection Accuracy
            </span>

            <div className="stat-icon">
              ◈
            </div>

          </div>

          <strong>
            {realAccuracy}%
          </strong>

          <div className="stat-bottom positive">

            Real held-out evaluation

            <span>
              {realRecall !== null
                ? `Recall ${realRecall}%`
                : "Model performance"}
            </span>

          </div>

        </div>


        <div className="dashboard-stat-card">

          <div className="stat-top">

            <span>
              Active Alerts
            </span>

            <div className="stat-icon warning">
              !
            </div>

          </div>

          <strong>
            {dashboard?.active_alerts ?? alerts.length}
          </strong>

          <div className="stat-bottom warning-text">

            {highPriorityAlerts} high priority

            <span>
              currently active
            </span>

          </div>

        </div>

      </section>


      <section className="dashboard-main-grid">

        <div className="panel dashboard-chart-panel">

          <div className="panel-header">

            <div>

              <h2>
                Transaction Activity
              </h2>

              <p>
                Transaction volume over the selected period
              </p>

            </div>

           <span className="dashboard-period">
  Last 30 Days
</span>
          </div>


          <div className="activity-chart">

            <div className="chart-y-axis">

              <span>5K</span>
              <span>4K</span>
              <span>3K</span>
              <span>2K</span>
              <span>1K</span>
              <span>0</span>

            </div>


            <div className="chart-area">

              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>

              <svg
                className="activity-line"
                viewBox="0 0 700 250"
                preserveAspectRatio="none"
              >

                <defs>

                  <linearGradient
                    id="activityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopOpacity="0.25"
                    />

                    <stop
                      offset="100%"
                      stopOpacity="0"
                    />

                  </linearGradient>

                </defs>


                <path
                  className="activity-fill"
                  d="
                    M0,185
                    C35,170 55,175 80,150
                    C105,125 125,145 150,130
                    C175,115 190,135 215,105
                    C240,75 260,115 285,95
                    C310,75 325,90 350,70
                    C375,50 395,85 420,72
                    C445,60 465,90 490,65
                    C515,40 535,58 560,48
                    C585,38 610,55 635,30
                    C660,10 680,30 700,18
                    L700,250
                    L0,250
                    Z
                  "
                />


                <path
                  className="activity-path"
                  d="
                    M0,185
                    C35,170 55,175 80,150
                    C105,125 125,145 150,130
                    C175,115 190,135 215,105
                    C240,75 260,115 285,95
                    C310,75 325,90 350,70
                    C375,50 395,85 420,72
                    C445,60 465,90 490,65
                    C515,40 535,58 560,48
                    C585,38 610,55 635,30
                    C660,10 680,30 700,18
                  "
                />

              </svg>


              <div className="chart-x-axis">

                <span>Aug 01</span>
                <span>Aug 07</span>
                <span>Aug 14</span>
                <span>Aug 21</span>
                <span>Aug 28</span>

              </div>

            </div>

          </div>

        </div>


        <div className="panel dashboard-risk-panel">

          <div className="panel-header">

            <div>

              <h2>
                Risk Distribution
              </h2>

              <p>
                Current transaction risk levels
              </p>

            </div>

          </div>


          <div className="dashboard-donut-wrapper">

            <div className="dashboard-donut">

              <div className="dashboard-donut-center">

                <strong>
                  {totalRisk.toLocaleString("en-IN")}
                </strong>

                <span>
                  Total
                </span>

              </div>

            </div>

          </div>


          <div className="dashboard-risk-legend">

            <div>

              <span>

                <i className="risk-dot high"></i>

                High Risk

              </span>

              <strong>
                {highRiskPercentage}%
              </strong>

            </div>


            <div>

              <span>

                <i className="risk-dot medium"></i>

                Medium Risk

              </span>

              <strong>
                {mediumRiskPercentage}%
              </strong>

            </div>


            <div>

              <span>

                <i className="risk-dot low"></i>

                Low Risk

              </span>

              <strong>
                {lowRiskPercentage}%
              </strong>

            </div>

          </div>

        </div>

      </section>


      <section className="dashboard-bottom-grid">

        <div className="panel dashboard-transactions">

          <div className="panel-header">

            <div>

              <h2>
                Recent Transactions
              </h2>

              <p>
                Latest transactions analyzed by NEXRA
              </p>

            </div>
<button
  type="button"
  className="dashboard-view-all"
  onClick={() => onNavigate("Transactions")}
>
  View All →
</button>

          </div>


          <div className="dashboard-transaction-list">

            <div className="dashboard-transaction-head">

              <span>
                TRANSACTION
              </span>

              <span>
                AMOUNT
              </span>

              <span>
                RISK
              </span>

              <span>
                STATUS
              </span>

            </div>


            {transactions.length === 0 ? (

              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#888",
                }}
              >
                No transactions analyzed yet.
              </div>

            ) : (

              transactions.slice(0, 4).map(
                (transaction) => {

                  const riskScore =
                    Number(
                      transaction.risk_score || 0
                    )

                  const riskClass =
                    riskScore >= 80
                      ? "high"
                      : riskScore >= 50
                      ? "medium"
                      : "low"

                  return (
                    <div
                      className="dashboard-transaction-row"
                      key={transaction.id}
                    >

                      <span>
                        #{transaction.id}
                      </span>

                      <strong>
                        ₹{Number(
                          transaction.amount || 0
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>

                      <b
                        className={`dashboard-risk-badge ${riskClass}`}
                      >
                        {riskScore.toFixed(1)}
                      </b>

                      <span
                        className={`dashboard-status-badge ${
                          transaction.status === "Blocked"
                            ? "blocked"
                            : transaction.status === "Review"
                            ? "review"
                            : "approved"
                        }`}
                      >
                        {transaction.status}
                      </span>

                    </div>
                  )
                }
              )

            )}

          </div>

        </div>


        <div className="panel dashboard-alerts">

          <div className="panel-header">

            <div>

              <h2>
                Active Alerts
              </h2>

              <p>
                Security events requiring attention
              </p>

            </div>

            <span className="alert-count">
              {highPriorityAlerts} High
            </span>

          </div>


          <div className="dashboard-alert-list">

            {alerts.slice(0, 4).map(
              (alert) => {

                const alertClass =
                  alert.severity === "Critical" ||
                  alert.severity === "High"
                    ? "high"
                    : "medium"

                return (
                  <div
                    className="dashboard-alert"
                    key={alert.id}
                  >

                    <div
                      className={`dashboard-alert-icon ${alertClass}`}
                    >
                      !
                    </div>

                    <div>

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

                  </div>
                )
              }
            )}

          </div>

        </div>

      </section>

    </div>
  )
}

export default Dashboard