import { useState } from "react"

function Reports() {
  const [dateRange, setDateRange] = useState("Last 30 Days")
  const [showDateMenu, setShowDateMenu] = useState(false)

  const dateOptions = [
    "Last 24 Hours",
    "Last 7 Days",
    "Last 30 Days",
  ]

  const reports = [
    {
      name: "Monthly Risk Intelligence Report",
      type: "Risk Analysis",
      period: "Aug 01 – Aug 28, 2026",
      transactions: "42,891",
      risk: "High",
      generated: "2 hours ago",
    },
    {
      name: "Fraud Detection Performance",
      type: "Model Performance",
      period: "Aug 01 – Aug 28, 2026",
      transactions: "42,891",
      risk: "Low",
      generated: "Yesterday",
    },
    {
      name: "Transaction Activity Report",
      type: "Transaction Analysis",
      period: "Aug 21 – Aug 28, 2026",
      transactions: "12,483",
      risk: "Medium",
      generated: "Yesterday",
    },
    {
      name: "Security Alert Summary",
      type: "Alert Analysis",
      period: "Aug 01 – Aug 28, 2026",
      transactions: "1,284",
      risk: "High",
      generated: "2 days ago",
    },
  ]

  return (
    <div className="page reports-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="reports-header">

        <div className="reports-header-content">
          <p className="reports-eyebrow">
            ANALYTICS & REPORTING
          </p>

          <h1>Reports</h1>

          <p className="reports-subtitle">
            Generate and review fraud intelligence reports
          </p>
        </div>


        {/* DATE SELECTOR */}

        <div className="reports-date-wrapper">

          <button
            type="button"
            className="reports-date-selector"
            onClick={() =>
              setShowDateMenu((prev) => !prev)
            }
          >
            <span>{dateRange}</span>

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
                    dateRange === option ? "active" : ""
                  }`}
                  onClick={() => {
                    setDateRange(option)
                    setShowDateMenu(false)
                  }}
                >
                  <span>{option}</span>

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


      {/* =====================================================
          REPORT STATISTICS
          ===================================================== */}

      <section className="reports-stat-grid">

        <div className="reports-stat-card">
          <span>Reports Generated</span>

          <strong>128</strong>

          <small className="reports-stat-positive">
            +18.4% this month
          </small>
        </div>


        <div className="reports-stat-card">
          <span>Transactions Analyzed</span>

          <strong>42.9K</strong>

          <small>
            Across all risk models
          </small>
        </div>


        <div className="reports-stat-card">
          <span>High Risk Detected</span>

          <strong>6,284</strong>

          <small>
            14.7% of transactions
          </small>
        </div>


        <div className="reports-stat-card">
          <span>Detection Rate</span>

          <strong className="reports-stat-positive">
            96.8%
          </strong>

          <small className="reports-stat-positive">
            +2.1% from last month
          </small>
        </div>

      </section>


      {/* =====================================================
          MIDDLE SECTION
          ===================================================== */}

      <div className="reports-middle-grid">


        {/* =================================================
            RISK SUMMARY
            ================================================= */}

        <section className="reports-panel reports-risk-panel">

          <div className="reports-panel-header">

            <div>
              <h2>Risk Summary</h2>

              <p>
                Transaction risk distribution
              </p>
            </div>

            <button
              type="button"
              className="reports-view-button"
            >
              {dateRange}
              <span>⌄</span>
            </button>

          </div>


          <div className="reports-risk-content">

            {/* DONUT */}

            <div className="reports-donut">

              <div className="reports-donut-center">

                <strong>42.9K</strong>

                <span>
                  Transactions
                </span>

              </div>

            </div>


            {/* LEGEND */}

            <div className="reports-risk-legend">

              <div className="reports-risk-item">
                <div className="reports-risk-label">
                  <i className="reports-risk-dot high"></i>
                  <span>High Risk</span>
                </div>

                <strong>14.7%</strong>
              </div>


              <div className="reports-risk-item">
                <div className="reports-risk-label">
                  <i className="reports-risk-dot medium"></i>
                  <span>Medium Risk</span>
                </div>

                <strong>31.5%</strong>
              </div>


              <div className="reports-risk-item">
                <div className="reports-risk-label">
                  <i className="reports-risk-dot low"></i>
                  <span>Low Risk</span>
                </div>

                <strong>53.8%</strong>
              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            GENERATE REPORT
            ================================================= */}

        <section className="reports-panel reports-generate-panel">

          <div className="reports-panel-header">

            <div>
              <h2>Generate Report</h2>

              <p>
                Create a new intelligence report
              </p>
            </div>

          </div>


          <div className="reports-generate-content">


            {/* RISK INTELLIGENCE */}

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


            {/* TRANSACTION ANALYSIS */}

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


            {/* MODEL PERFORMANCE */}

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


      {/* =====================================================
          RECENT REPORTS
          ===================================================== */}

      <section className="reports-panel reports-recent-panel">

        <div className="reports-panel-header">

          <div>
            <h2>Recent Reports</h2>

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


        {/* TABLE */}

        <div className="reports-table">

          {/* TABLE HEADER */}

          <div className="reports-table-head">

            <span>Report</span>
            <span>Period</span>
            <span>Transactions</span>
            <span>Risk Level</span>
            <span>Generated</span>
            <span>Action</span>

          </div>


          {/* TABLE ROWS */}

          {reports.map((report) => (

            <div
              className="reports-table-row"
              key={report.name}
            >

              {/* REPORT NAME */}

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


              {/* PERIOD */}

              <span className="reports-period">
                {report.period}
              </span>


              {/* TRANSACTIONS */}

              <strong className="reports-transactions">
                {report.transactions}
              </strong>


              {/* RISK */}

              <span
                className={`reports-risk-badge ${report.risk.toLowerCase()}`}
              >
                {report.risk}
              </span>


              {/* GENERATED */}

              <span className="reports-generated">
                {report.generated}
              </span>


              {/* ACTION */}

              <button
                type="button"
                className="reports-download"
                title="Download report"
              >
                ↓
              </button>

            </div>

          ))}

        </div>

      </section>

    </div>
  )
}

export default Reports