function RiskMonitor() {
  return (
    <div className="risk-monitor-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">LIVE RISK ANALYSIS</p>
          <h1>Risk Monitor</h1>
          <p className="subtitle">
            Monitor transactions and identify high-risk activity in real time
          </p>
        </div>

        <div className="monitor-status">
          <span className="live-dot"></span>
          System Live
        </div>
      </div>

      <section className="monitor-stats">
        <div className="monitor-card">
          <span>Current Risk Score</span>
          <strong>82<span>/100</span></strong>
          <small className="danger-text">↑ 8.4% from yesterday</small>
        </div>

        <div className="monitor-card">
          <span>Transactions Scanned</span>
          <strong>1,389</strong>
          <small>Last 24 hours</small>
        </div>

        <div className="monitor-card">
          <span>High Risk Detected</span>
          <strong>347</strong>
          <small className="danger-text">25% of transactions</small>
        </div>

        <div className="monitor-card">
          <span>Detection Accuracy</span>
          <strong>95.1%</strong>
          <small className="safe-text">↑ 3.1% improvement</small>
        </div>
      </section>

      <section className="monitor-grid">
        <div className="panel live-analysis">
          <div className="panel-header">
            <div>
              <h2>Live Risk Analysis</h2>
              <p>Real-time transaction monitoring</p>
            </div>

            <span className="analysis-live">
              <i></i> LIVE
            </span>
          </div>

          <div className="risk-meter">
            <div className="meter-circle">
              <strong>82</strong>
              <span>HIGH RISK</span>
            </div>
          </div>

          <div className="risk-summary">
            <div>
              <span>Transaction Velocity</span>
              <strong>High</strong>
            </div>

            <div>
              <span>Location Anomaly</span>
              <strong>Detected</strong>
            </div>

            <div>
              <span>Device Trust</span>
              <strong>Medium</strong>
            </div>
          </div>
        </div>

        <div className="panel active-alerts">
          <div className="panel-header">
            <div>
              <h2>Active Risk Events</h2>
              <p>Events requiring attention</p>
            </div>

            <span className="event-count">4 Active</span>
          </div>

          <div className="risk-events">
            <div className="risk-event high-event">
              <div className="event-icon">!</div>
              <div>
                <strong>Unusual Transaction Pattern</strong>
                <span>Transaction velocity exceeded threshold</span>
                <small>2 minutes ago</small>
              </div>
              <b>HIGH</b>
            </div>

            <div className="risk-event high-event">
              <div className="event-icon">!</div>
              <div>
                <strong>Location Anomaly</strong>
                <span>Impossible travel pattern detected</span>
                <small>15 minutes ago</small>
              </div>
              <b>HIGH</b>
            </div>

            <div className="risk-event medium-event">
              <div className="event-icon">!</div>
              <div>
                <strong>Velocity Check Failed</strong>
                <span>Multiple transactions in short period</span>
                <small>32 minutes ago</small>
              </div>
              <b>MEDIUM</b>
            </div>

            <div className="risk-event medium-event">
              <div className="event-icon">!</div>
              <div>
                <strong>Device Fingerprint Change</strong>
                <span>New device detected for account</span>
                <small>1 hour ago</small>
              </div>
              <b>MEDIUM</b>
            </div>
          </div>
        </div>
      </section>

      <section className="panel transaction-stream">
        <div className="panel-header">
          <div>
            <h2>Live Transaction Stream</h2>
            <p>Latest transactions being analyzed by the model</p>
          </div>

          <button className="panel-action">View All →</button>
        </div>

        <div className="transaction-table">
          <div className="table-head">
            <span>TRANSACTION</span>
            <span>AMOUNT</span>
            <span>LOCATION</span>
            <span>RISK</span>
            <span>STATUS</span>
          </div>

          <div className="transaction-row">
            <span>#TXN-98241</span>
            <span>₹84,500</span>
            <span>Mumbai, IN</span>
            <strong className="risk-high">82</strong>
            <b className="blocked">Blocked</b>
          </div>

          <div className="transaction-row">
            <span>#TXN-98240</span>
            <span>₹12,800</span>
            <span>Pune, IN</span>
            <strong className="risk-medium">61</strong>
            <b className="review">Review</b>
          </div>

          <div className="transaction-row">
            <span>#TXN-98239</span>
            <span>₹3,250</span>
            <span>Delhi, IN</span>
            <strong className="risk-low">24</strong>
            <b className="approved">Approved</b>
          </div>

          <div className="transaction-row">
            <span>#TXN-98238</span>
            <span>₹7,900</span>
            <span>Bengaluru, IN</span>
            <strong className="risk-low">18</strong>
            <b className="approved">Approved</b>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RiskMonitor