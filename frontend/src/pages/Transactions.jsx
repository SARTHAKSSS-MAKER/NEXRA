import { useState } from "react"

function Transactions() {
  const [dateRange, setDateRange] = useState("Last 24 Hours")
  const [showDateMenu, setShowDateMenu] = useState(false)

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

  const handleDateSelect = (range) => {
    setDateRange(range)
    setShowDateMenu(false)
  }

  return (
    <div className="page transaction-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-heading">

        <div>
          <p className="eyebrow">
            TRANSACTION INTELLIGENCE
          </p>

          <h1>
            Transactions
          </h1>

          <p className="subtitle">
            Monitor and investigate transactions in real time
          </p>
        </div>


        {/* =========================
            DATE DROPDOWN
        ========================= */}

        <div className="date-selector-wrapper">

          <button
            className="date-selector"
            onClick={() =>
              setShowDateMenu(!showDateMenu)
            }
          >
            <span>
              {dateRange}
            </span>

            <span className="date-arrow">
              {showDateMenu ? "⌃" : "⌄"}
            </span>
          </button>


          {showDateMenu && (
            <div className="date-dropdown">

              {dateOptions.map((option) => (
                <button
                  key={option}
                  className={
                    dateRange === option
                      ? "date-option active"
                      : "date-option"
                  }
                  onClick={() =>
                    handleDateSelect(option)
                  }
                >
                  {option}

                  {dateRange === option && (
                    <span className="check">
                      ✓
                    </span>
                  )}
                </button>
              ))}

            </div>
          )}

        </div>

      </div>


      {/* =========================
          TRANSACTION STATS
      ========================= */}

      <section className="transaction-stats">

        <div className="transaction-stat">
          <span>
            Total Transactions
          </span>

          <strong>
            1,389
          </strong>

          <small>
            +20.1% vs last period
          </small>
        </div>


        <div className="transaction-stat">
          <span>
            High Risk
          </span>

          <strong>
            347
          </strong>

          <small>
            25% of total transactions
          </small>
        </div>


        <div className="transaction-stat">
          <span>
            Flagged
          </span>

          <strong>
            128
          </strong>

          <small>
            9.2% flagged by model
          </small>
        </div>


        <div className="transaction-stat">
          <span>
            Avg. Risk Score
          </span>

          <strong>
            64.8
          </strong>

          <small>
            +4.6% from yesterday
          </small>
        </div>

      </section>


      {/* =========================
          TRANSACTION TABLE
      ========================= */}

      <section className="panel transactions-panel">

        <div className="panel-header transactions-header">

          <div>
            <h2>
              Transaction Stream
            </h2>

            <p>
              Latest processed transactions
            </p>
          </div>


          <div className="transaction-controls">

            <button className="filter-button">
              All Risk ▾
            </button>

            <button className="filter-button">
              All Status ▾
            </button>

          </div>

        </div>


        <div className="transaction-table">

          {/* TABLE HEADER */}

          <div className="transaction-table-head">

            <span>
              Transaction
            </span>

            <span>
              User
            </span>

            <span>
              Amount
            </span>

            <span>
              Location
            </span>

            <span>
              Device
            </span>

            <span>
              Risk Score
            </span>

            <span>
              Status
            </span>

            <span>
              Time
            </span>

          </div>


          {/* TRANSACTION ROWS */}

          {transactions.map((transaction) => (

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


              {/* RISK SCORE */}

              <div className="risk-score">

                <div className="risk-score-bar">
                  <i
                    style={{
                      width: `${transaction.risk}%`,
                    }}
                  />
                </div>

                <strong>
                  {transaction.risk}
                </strong>

              </div>


              {/* STATUS */}

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