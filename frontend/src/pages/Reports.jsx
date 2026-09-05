import { useEffect, useState } from "react"
import {
  getReports,
  getTransactions,
  getEvaluation,
} from "../api"

function Reports() {
  const [dateRange, setDateRange] = useState("Last 30 Days")
  const [showDateMenu, setShowDateMenu] = useState(false)

  const [reports, setReports] = useState([])
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
          transactionsData,
          evaluationData,
        ] = await Promise.all([
          getReports(),
          getTransactions(),
          getEvaluation(),
        ])

        setReports(
          Array.isArray(reportsData)
            ? reportsData
            : reportsData?.reports || []
        )

        setTransactions(
          Array.isArray(transactionsData)
            ? transactionsData
            : transactionsData?.transactions || []
        )

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

  const liveTransactions = transactions.length

  const highRiskTransactions = transactions.filter(
    (transaction) => {
      const score = Number(
        transaction.risk_score ?? 0
      )

      return score >= 50
    }
  ).length

  const mediumRiskTransactions = transactions.filter(
    (transaction) => {
      const score = Number(
        transaction.risk_score ?? 0
      )

      return score >= 25 && score < 50
    }
  ).length

  const lowRiskTransactions = transactions.filter(
    (transaction) => {
      const score = Number(
        transaction.risk_score ?? 0
      )

      return score < 25
    }
  ).length

  const totalRiskTransactions =
    highRiskTransactions +
    mediumRiskTransactions +
    lowRiskTransactions

  const highRiskPercentage =
    totalRiskTransactions > 0
      ? (
          (highRiskTransactions /
            totalRiskTransactions) *
          100
        ).toFixed(1)
      : "0.0"

  const mediumRiskPercentage =
    totalRiskTransactions > 0
      ? (
          (mediumRiskTransactions /
            totalRiskTransactions) *
          100
        ).toFixed(1)
      : "0.0"

  const lowRiskPercentage =
    totalRiskTransactions > 0
      ? (
          (lowRiskTransactions /
            totalRiskTransactions) *
          100
        ).toFixed(1)
      : "0.0"

  const accuracy =
    evaluation?.accuracy != null
      ? (Number(evaluation.accuracy) * 100).toFixed(1)
      : "0.0"

  const precision =
    evaluation?.precision != null
      ? (Number(evaluation.precision) * 100).toFixed(1)
      : "0.0"

  const recall =
    evaluation?.recall != null
      ? (Number(evaluation.recall) * 100).toFixed(1)
      : "0.0"

  const f1 =
    evaluation?.f1_score != null
      ? (Number(evaluation.f1_score) * 100).toFixed(1)
      : "0.0"

  const testSamples =
    Number(evaluation?.test_samples ?? 0)

  const riskLevel =
    highRiskTransactions > 0
      ? "High"
      : mediumRiskTransactions > 0
        ? "Medium"
        : "Low"

  const getReportTransactionCount = () => {
    return liveTransactions
  }

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
            {liveTransactions.toLocaleString("en-IN")}
          </strong>

          <small>
            Live AI predictions
          </small>

        </div>

        <div className="reports-stat-card">

          <span>
            High Risk Detected
          </span>

          <strong>
            {highRiskTransactions.toLocaleString("en-IN")}
          </strong>

          <small>
            {highRiskPercentage}% of live predictions
          </small>

        </div>

        <div className="reports-stat-card">

          <span>
            Fraud Recall
          </span>

          <strong className="reports-stat-positive">
            {recall}%
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

            <small>
              Overall predictions
            </small>

          </div>

          <div className="reports-stat-card">

            <span>
              Precision
            </span>

            <strong>
              {precision}%
            </strong>

            <small>
              Fraud prediction precision
            </small>

          </div>

          <div className="reports-stat-card">

            <span>
              Recall
            </span>

            <strong>
              {recall}%
            </strong>

            <small>
              Fraud detection recall
            </small>

          </div>

          <div className="reports-stat-card">

            <span>
              F1 Score
            </span>

            <strong>
              {f1}%
            </strong>

            <small>
              Precision-recall balance
            </small>

          </div>

        </div>

        {testSamples > 0 && (
          <p
            style={{
              marginTop: "16px",
              color: "#888",
              fontSize: "13px",
            }}
          >
            Evaluation dataset:{" "}
            {testSamples.toLocaleString("en-IN")}{" "}
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
                Live transaction risk distribution
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
                  {totalRiskTransactions.toLocaleString(
                    "en-IN"
                  )}
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
                  {getReportTransactionCount().toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <span
                  className={`reports-risk-badge ${
                    (
                      report.risk ||
                      riskLevel
                    ).toLowerCase()
                  }`}
                >
                  {report.risk || riskLevel}
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