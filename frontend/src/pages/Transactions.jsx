import { useState } from "react"

function Transactions() {
  const [showDateMenu, setShowDateMenu] = useState(false)
  const [dateRange, setDateRange] = useState("Last 24 Hours")

  const transactions = [
    {
      id: "TXN-84921",
      user: "Aarav Mehta",
      amount: "₹84,500",
      location: "Mumbai, IN",
      device: "New Device",
      risk: 91,
      status: "High Risk",
      time: "2 min ago",
    },
    {
      id: "TXN-84920",
      user: "Riya Sharma",
      amount: "₹12,800",
      location: "Pune, IN",
      device: "Trusted",
      risk: 34,
      status: "Low Risk",
      time: "5 min ago",
    },
    {
      id: "TXN-84919",
      user: "Kabir Singh",
      amount: "₹46,200",
      location: "Delhi, IN",
      device: "New Device",
      risk: 72,
      status: "Medium Risk",
      time: "8 min ago",
    },
    {
      id: "TXN-84918",
      user: "Ananya Rao",
      amount: "₹7,450",
      location: "Bangalore, IN",
      device: "Trusted",
      risk: 18,
      status: "Low Risk",
      time: "12 min ago",
    },
    {
      id: "TXN-84917",
      user: "Vihaan Patel",
      amount: "₹1,24,800",
      location: "Ahmedabad, IN",
      device: "Unknown",
      risk: 96,
      status: "High Risk",
      time: "16 min ago",
    },
    {
      id: "TXN-84916",
      user: "Ishita Kapoor",
      amount: "₹28,900",
      location: "Mumbai, IN",
      device: "Trusted",
      risk: 41,
      status: "Medium Risk",
      time: "21 min ago",
    },
  ]

  const dateOptions = [
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
  ]

  const selectDate = (option) => {
    setDateRange(option)
    setShowDateMenu(false)
  }

  return (
    <div className="page transaction-page">

      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">TRANSACTION INTELLIGENCE</p>

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
            onClick={() => setShowDateMenu((prev) => !prev)}
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
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.45)",
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
                    justifyContent: "space-between",
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
          <strong>1,389</strong>
          <small>+20.1% vs last period</small>
        </div>

        <div className="transaction-stat">
          <span>High Risk</span>
          <strong>347</strong>
          <small>25% of total transactions</small>
        </div>

        <div className="transaction-stat">
          <span>Flagged</span>
          <strong>128</strong>
          <small>9.2% flagged by model</small>
        </div>

        <div className="transaction-stat">
          <span>Avg. Risk Score</span>
          <strong>64.8</strong>
          <small>+4.6% from yesterday</small>
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


        {/* TABLE */}
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


          {transactions.map((transaction) => (

            <div
              className="transaction-row"
              key={transaction.id}
            >

              <div>
                <strong>{transaction.id}</strong>
                <small>Payment</small>
              </div>


              <span>
                {transaction.user}
              </span>


              <strong>
                {transaction.amount}
              </strong>


              <span>
                {transaction.location}
              </span>


              <span
                className={
                  transaction.device === "Trusted"
                    ? "device trusted"
                    : "device suspicious"
                }
              >
                {transaction.device}
              </span>


              <div className="risk-score">

                <div className="risk-score-bar">
                  <i
                    style={{
                      width: `${transaction.risk}%`,
                    }}
                  ></i>
                </div>

                <strong>
                  {transaction.risk}
                </strong>

              </div>


              <span
                className={`transaction-status ${
                  transaction.status.includes("High")
                    ? "high"
                    : transaction.status.includes("Medium")
                    ? "medium"
                    : "low"
                }`}
              >
                {transaction.status}
              </span>


              <span className="transaction-time">
                {transaction.time}
              </span>

            </div>

          ))}

        </div>

      </section>

    </div>
  )
}

export default Transactions