import { useEffect, useMemo, useState } from "react"
import {
  getTransactions,
  getEvaluation,
} from "../api"

function RiskMonitor() {
  const [transactions, setTransactions] = useState([])
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      const [transactionsData, evaluationData] = await Promise.all([
        getTransactions(),
        getEvaluation(),
      ])

      setTransactions(transactionsData || [])
      setEvaluation(evaluationData || null)
      setError("")
    } catch (error) {
      console.error("Risk Monitor API error:", error)
      setError("Unable to connect to NEXRA backend")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    const interval = setInterval(() => {
      loadData()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const latestTransaction = transactions[0] || null

  const currentRiskScore = Number(
    latestTransaction?.risk_score || 0
  )

  const currentRiskLevel =
    currentRiskScore >= 80
      ? "HIGH RISK"
      : currentRiskScore >= 50
      ? "MEDIUM RISK"
      : currentRiskScore >= 25
      ? "ELEVATED"
      : "LOW RISK"

  const riskClass =
    currentRiskScore >= 80
      ? "high"
      : currentRiskScore >= 50
      ? "medium"
      : "low"

  const riskStats = useMemo(() => {
    const high = transactions.filter(
      (transaction) =>
        Number(transaction.risk_score || 0) >= 80
    ).length

    const medium = transactions.filter(
      (transaction) => {
        const score = Number(transaction.risk_score || 0)
        return score >= 50 && score < 80
      }
    ).length

    const low = transactions.filter(
      (transaction) =>
        Number(transaction.risk_score || 0) < 50
    ).length

    return {
      high,
      medium,
      low,
      total: transactions.length,
    }
  }, [transactions])

  const modelRecall =
    evaluation?.recall != null
      ? (evaluation.recall * 100).toFixed(1)
      : "0.0"

  const modelPrecision =
    evaluation?.precision != null
      ? (evaluation.precision * 100).toFixed(1)
      : "0.0"

  const fraudDetected = transactions.filter(
    (transaction) =>
      Number(transaction.risk_score || 0) >= 80
  )

  const reviewTransactions = transactions.filter(
    (transaction) => {
      const score = Number(transaction.risk_score || 0)
      return score >= 50 && score < 80
    }
  )

  if (loading) {
    return (
      <div className="risk-monitor-page">
        <div
          style={{
            padding: "80px",
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Loading NEXRA risk monitor...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="risk-monitor-page">
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
    <div className="risk-monitor-page">

      <div className="risk-monitor-heading">

        <div>
          <p className="risk-monitor-eyebrow">
            LIVE RISK ANALYSIS
          </p>

          <h1>
            Risk Monitor
          </h1>

          <p className="risk-monitor-subtitle">
            Real-time transaction risk intelligence powered by NEXRA
          </p>
        </div>

        <div className="risk-monitor-status">
          <span className="risk-live-dot"></span>
          <span>LIVE API</span>
        </div>

      </div>


      <section className="risk-monitor-hero">

        <div className="risk-score-panel">

          <div className="risk-score-panel-top">

            <div>
              <span className="risk-panel-label">
                CURRENT RISK SCORE
              </span>

              <p>
                Latest analyzed transaction
              </p>
            </div>

            <span className={`risk-state-pill ${riskClass}`}>
              {currentRiskLevel}
            </span>

          </div>


          <div className="risk-score-content">

            <div
              className={`risk-ring ${riskClass}`}
              style={{
                "--risk-progress": `${currentRiskScore * 3.6}deg`,
              }}
            >
              <div className="risk-ring-inner">

                <strong>
                  {currentRiskScore.toFixed(1)}
                </strong>

                <span>
                  / 100
                </span>

              </div>
            </div>


            <div className="risk-score-details">

              <div className="risk-detail-row">
                <span>Transaction</span>

                <strong>
                  {latestTransaction?.id
                    ? `#${latestTransaction.id}`
                    : "No transaction"}
                </strong>
              </div>


              <div className="risk-detail-row">
                <span>Amount</span>

                <strong>
                  {latestTransaction?.amount != null
                    ? `₹${Number(
                        latestTransaction.amount
                      ).toLocaleString("en-IN")}`
                    : "—"}
                </strong>
              </div>


              <div className="risk-detail-row">
                <span>Status</span>

                <strong
                  className={
                    latestTransaction?.status === "Blocked"
                      ? "risk-text-danger"
                      : latestTransaction?.status === "Review"
                      ? "risk-text-warning"
                      : "risk-text-safe"
                  }
                >
                  {latestTransaction?.status || "—"}
                </strong>
              </div>

            </div>

          </div>

        </div>


        <div className="risk-monitor-summary">

          <div className="risk-summary-header">
            <div>
              <span className="risk-panel-label">
                MODEL INTELLIGENCE
              </span>

              <p>
                Held-out evaluation performance
              </p>
            </div>
          </div>


          <div className="risk-summary-metric">

            <span>
              Fraud Recall
            </span>

            <strong>
              {modelRecall}%
            </strong>

            <small>
              Detects actual fraudulent transactions
            </small>

          </div>


          <div className="risk-summary-metric">

            <span>
              Model Precision
            </span>

            <strong>
              {modelPrecision}%
            </strong>

            <small>
              Precision on held-out test data
            </small>

          </div>


          <div className="risk-summary-footer">

            <span className="risk-summary-live-dot"></span>

            Model evaluation verified

          </div>

        </div>

      </section>


      <section className="risk-monitor-metrics">

        <div className="risk-mini-card">

          <span>
            Transactions Scanned
          </span>

          <strong>
            {riskStats.total}
          </strong>

          <small>
            Recent database stream
          </small>

        </div>


        <div className="risk-mini-card danger-card">

          <span>
            High Risk
          </span>

          <strong>
            {riskStats.high}
          </strong>

          <small>
            Score ≥ 80
          </small>

        </div>


        <div className="risk-mini-card warning-card">

          <span>
            Medium Risk
          </span>

          <strong>
            {riskStats.medium}
          </strong>

          <small>
            Score 50–79
          </small>

        </div>


        <div className="risk-mini-card safe-card">

          <span>
            Low Risk
          </span>

          <strong>
            {riskStats.low}
          </strong>

          <small>
            Score below 50
          </small>

        </div>

      </section>


      <section className="risk-monitor-content-grid">

        <div className="risk-monitor-panel live-analysis-panel">

          <div className="risk-monitor-panel-header">

            <div>
              <h2>
                Live Risk Analysis
              </h2>

              <p>
                Risk classification from the latest transaction stream
              </p>
            </div>

            <span className="risk-analysis-live">
              <i></i>
              MONITORING
            </span>

          </div>


          <div className="risk-analysis-list">

            <div className="risk-analysis-item">

              <div className="risk-analysis-icon">
                ↗
              </div>

              <div>
                <strong>
                  Transaction Velocity
                </strong>

                <span>
                  Recent transactions available
                </span>
              </div>

              <b>
                {transactions.length > 0
                  ? "ACTIVE"
                  : "IDLE"}
              </b>

            </div>


            <div className="risk-analysis-item">

              <div className="risk-analysis-icon danger">
                !
              </div>

              <div>
                <strong>
                  High Risk Activity
                </strong>

                <span>
                  Transactions with risk score ≥ 80
                </span>
              </div>

              <b className="danger-value">
                {fraudDetected.length}
              </b>

            </div>


            <div className="risk-analysis-item">

              <div className="risk-analysis-icon warning">
                !
              </div>

              <div>
                <strong>
                  Review Queue
                </strong>

                <span>
                  Transactions requiring analyst review
                </span>
              </div>

              <b className="warning-value">
                {reviewTransactions.length}
              </b>

            </div>


            <div className="risk-analysis-item">

              <div className="risk-analysis-icon">
                ◈
              </div>

              <div>
                <strong>
                  Detection Model
                </strong>

                <span>
                  Financial Fraud Detection v1.0
                </span>
              </div>

              <b className="active-value">
                ACTIVE
              </b>

            </div>

          </div>

        </div>


        <div className="risk-monitor-panel risk-events-panel">

          <div className="risk-monitor-panel-header">

            <div>
              <h2>
                Risk Events
              </h2>

              <p>
                Generated from analyzed transactions
              </p>
            </div>

            <span className="risk-event-count">
              {fraudDetected.length} High
            </span>

          </div>


          <div className="risk-event-list">

            {transactions.length === 0 ? (

              <div className="risk-empty-state">
                No transactions analyzed yet
              </div>

            ) : (

              transactions.slice(0, 4).map(
                (transaction) => {

                  const score =
                    Number(
                      transaction.risk_score || 0
                    )

                  const eventClass =
                    score >= 80
                      ? "high"
                      : score >= 50
                      ? "medium"
                      : "low"

                  return (
                    <div
                      className="risk-event-card"
                      key={transaction.id}
                    >

                      <div
                        className={`risk-event-icon ${eventClass}`}
                      >
                        {score >= 80 ? "!" : "•"}
                      </div>

                      <div className="risk-event-info">

                        <strong>
                          {score >= 80
                            ? "High Risk Transaction"
                            : score >= 50
                            ? "Transaction Under Review"
                            : "Low Risk Transaction"}
                        </strong>

                        <span>
                          #{transaction.id}
                        </span>

                      </div>

                      <b
                        className={`risk-event-level ${eventClass}`}
                      >
                        {score.toFixed(1)}
                      </b>

                    </div>
                  )
                }
              )

            )}

          </div>

        </div>

      </section>


      <section className="risk-monitor-panel transaction-stream-panel">

        <div className="risk-monitor-panel-header">

          <div>
            <h2>
              Live Transaction Stream
            </h2>

            <p>
              Latest transactions analyzed by the fraud detection model
            </p>
          </div>

          <span className="stream-status">
            <i></i>
            AUTO REFRESH
          </span>

        </div>


        <div className="risk-transaction-table">

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


          {transactions.length === 0 ? (

            <div className="risk-empty-state">
              No transactions available
            </div>

          ) : (

            transactions.slice(0, 6).map(
              (transaction) => {

                const score =
                  Number(
                    transaction.risk_score || 0
                  )

                const scoreClass =
                  score >= 80
                    ? "high"
                    : score >= 50
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
                      {transaction.location || "Dataset Test"}
                    </span>

                    <strong
                      className={`transaction-risk ${scoreClass}`}
                    >
                      {score.toFixed(1)}
                    </strong>

                    <b
                      className={`transaction-status ${statusClass}`}
                    >
                      {transaction.status || "Unknown"}
                    </b>

                  </div>
                )
              }
            )

          )}

        </div>

      </section>

    </div>
  )
}

export default RiskMonitor