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

      {/* PAGE HEADING */}
      <div className="page-heading">

        <div>
          <p className="eyebrow">ANALYTICS & REPORTING</p>

          <h1>Reports</h1>

          <p className="subtitle">
            Generate and review fraud intelligence reports
          </p>
        </div>


        {/* DATE SELECTOR */}
        <div className="report-date-wrapper">

          <button
            type="button"
            className="date-selector"
            onClick={() => setShowDateMenu((prev) => !prev)}
          >
            <span>{dateRange}</span>

            <span
              className={`date-arrow ${
                showDateMenu ? "open" : ""
              }`}
            >
              ⌄
            </span>
          </button>


          {showDateMenu && (
            <div className="report-date-dropdown">

              {dateOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`report-date-option ${
                    dateRange === option ? "active" : ""
                  }`}
                  onClick={() => {
                    setDateRange(option)
                    setShowDateMenu(false)
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


      {/* REPORT OVERVIEW */}
      <section className="report-overview">

        <div className="report-stat">
          <span>Reports Generated</span>
          <strong>128</strong>
          <small>+18.4% this month</small>
        </div>

        <div className="report-stat">
          <span>Transactions Analyzed</span>
          <strong>42.9K</strong>
          <small>Across all risk models</small>
        </div>

        <div className="report-stat">
          <span>High Risk Detected</span>
          <strong>6,284</strong>
          <small>14.7% of transactions</small>
        </div>

        <div className="report-stat">
          <span>Detection Rate</span>
          <strong className="positive">96.8%</strong>
          <small>+2.1% from last month</small>
        </div>

      </section>


      {/* RISK SUMMARY + QUICK REPORT */}
      <div className="grid-two report-middle">

        {/* RISK SUMMARY */}
        <section className="panel risk-summary-panel">

          <div className="panel-header">

            <div>
              <h2>Risk Summary</h2>

              <p>
                Transaction risk distribution
              </p>
            </div>

            <button className="view-all">
              {dateRange} ▾
            </button>

          </div>


          <div className="risk-summary-body">

            <div className="report-donut">

              <div className="report-donut-center">
                <strong>42.9K</strong>
                <span>Transactions</span>
              </div>

            </div>


            <div className="report-legend">

              <div>
                <i className="high"></i>
                <span>High Risk</span>
                <strong>14.7%</strong>
              </div>

              <div>
                <i className="medium"></i>
                <span>Medium Risk</span>
                <strong>31.5%</strong>
              </div>

              <div>
                <i className="low"></i>
                <span>Low Risk</span>
                <strong>53.8%</strong>
              </div>

            </div>

          </div>

        </section>


        {/* QUICK GENERATE */}
        <section className="panel generate-panel">

          <div className="panel-header">

            <div>
              <h2>Generate Report</h2>

              <p>
                Create a new intelligence report
              </p>
            </div>

          </div>


          <div className="generate-content">

            <button className="generate-option">
              <div className="generate-icon">◈</div>

              <div>
                <strong>Risk Intelligence</strong>
                <span>Complete risk overview</span>
              </div>

              <b>→</b>
            </button>


            <button className="generate-option">
              <div className="generate-icon">◫</div>

              <div>
                <strong>Transaction Analysis</strong>
                <span>Detailed transaction activity</span>
              </div>

              <b>→</b>
            </button>


            <button className="generate-option">
              <div className="generate-icon">◇</div>

              <div>
                <strong>Model Performance</strong>
                <span>AI model evaluation</span>
              </div>

              <b>→</b>
            </button>

          </div>

        </section>

      </div>


      {/* RECENT REPORTS */}
      <section className="panel recent-reports-panel">

        <div className="panel-header">

          <div>
            <h2>Recent Reports</h2>

            <p>
              Previously generated intelligence reports
            </p>
          </div>

          <button className="view-all">
            View Archive →
          </button>

        </div>


        <div className="reports-table">

          <div className="reports-table-head">
            <span>Report</span>
            <span>Period</span>
            <span>Transactions</span>
            <span>Risk Level</span>
            <span>Generated</span>
            <span>Action</span>
          </div>


          {reports.map((report) => (

            <div
              className="report-row"
              key={report.name}
            >

              {/* REPORT */}
              <div className="report-name">

                <div className="report-file-icon">
                  ▤
                </div>

                <div>
                  <strong>{report.name}</strong>
                  <small>{report.type}</small>
                </div>

              </div>


              {/* PERIOD */}
              <span className="report-period">
                {report.period}
              </span>


              {/* TRANSACTIONS */}
              <strong className="report-transactions">
                {report.transactions}
              </strong>


              {/* RISK */}
              <span
                className={`report-risk ${report.risk.toLowerCase()}`}
              >
                {report.risk}
              </span>


              {/* GENERATED */}
              <span className="report-generated">
                {report.generated}
              </span>


              {/* ACTION */}
              <button className="report-download">
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