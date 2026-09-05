import { useEffect, useState } from "react"
import {
  getReports,
  getRisk,
  getDashboard,
  getTransactions,
  getEvaluation,
} from "../api"

function Reports() {
  const [dateRange, setDateRange] = useState("Last 30 Days")
  const [showDateMenu, setShowDateMenu] = useState(false)

  const [reports, setReports] = useState([])
  const [risk, setRisk] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [evaluation, setEvaluation] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const dateOptions = [
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
  ]

  useEffect(() => {
    const loadReportsData = async () => {
      try {
        setLoading(true)
        setError("")

        const [
          reportsData,
          riskData,
          dashboardData,
          transactionsData,
          evaluationData,
        ] = await Promise.all([
          getReports(),
          getRisk(),
          getDashboard(),
          getTransactions(),
          getEvaluation(),
        ])

        setReports(reportsData)
        setRisk(riskData)
        setDashboard(dashboardData)
        setTransactions(transactionsData)
        setEvaluation(evaluationData)

        setLoading(false)
      } catch (err) {
        console.error("Reports API error:", err)

        setError("Unable to connect to NEXRA backend")

        setLoading(false)
      }
    }

    loadReportsData()
  }, [])

  const totalTransactions =
    dashboard?.total_transactions ??
    transactions.length

  const highRiskTransactions =
    dashboard?.high_risk_transactions ??
    risk?.high_risk ??
    0

  const detectionRate =
    evaluation?.recall != null
      ? (evaluation.recall * 100).toFixed(1)
      : dashboard?.detection_accuracy ?? 0

  const accuracy =
    evaluation?.accuracy != null
      ? (evaluation.accuracy * 100).toFixed(1)
      : "0.0"

  const precision =
    evaluation?.precision != null
      ? (evaluation.precision * 100).toFixed(1)
      : "0.0"

  const recall =
    evaluation?.recall != null
      ? (evaluation.recall * 100).toFixed(1)
      : "0.0"

  const f1 =
    evaluation?.f1_score != null
      ? (evaluation.f1_score * 100).toFixed(1)
      : "0.0"

  const totalRiskTransactions =
    (risk?.high_risk ?? 0) +
    (risk?.medium_risk ?? 0) +
    (risk?.low_risk ?? 0)

  const highRiskPercentage =
    totalRiskTransactions > 0
      ? (
          (risk.high_risk /
            totalRiskTransactions) *
          100
        ).toFixed(1)
      : "0.0"

  const mediumRiskPercentage =
    totalRiskTransactions > 0
      ? (
          (risk.medium_risk /
            totalRiskTransactions) *
          100
        ).toFixed(1)
      : "0.0"

  const lowRiskPercentage =
    totalRiskTransactions > 0
      ? (
          (risk.low_risk /
            totalRiskTransactions) *
          100
        ).toFixed(1)
      : "0.0"

  if (loading) {
    return (
      <div className="page reports-page">
        <div
          style={{
            padding: "80px",
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Loading NEXRA reports...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page reports-page">
        <div
          style={{
            padding: "80px",
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
    <div className="page reports-page">

      <div className="reports-header">

        <div className="reports-header-content">

          <p className="reports-eyebrow">
            ANALYTICS & REPORTING
          </p>

          <h1>
            Reports
          </h1>

          <p className="reports-subtitle">
            Generate and review fraud intelligence reports
          </p>

        </div>

        <div className="reports-date-wrapper">

          <button
            type="button"
            className="reports-date-selector"
            onClick={() =>
              setShowDateMenu((prev) => !prev)
            }
          >
            <span>
              {dateRange}
            </span>

            <span
              className={`reports-date-arrow ${
                showDateMenu ? "open" : ""
              }`}
            >
              ⌄
            </span>
          </button>

          {showDateMenu && (
            <div className="reports-date-dropdown">

              {dateOptions.map((option) => (

                <button
                  key={option}
                  type="button"
                  className={`reports-date-option ${
                    dateRange === option
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setDateRange(option)
                    setShowDateMenu(false)
                  }}
                >
                  <span>
                    {option}
                  </span>

                  {dateRange === option && (
                    <span className="reports-check">
                      ✓
                    </span>
                  )}
                </button>

              ))}

            </div>
          )}

        </div>

      </div>

      <section className="reports-stat-grid">

        <div className="reports-stat-card">

          <span>
            Reports Generated
          </span>

          <strong>
            {reports.length}
          </strong>

          <small className="reports-stat-positive">
            From NEXRA backend
          </small>

        </div>

        <div className="reports-stat-card">

          <span>
            Transactions Analyzed
          </span>

          <strong>
            {Number(
              totalTransactions
            ).toLocaleString("en-IN")}
          </strong>

          <small>
            Across all risk models
          </small>

        </div>

        <div className="reports-stat-card">

          <span>
            High Risk Detected
          </span>

          <strong>
            {Number(
              highRiskTransactions
            ).toLocaleString("en-IN")}
          </strong>

          <small>
            {highRiskPercentage}% of transactions
          </small>

        </div>

        <div className="reports-stat-card">

          <span>
            Fraud Recall
          </span>

          <strong className="reports-stat-positive">
            {detectionRate}%
          </strong>

          <small className="reports-stat-positive">
            Real held-out evaluation
          </small>

        </div>

      </section>

      <section
        className="reports-panel"
        style={{
          marginBottom: "24px",
        }}
      >

        <div className="reports-panel-header">

          <div>

            <h2>
              AI Model Evaluation
            </h2>

            <p>
              Performance measured on held-out test data
            </p>

          </div>

          <span
            className="reports-risk-badge low"
          >
            VERIFIED
          </span>

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "16px",
          }}
        >

          <div className="reports-stat-card">

            <span>
              Accuracy
            </span>

            <strong>
              {accuracy}%
            </strong>

          </div>

          <div className="reports-stat-card">

            <span>
              Precision
            </span>

            <strong>
              {precision}%
            </strong>

          </div>

          <div className="reports-stat-card">

            <span>
              Recall
            </span>

            <strong>
              {recall}%
            </strong>

          </div>

          <div className="reports-stat-card">

            <span>
              F1 Score
            </span>

            <strong>
              {f1}%
            </strong>

          </div>

        </div>

        {evaluation?.test_samples && (
          <p
            style={{
              marginTop: "16px",
              color: "#888",
              fontSize: "13px",
            }}
          >
            Evaluation dataset:{" "}
            {evaluation.test_samples.toLocaleString("en-IN")}{" "}
            held-out transactions
          </p>
        )}

      </section>

      <div className="reports-middle-grid">

        <section className="reports-panel reports-risk-panel">

          <div className="reports-panel-header">

            <div>

              <h2>
                Risk Summary
              </h2>

              <p>
                Transaction risk distribution
              </p>

            </div>

            <button
              type="button"
              className="reports-view-button"
            >
              {dateRange}
              <span>
                ⌄
              </span>
            </button>

          </div>

          <div className="reports-risk-content">

            <div className="reports-donut">

              <div className="reports-donut-center">

                <strong>
                  {Number(
                    totalRiskTransactions
                  ).toLocaleString("en-IN")}
                </strong>

                <span>
                  Transactions
                </span>

              </div>

            </div>

            <div className="reports-risk-legend">

              <div className="reports-risk-item">

                <div className="reports-risk-label">

                  <i className="reports-risk-dot high"></i>

                  <span>
                    High Risk
                  </span>

                </div>

                <strong>
                  {highRiskPercentage}%
                </strong>

              </div>

              <div className="reports-risk-item">

                <div className="reports-risk-label">

                  <i className="reports-risk-dot medium"></i>

                  <span>
                    Medium Risk
                  </span>

                </div>

                <strong>
                  {mediumRiskPercentage}%
                </strong>

              </div>

              <div className="reports-risk-item">

                <div className="reports-risk-label">

                  <i className="reports-risk-dot low"></i>

                  <span>
                    Low Risk
                  </span>

                </div>

                <strong>
                  {lowRiskPercentage}%
                </strong>

              </div>

            </div>

          </div>

        </section>

        <section className="reports-panel reports-generate-panel">

          <div className="reports-panel-header">

            <div>

              <h2>
                Generate Report
              </h2>

              <p>
                Create a new intelligence report
              </p>

            </div>

          </div>

          <div className="reports-generate-content">

            <button
              type="button"
              className="reports-generate-option"
            >

              <div className="reports-generate-icon">
                ◈
              </div>

              <div className="reports-generate-text">

                <strong>
                  Risk Intelligence
                </strong>

                <span>
                  Complete risk overview
                </span>

              </div>

              <b className="reports-generate-arrow">
                →
              </b>

            </button>

            <button
              type="button"
              className="reports-generate-option"
            >

              <div className="reports-generate-icon">
                ◫
              </div>

              <div className="reports-generate-text">

                <strong>
                  Transaction Analysis
                </strong>

                <span>
                  Detailed transaction activity
                </span>

              </div>

              <b className="reports-generate-arrow">
                →
              </b>

            </button>

            <button
              type="button"
              className="reports-generate-option"
            >

              <div className="reports-generate-icon">
                ◇
              </div>

              <div className="reports-generate-text">

                <strong>
                  Model Performance
                </strong>

                <span>
                  AI model evaluation
                </span>

              </div>

              <b className="reports-generate-arrow">
                →
              </b>

            </button>

          </div>

        </section>

      </div>

      <section className="reports-panel reports-recent-panel">

        <div className="reports-panel-header">

          <div>

            <h2>
              Recent Reports
            </h2>

            <p>
              Previously generated intelligence reports
            </p>

          </div>

          <button
            type="button"
            className="reports-view-button reports-archive-button"
          >
            View Archive →
          </button>

        </div>

        <div className="reports-table">

          <div className="reports-table-head">

            <span>
              Report
            </span>

            <span>
              Period
            </span>

            <span>
              Transactions
            </span>

            <span>
              Risk Level
            </span>

            <span>
              Generated
            </span>

            <span>
              Action
            </span>

          </div>

          {reports.length > 0 ? (

            reports.map((report) => (

              <div
                className="reports-table-row"
                key={report.id}
              >

                <div className="reports-name">

                  <div className="reports-file-icon">
                    ▤
                  </div>

                  <div className="reports-name-text">

                    <strong>
                      {report.name}
                    </strong>

                    <small>
                      {report.type}
                    </small>

                  </div>

                </div>

                <span className="reports-period">
                  {report.date}
                </span>

                <strong className="reports-transactions">
                  {Number(
                    totalTransactions
                  ).toLocaleString("en-IN")}
                </strong>

                <span
                  className={`reports-risk-badge ${
                    (
                      report.risk ||
                      "Medium"
                    ).toLowerCase()
                  }`}
                >
                  {report.risk || "Medium"}
                </span>

                <span className="reports-generated">
                  {report.status}
                </span>

                <button
                  type="button"
                  className="reports-download"
                  title="Download report"
                >
                  ↓
                </button>

              </div>

            ))

          ) : (

            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#888",
              }}
            >
              No reports available
            </div>

          )}

        </div>

      </section>

    </div>
  )
}

export default Reports