function EcommerceDashboard() {
  return (
    <div className="ecom-dashboard">

      {/* ================= HEADER ================= */}

      <div className="ecom-dashboard-header">

        <div className="ecom-eyebrow">
          AI FRAUD DETECTION
        </div>

        <h1 className="ecom-dashboard-title">
          E-Commerce Fraud Detection
        </h1>

        <p className="ecom-dashboard-subtitle">
          Monitor and analyze online shopping fraud using NEXRA Model 2.
        </p>

      </div>


      {/* ================= KPI CARDS ================= */}

      <div className="ecom-kpi-grid">

        {/* Transactions */}

        <div className="ecom-kpi-card">

          <div className="ecom-kpi-top">

            <div className="ecom-kpi-label">
              E-Commerce
              <br />
              Transactions
            </div>

            <div className="ecom-kpi-icon">
              ↗
            </div>

          </div>

          <div className="ecom-kpi-value">
            18,642
          </div>

          <div className="ecom-kpi-change positive">
            ↑ 8.4%
            <span>vs last month</span>
          </div>

        </div>


        {/* Fraud */}

        <div className="ecom-kpi-card">

          <div className="ecom-kpi-top">

            <div className="ecom-kpi-label">
              Fraud
              <br />
              Detected
            </div>

            <div className="ecom-kpi-icon">
              !
            </div>

          </div>

          <div className="ecom-kpi-value">
            326
          </div>

          <div className="ecom-kpi-change negative">
            ↑ 3.2%
            <span>requires attention</span>
          </div>

        </div>


        {/* Fraud Rate */}

        <div className="ecom-kpi-card">

          <div className="ecom-kpi-top">

            <div className="ecom-kpi-label">
              Fraud
              <br />
              Rate
            </div>

            <div className="ecom-kpi-icon">
              ◆
            </div>

          </div>

          <div className="ecom-kpi-value">
            1.75%
          </div>

          <div className="ecom-kpi-change positive">
            ↓ 0.4%
            <span>from last month</span>
          </div>

        </div>


        {/* Accuracy */}

        <div className="ecom-kpi-card">

          <div className="ecom-kpi-top">

            <div className="ecom-kpi-label">
              Model
              <br />
              Accuracy
            </div>

            <div className="ecom-kpi-icon">
              ✓
            </div>

          </div>

          <div className="ecom-kpi-value">
            96.8%
          </div>

          <div className="ecom-kpi-change positive">
            ↑ 2.1%
            <span>validation performance</span>
          </div>

        </div>

      </div>


      {/* ================= MAIN PANELS ================= */}

      <div className="ecom-panel-grid">


        {/* ================= ACTIVITY ================= */}

        <div className="ecom-panel">

          <div className="ecom-panel-header">

            <div>

              <h2 className="ecom-panel-title">
                E-Commerce Activity
              </h2>

              <p className="ecom-panel-description">
                Transaction volume over the selected period
              </p>

            </div>

            <select className="ecom-panel-select" defaultValue="30">

              <option value="7">
                Last 7 Days
              </option>

              <option value="30">
                Last 30 Days
              </option>

              <option value="90">
                Last 90 Days
              </option>

            </select>

          </div>


          {/* Simple activity visualization */}

          <div className="ecom-chart">

            <div className="ecom-chart-grid">

              <div className="ecom-chart-line"></div>
              <div className="ecom-chart-line"></div>
              <div className="ecom-chart-line"></div>
              <div className="ecom-chart-line"></div>
              <div className="ecom-chart-line"></div>

            </div>


            <div className="ecom-chart-bars">

              <div
                className="ecom-chart-bar"
                style={{ height: "42%" }}
              ></div>

              <div
                className="ecom-chart-bar"
                style={{ height: "58%" }}
              ></div>

              <div
                className="ecom-chart-bar"
                style={{ height: "48%" }}
              ></div>

              <div
                className="ecom-chart-bar"
                style={{ height: "72%" }}
              ></div>

              <div
                className="ecom-chart-bar"
                style={{ height: "64%" }}
              ></div>

              <div
                className="ecom-chart-bar"
                style={{ height: "82%" }}
              ></div>

              <div
                className="ecom-chart-bar"
                style={{ height: "70%" }}
              ></div>

            </div>


            <div className="ecom-chart-labels">

              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>

            </div>

          </div>

        </div>


        {/* ================= FRAUD DISTRIBUTION ================= */}

        <div className="ecom-panel">

          <div className="ecom-panel-header">

            <div>

              <h2 className="ecom-panel-title">
                Fraud Distribution
              </h2>

              <p className="ecom-panel-description">
                Current e-commerce transaction risk levels
              </p>

            </div>

          </div>


          <div className="ecom-distribution">

            <div className="ecom-donut">

              <div className="ecom-donut-center">

                <span className="ecom-donut-value">
                  1.75%
                </span>

                <span className="ecom-donut-label">
                  Fraud Rate
                </span>

              </div>

            </div>


            <div className="ecom-legend">

              <div className="ecom-legend-item">

                <span className="ecom-legend-dot"></span>

                <span className="ecom-legend-text">
                  Low Risk
                </span>

                <span className="ecom-legend-value">
                  82%
                </span>

              </div>


              <div className="ecom-legend-item">

                <span className="ecom-legend-dot red"></span>

                <span className="ecom-legend-text">
                  High Risk
                </span>

                <span className="ecom-legend-value">
                  18%
                </span>

              </div>


              <div className="ecom-legend-item">

                <span className="ecom-legend-dot gray"></span>

                <span className="ecom-legend-text">
                  Review
                </span>

                <span className="ecom-legend-value">
                  6%
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================= SECONDARY STATISTICS ================= */}

      <div className="ecom-stat-row">


        <div className="ecom-stat-box">

          <div className="ecom-stat-label">
            Orders Screened
          </div>

          <div className="ecom-stat-value">
            18,642
          </div>

        </div>


        <div className="ecom-stat-box">

          <div className="ecom-stat-label">
            Suspicious Orders
          </div>

          <div className="ecom-stat-value">
            <span className="ecom-stat-accent">
              326
            </span>
          </div>

        </div>


        <div className="ecom-stat-box">

          <div className="ecom-stat-label">
            Model Availability
          </div>

          <div className="ecom-stat-value">
            99.9%
          </div>

        </div>


      </div>

    </div>
  )
}

export default EcommerceDashboard