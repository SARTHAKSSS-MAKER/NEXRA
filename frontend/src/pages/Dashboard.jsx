function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* PAGE HEADER */}
      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">SECURITY OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="subtitle">
            Real-time fraud intelligence and transaction risk overview
          </p>
        </div>

        <div className="dashboard-status">
          <span className="live-dot"></span>
          System Live
        </div>
      </div>


      {/* TOP STAT CARDS */}
      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-top">
            <span>Total Transactions</span>
            <div className="stat-icon">↗</div>
          </div>

          <strong>42.9K</strong>

          <div className="stat-bottom positive">
            ↑ 12.8%
            <span>vs last month</span>
          </div>
        </div>


        <div className="dashboard-stat-card">
          <div className="stat-top">
            <span>High Risk Transactions</span>
            <div className="stat-icon danger">!</div>
          </div>

          <strong>6,284</strong>

          <div className="stat-bottom danger-text">
            ↑ 4.7%
            <span>requires attention</span>
          </div>
        </div>


        <div className="dashboard-stat-card">
          <div className="stat-top">
            <span>Detection Accuracy</span>
            <div className="stat-icon">◈</div>
          </div>

          <strong>96.8%</strong>

          <div className="stat-bottom positive">
            ↑ 2.1%
            <span>from last month</span>
          </div>
        </div>


        <div className="dashboard-stat-card">
          <div className="stat-top">
            <span>Active Alerts</span>
            <div className="stat-icon warning">!</div>
          </div>

          <strong>24</strong>

          <div className="stat-bottom warning-text">
            8 high priority
            <span>currently active</span>
          </div>
        </div>

      </section>


      {/* MAIN ANALYTICS GRID */}
      <section className="dashboard-main-grid">

        {/* TRANSACTION ACTIVITY */}
        <div className="panel dashboard-chart-panel">

          <div className="panel-header">
            <div>
              <h2>Transaction Activity</h2>
              <p>Transaction volume over the selected period</p>
            </div>

            <button className="dashboard-filter">
              Last 30 Days <span>⌄</span>
            </button>
          </div>


          <div className="activity-chart">

            <div className="chart-y-axis">
              <span>5K</span>
              <span>4K</span>
              <span>3K</span>
              <span>2K</span>
              <span>1K</span>
              <span>0</span>
            </div>


            <div className="chart-area">

              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>

              <svg
                className="activity-line"
                viewBox="0 0 700 250"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="activityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopOpacity="0.25"
                    />
                    <stop
                      offset="100%"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  className="activity-fill"
                  d="
                    M0,185
                    C35,170 55,175 80,150
                    C105,125 125,145 150,130
                    C175,115 190,135 215,105
                    C240,75 260,115 285,95
                    C310,75 325,90 350,70
                    C375,50 395,85 420,72
                    C445,60 465,90 490,65
                    C515,40 535,58 560,48
                    C585,38 610,55 635,30
                    C660,10 680,30 700,18
                    L700,250
                    L0,250
                    Z
                  "
                />

                <path
                  className="activity-path"
                  d="
                    M0,185
                    C35,170 55,175 80,150
                    C105,125 125,145 150,130
                    C175,115 190,135 215,105
                    C240,75 260,115 285,95
                    C310,75 325,90 350,70
                    C375,50 395,85 420,72
                    C445,60 465,90 490,65
                    C515,40 535,58 560,48
                    C585,38 610,55 635,30
                    C660,10 680,30 700,18
                  "
                />

              </svg>


              <div className="chart-x-axis">
                <span>Aug 01</span>
                <span>Aug 07</span>
                <span>Aug 14</span>
                <span>Aug 21</span>
                <span>Aug 28</span>
              </div>

            </div>

          </div>

        </div>


        {/* RISK DISTRIBUTION */}
        <div className="panel dashboard-risk-panel">

          <div className="panel-header">
            <div>
              <h2>Risk Distribution</h2>
              <p>Current transaction risk levels</p>
            </div>
          </div>


          <div className="dashboard-donut-wrapper">

            <div className="dashboard-donut">
              <div className="dashboard-donut-center">
                <strong>42.9K</strong>
                <span>Total</span>
              </div>
            </div>

          </div>


          <div className="dashboard-risk-legend">

            <div>
              <span>
                <i className="risk-dot high"></i>
                High Risk
              </span>
              <strong>14.7%</strong>
            </div>

            <div>
              <span>
                <i className="risk-dot medium"></i>
                Medium Risk
              </span>
              <strong>31.5%</strong>
            </div>

            <div>
              <span>
                <i className="risk-dot low"></i>
                Low Risk
              </span>
              <strong>53.8%</strong>
            </div>

          </div>

        </div>

      </section>


      {/* BOTTOM GRID */}
      <section className="dashboard-bottom-grid">

        {/* RECENT TRANSACTIONS */}
        <div className="panel dashboard-transactions">

          <div className="panel-header">
            <div>
              <h2>Recent Transactions</h2>
              <p>Latest transactions analyzed by NEXRA</p>
            </div>

            <button className="panel-action">
              View All →
            </button>
          </div>


          <div className="dashboard-transaction-list">

            <div className="dashboard-transaction-head">
              <span>TRANSACTION</span>
              <span>AMOUNT</span>
              <span>RISK</span>
              <span>STATUS</span>
            </div>


            <div className="dashboard-transaction-row">
              <span>#TXN-98241</span>
              <strong>₹84,500</strong>
              <b className="dashboard-risk-badge high">82</b>
              <span className="dashboard-status-badge blocked">
                Blocked
              </span>
            </div>


            <div className="dashboard-transaction-row">
              <span>#TXN-98240</span>
              <strong>₹12,800</strong>
              <b className="dashboard-risk-badge medium">61</b>
              <span className="dashboard-status-badge review">
                Review
              </span>
            </div>


            <div className="dashboard-transaction-row">
              <span>#TXN-98239</span>
              <strong>₹3,250</strong>
              <b className="dashboard-risk-badge low">24</b>
              <span className="dashboard-status-badge approved">
                Approved
              </span>
            </div>


            <div className="dashboard-transaction-row">
              <span>#TXN-98238</span>
              <strong>₹7,900</strong>
              <b className="dashboard-risk-badge low">18</b>
              <span className="dashboard-status-badge approved">
                Approved
              </span>
            </div>

          </div>

        </div>


        {/* ACTIVE ALERTS */}
        <div className="panel dashboard-alerts">

          <div className="panel-header">
            <div>
              <h2>Active Alerts</h2>
              <p>Security events requiring attention</p>
            </div>

            <span className="alert-count">
              8 High
            </span>
          </div>


          <div className="dashboard-alert-list">

            <div className="dashboard-alert">
              <div className="dashboard-alert-icon high">
                !
              </div>

              <div>
                <strong>Unusual transaction pattern</strong>
                <span>Transaction velocity exceeded threshold</span>
                <small>2 minutes ago</small>
              </div>
            </div>


            <div className="dashboard-alert">
              <div className="dashboard-alert-icon high">
                !
              </div>

              <div>
                <strong>Location anomaly detected</strong>
                <span>Impossible travel pattern detected</span>
                <small>15 minutes ago</small>
              </div>
            </div>


            <div className="dashboard-alert">
              <div className="dashboard-alert-icon medium">
                !
              </div>

              <div>
                <strong>Device fingerprint changed</strong>
                <span>New device detected for account</span>
                <small>32 minutes ago</small>
              </div>
            </div>


            <div className="dashboard-alert">
              <div className="dashboard-alert-icon medium">
                !
              </div>

              <div>
                <strong>Velocity check failed</strong>
                <span>Multiple transactions detected</span>
                <small>1 hour ago</small>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Dashboard