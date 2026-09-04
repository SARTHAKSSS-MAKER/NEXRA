import { useEffect, useState } from "react"
import { getTransactions, predictFraud, getTestTransactions } from "../api"

function Transactions() {
  const [showDateMenu, setShowDateMenu] = useState(false)
  const [dateRange, setDateRange] = useState("Last 24 Hours")

  const [transactions, setTransactions] = useState([])
  const [testTransactions, setTestTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [features, setFeatures] = useState(
    Array(30).fill("")
  )

  const [prediction, setPrediction] = useState(null)
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [predictionError, setPredictionError] = useState("")
  const [selectedTestTransaction, setSelectedTestTransaction] = useState(null)
  const [selectedTestIndex, setSelectedTestIndex] = useState(0)

  const dateOptions = [
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
  ]

  const selectDate = (option) => {
    setDateRange(option)
    setShowDateMenu(false)
  }

 useEffect(() => {
  Promise.all([
    getTransactions(),
    getTestTransactions(),
  ])
    .then(([transactionData, testData]) => {
      setTransactions(transactionData)
      setTestTransactions(testData.transactions || [])
      setLoading(false)
    })
    .catch((error) => {
      console.error("Transaction API error:", error)
      setError("Unable to connect to NEXRA backend")
      setLoading(false)
    })
}, [])

  const handleFeatureChange = (index, value) => {
    setFeatures((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })

    setPrediction(null)
    setPredictionError("")
  }

const loadExampleTransaction = (index = selectedTestIndex) => {
  if (testTransactions.length === 0) {
    setPredictionError("No test transactions are available.")
    return
  }

  const transaction = testTransactions[index]

  setFeatures(transaction.features.map(String))
  setSelectedTestIndex(index)
  setSelectedTestTransaction(transaction)
  setPrediction(null)
  setPredictionError("")
}

  const clearPredictionForm = () => {
    setFeatures(Array(30).fill(""))
    setPrediction(null)
    setPredictionError("")
  }

  const runFraudAnalysis = async () => {
    setPredictionError("")
    setPrediction(null)

    const hasEmptyValue = features.some(
      (feature) => feature === ""
    )

    if (hasEmptyValue) {
      setPredictionError(
        "Please enter all 30 model features before running the analysis."
      )
      return
    }

    const numericFeatures = features.map(Number)

    if (numericFeatures.some((value) => !Number.isFinite(value))) {
      setPredictionError(
        "All model features must contain valid numbers."
      )
      return
    }

    setPredictionLoading(true)

    try {
      const result = await predictFraud(numericFeatures)
      setPrediction(result)
    } catch (error) {
      console.error("Fraud prediction error:", error)
      setPredictionError(
        "Unable to run fraud prediction. Check that the NEXRA backend is running."
      )
    } finally {
      setPredictionLoading(false)
    }
  }

  const totalTransactions = transactions.length

  const highRiskTransactions = transactions.filter(
    (transaction) => Number(transaction.risk_score) >= 80
  ).length

  const flaggedTransactions = transactions.filter(
    (transaction) => Number(transaction.risk_score) >= 60
  ).length

  const averageRisk =
    transactions.length > 0
      ? (
          transactions.reduce(
            (total, transaction) =>
              total + Number(transaction.risk_score),
            0
          ) / transactions.length
        ).toFixed(1)
      : "0.0"

  const featureNames = [
    "Time",
    ...Array.from({ length: 28 }, (_, index) => `V${index + 1}`),
    "Amount",
  ]

  return (
    <div className="page transaction-page">

      <div className="page-heading">

        <div>
          <p className="eyebrow">
            TRANSACTION INTELLIGENCE
          </p>

          <h1>Transactions</h1>

          <p className="subtitle">
            Monitor and investigate transactions in real time
          </p>
        </div>

        <div
          style={{
            position: "relative",
            display: "inline-block",
            zIndex: 100,
          }}
        >

          <button
            type="button"
            className="date-selector"
            onClick={() =>
              setShowDateMenu((prev) => !prev)
            }
          >

            <span>{dateRange}</span>

            <span
              style={{
                marginLeft: "8px",
                display: "inline-block",
                transition: "transform 0.2s ease",
                transform: showDateMenu
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            >
              ⌄
            </span>

          </button>

          {showDateMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "170px",
                padding: "6px",
                background: "#111111",
                border:
                  "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                boxShadow:
                  "0 15px 35px rgba(0,0,0,0.45)",
                zIndex: 9999,
              }}
            >

              {dateOptions.map((option) => (

                <button
                  key={option}
                  type="button"
                  onClick={() => selectDate(option)}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background:
                      dateRange === option
                        ? "rgba(255,190,0,0.10)"
                        : "transparent",
                    color:
                      dateRange === option
                        ? "#f5b800"
                        : "#dddddd",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    textAlign: "left",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                  }}
                  onMouseEnter={(e) => {
                    if (dateRange !== option) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (dateRange !== option) {
                      e.currentTarget.style.background =
                        "transparent"
                    }
                  }}
                >

                  <span>{option}</span>

                  {dateRange === option && (
                    <span>✓</span>
                  )}

                </button>

              ))}

            </div>
          )}

        </div>

      </div>


      <section className="transaction-stats">

        <div className="transaction-stat">
          <span>Total Transactions</span>

          <strong>
            {loading ? "—" : totalTransactions}
          </strong>

          <small>
            From database
          </small>
        </div>

        <div className="transaction-stat">
          <span>High Risk</span>

          <strong>
            {loading ? "—" : highRiskTransactions}
          </strong>

          <small>
            Risk score ≥ 80
          </small>
        </div>

        <div className="transaction-stat">
          <span>Flagged</span>

          <strong>
            {loading ? "—" : flaggedTransactions}
          </strong>

          <small>
            Risk score ≥ 60
          </small>
        </div>

        <div className="transaction-stat">
          <span>Avg. Risk Score</span>

          <strong>
            {loading ? "—" : averageRisk}
          </strong>

          <small>
            Calculated from transactions
          </small>
        </div>

      </section>


      <section
        className="panel"
        style={{
          marginBottom: "24px",
          padding: "24px",
        }}
      >

        <div className="panel-header">

          <div>
            <h2>Model 1 — Fraud Analysis</h2>

            <p>
              Run a transaction through the trained financial fraud detection model
            </p>
          </div>
          {selectedTestTransaction && (
  <div
    style={{
      marginTop: "12px",
      padding: "10px 14px",
      borderRadius: "8px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      fontSize: "13px",
    }}
  >
    <strong>
      Testing: {selectedTestTransaction.id}
    </strong>

    <span
      style={{
        marginLeft: "12px",
        color:
          selectedTestTransaction.actual_class === 1
            ? "#ff7777"
            : "#9fd89f",
      }}
    >
      Actual: {selectedTestTransaction.actual_label}
    </span>
  </div>
)}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >

            <select
  value={selectedTestIndex}
  onChange={(e) =>
    loadExampleTransaction(Number(e.target.value))
  }
  className="filter-button"
>
  {testTransactions.map((transaction, index) => (
    <option key={transaction.id} value={index}>
      {transaction.id} — {transaction.actual_label}
    </option>
  ))}
</select>

          <button
  type="button"
  className="filter-button"
  onClick={() => loadExampleTransaction(5)}
>
  Load Fraud Example
</button>

            <button
              type="button"
              className="filter-button"
              onClick={clearPredictionForm}
            >
              Clear
            </button>

          </div>

        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginTop: "20px",
          }}
        >

          {featureNames.map((name, index) => (

            <div key={name}>

              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "12px",
                  color: "#999",
                }}
              >
                {name}
              </label>

              <input
                type="number"
                step="any"
                value={features[index]}
                onChange={(e) =>
                  handleFeatureChange(
                    index,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border:
                    "1px solid rgba(255,255,255,0.12)",
                  background: "#111",
                  color: "#fff",
                  outline: "none",
                }}
              />

            </div>

          ))}

        </div>


        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >

          <button
            type="button"
            className="settings-save-btn"
            onClick={runFraudAnalysis}
            disabled={predictionLoading}
          >
            {predictionLoading
              ? "Analyzing..."
              : "Run Fraud Analysis"}
          </button>

        </div>


        {predictionError && (
          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              borderRadius: "10px",
              background: "rgba(255,80,80,0.08)",
              border:
                "1px solid rgba(255,80,80,0.2)",
              color: "#ff7777",
            }}
          >
            {predictionError}
          </div>
        )}


        {prediction && (
          <div
            style={{
              marginTop: "22px",
              padding: "20px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.025)",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "14px",
              }}
            >

              <PredictionMetric
                label="Result"
                value={prediction.result}
              />

              <PredictionMetric
                label="Fraud Probability"
                value={`${Number(
                  prediction.fraud_probability_percent ??
                  prediction.fraud_probability * 100
                ).toFixed(2)}%`}
              />

              <PredictionMetric
                label="Risk Score"
                value={`${Number(
                  prediction.risk_score
                ).toFixed(2)}/100`}
              />

              <PredictionMetric
                label="Risk Level"
                value={prediction.risk_level}
              />

              <PredictionMetric
                label="Status"
                value={prediction.status}
              />

              <PredictionMetric
                label="Prediction"
                value={
                  prediction.fraud
                    ? "Fraud"
                    : "Legitimate"
                }
              />

            </div>

          </div>
        )}

      </section>


      <section className="panel transactions-panel">

        <div className="panel-header transactions-header">

          <div>
            <h2>Transaction Stream</h2>

            <p>
              Latest processed transactions
            </p>
          </div>

          <div className="transaction-controls">

            <button
              type="button"
              className="filter-button"
            >
              All Risk ▾
            </button>

            <button
              type="button"
              className="filter-button"
            >
              All Status ▾
            </button>

          </div>

        </div>


        {error && (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#ff6b6b",
            }}
          >
            {error}
          </div>
        )}


        {loading && !error && (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#aaa",
            }}
          >
            Loading transactions...
          </div>
        )}


        {!loading && !error && (
          <div className="transaction-table">

            <div className="transaction-table-head">
              <span>Transaction</span>
              <span>User</span>
              <span>Amount</span>
              <span>Location</span>
              <span>Device</span>
              <span>Risk Score</span>
              <span>Status</span>
              <span>Time</span>
            </div>


            {transactions.map((transaction) => {

              const risk = Number(
                transaction.risk_score
              )

              const status =
                risk >= 80
                  ? "High Risk"
                  : risk >= 60
                  ? "Medium Risk"
                  : "Low Risk"

              return (
                <div
                  className="transaction-row"
                  key={transaction.id}
                >

                  <div>
                    <strong>
                      {transaction.id}
                    </strong>

                    <small>
                      Payment
                    </small>
                  </div>

                  <span>
                    —
                  </span>

                  <strong>
                    ₹{Number(
                      transaction.amount
                    ).toLocaleString("en-IN")}
                  </strong>

                  <span>
                    {transaction.location}
                  </span>

                  <span className="device suspicious">
                    —
                  </span>

                  <div className="risk-score">

                    <div className="risk-score-bar">

                      <i
                        style={{
                          width: `${risk}%`,
                        }}
                      ></i>

                    </div>

                    <strong>
                      {risk}
                    </strong>

                  </div>

                  <span
                    className={`transaction-status ${
                      status === "High Risk"
                        ? "high"
                        : status === "Medium Risk"
                        ? "medium"
                        : "low"
                    }`}
                  >
                    {transaction.status || status}
                  </span>

                  <span className="transaction-time">
                    —
                  </span>

                </div>
              )
            })}

          </div>
        )}

      </section>

    </div>
  )
}


function PredictionMetric({ label, value }) {
  return (
    <div>
      <span
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "12px",
          color: "#888",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: "block",
          fontSize: "18px",
        }}
      >
        {value}
      </strong>
    </div>
  )
}


export default Transactions