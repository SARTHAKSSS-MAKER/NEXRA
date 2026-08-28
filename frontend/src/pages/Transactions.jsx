import { useEffect, useState } from "react"
import { getTransactions } from "../api"

function Transactions() {
  const [showDateMenu, setShowDateMenu] = useState(false)
  const [dateRange, setDateRange] = useState("Last 24 Hours")

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const dateOptions = [
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
  ]

  const selectDate = (option) => {
    setDateRange(option)
    setShowDateMenu(false)
  }

  // GET transactions from FastAPI
  useEffect(() => {
  getTransactions()
    .then((data) => {
      setTransactions(data)
      setLoading(false)
    })
    .catch((error) => {
      console.error("Transaction API error:", error)
      setError("Unable to connect to NEXRA backend")
      setLoading(false)
    })
}, [])

  // Calculate stats from actual database data
  const totalTransactions = transactions.length

  const highRiskTransactions = transactions.filter(
    (transaction) => transaction.risk_score >= 80
  ).length

  const flaggedTransactions = transactions.filter(
    (transaction) => transaction.risk_score >= 60
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

  return (
    <div className="page transaction-page">

      {/* PAGE HEADING */}
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


        {/* DATE SELECTOR */}
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


          {/* DROPDOWN */}
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


      {/* TRANSACTION STATS */}
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


      {/* TRANSACTION STREAM */}
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


        {/* ERROR */}
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


        {/* LOADING */}
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


        {/* TABLE */}
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

                  {/* TRANSACTION */}
                  <div>
                    <strong>
                      {transaction.id}
                    </strong>

                    <small>
                      Payment
                    </small>
                  </div>


                  {/* USER */}
                  <span>
                    — 
                  </span>


                  {/* AMOUNT */}
                  <strong>
                    ₹{Number(
                      transaction.amount
                    ).toLocaleString("en-IN")}
                  </strong>


                  {/* LOCATION */}
                  <span>
                    {transaction.location}
                  </span>


                  {/* DEVICE */}
                  <span className="device suspicious">
                    —
                  </span>


                  {/* RISK SCORE */}
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


                  {/* STATUS */}
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


                  {/* TIME */}
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

export default Transactions