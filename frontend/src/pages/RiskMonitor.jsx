function RiskMonitor() {
  return (
    <div className="risk-monitor-page">

      {/* PAGE HEADER */}
      <div className="risk-monitor-heading">
        <div>
          <p className="risk-monitor-eyebrow">LIVE RISK ANALYSIS</p>

          <h1>Risk Monitor</h1>

          <p className="risk-monitor-subtitle">
            Monitor transactions and identify high-risk activity in real time
          </p>
        </div>

        <div className="risk-monitor-status">
          <span className="risk-live-dot"></span>
          <span>System Live</span>
        </div>
      </div>


      {/* STAT CARDS */}
      <section className="risk-monitor-stats">

        <div className="risk-stat-card">
          <span className="risk-stat-label">Current Risk Score</span>

          <strong className="risk-stat-value">
            82<span>/100</span>
          </strong>

          <small className="risk-danger-text">
            ↑ 8.4% from yesterday
          </small>
        </div>


        <div className="risk-stat-card">
          <span className="risk-stat-label">Transactions Scanned</span>

          <strong className="risk-stat-value">
            1,389
          </strong>

          <small>Last 24 hours</small>
        </div>


        <div className="risk-stat-card">
          <span className="risk-stat-label">High Risk Detected</span>

          <strong className="risk-stat-value">
            347
          </strong>

          <small className="risk-danger-text">
            25% of transactions
          </small>
        </div>


        <div className="risk-stat-card">
          <span className="risk-stat-label">Detection Accuracy</span>

          <strong className="risk-stat-value risk-positive">
            95.1%
          </strong>

          <small className="risk-safe-text">
            ↑ 3.1% improvement
          </small>
        </div>

      </section>


      {/* LIVE ANALYSIS + ACTIVE EVENTS */}
      <section className="risk-monitor-main-grid">


        {/* LIVE RISK ANALYSIS */}
        <div className="risk-monitor-panel">

          <div className="risk-monitor-panel-header">

            <div>
              <h2>Live Risk Analysis</h2>

              <p>
                Real-time transaction monitoring
              </p>
            </div>

            <span className="risk-analysis-live">
              <i></i>
              LIVE
            </span>

          </div>


          {/* RISK METER */}
          <div className="risk-meter-wrapper">

            <div className="risk-meter-circle">

              <div className="risk-meter-inner">
                <strong>82</strong>
                <span>HIGH RISK</span>
              </div>

            </div>

          </div>


          {/* RISK FACTORS */}
          <div className="risk-factor-list">

            <div className="risk-factor">
              <div>
                <span>Transaction Velocity</span>
                <small>Activity frequency</small>
              </div>

              <strong className="factor-high">
                High
              </strong>
            </div>


            <div className="risk-factor">
              <div>
                <span>Location Anomaly</span>
                <small>Geographic behaviour</small>
              </div>

              <strong className="factor-danger">
                Detected
              </strong>
            </div>


            <div className="risk-factor">
              <div>
                <span>Device Trust</span>
                <small>Device reputation</small>
              </div>

              <strong className="factor-medium">
                Medium
              </strong>
            </div>

          </div>

        </div>


        {/* ACTIVE RISK EVENTS */}
        <div className="risk-monitor-panel">

          <div className="risk-monitor-panel-header">

            <div>
              <h2>Active Risk Events</h2>

              <p>
                Events requiring attention
              </p>
            </div>

            <span className="risk-event-count">
              4 Active
            </span>

          </div>


          <div className="risk-event-list">


            {/* EVENT 1 */}
            <div className="risk-event-card">

              <div className="risk-event-icon high">
                !
              </div>

              <div className="risk-event-info">
                <strong>
                  Unusual Transaction Pattern
                </strong>

                <span>
                  Transaction velocity exceeded threshold
                </span>

                <small>
                  2 minutes ago
                </small>
              </div>

              <b className="risk-event-level high">
                HIGH
              </b>

            </div>


            {/* EVENT 2 */}
            <div className="risk-event-card">

              <div className="risk-event-icon high">
                !
              </div>

              <div className="risk-event-info">
                <strong>
                  Location Anomaly
                </strong>

                <span>
                  Impossible travel pattern detected
                </span>

                <small>
                  15 minutes ago
                </small>
              </div>

              <b className="risk-event-level high">
                HIGH
              </b>

            </div>


            {/* EVENT 3 */}
            <div className="risk-event-card">

              <div className="risk-event-icon medium">
                !
              </div>

              <div className="risk-event-info">
                <strong>
                  Velocity Check Failed
                </strong>

                <span>
                  Multiple transactions in short period
                </span>

                <small>
                  32 minutes ago
                </small>
              </div>

              <b className="risk-event-level medium">
                MEDIUM
              </b>

            </div>


            {/* EVENT 4 */}
            <div className="risk-event-card">

              <div className="risk-event-icon medium">
                !
              </div>

              <div className="risk-event-info">
                <strong>
                  Device Fingerprint Change
                </strong>

                <span>
                  New device detected for account
                </span>

                <small>
                  1 hour ago
                </small>
              </div>

              <b className="risk-event-level medium">
                MEDIUM
              </b>

            </div>

          </div>

        </div>

      </section>


      {/* TRANSACTION STREAM */}
      <section className="risk-monitor-panel transaction-stream-panel">

        <div className="risk-monitor-panel-header">

          <div>
            <h2>Live Transaction Stream</h2>

            <p>
              Latest transactions being analyzed by the model
            </p>
          </div>

          <button className="risk-panel-action">
            View All →
          </button>

        </div>


        <div className="risk-transaction-table">

          {/* TABLE HEADER */}
          <div className="risk-transaction-head">

            <span>TRANSACTION</span>
            <span>AMOUNT</span>
            <span>LOCATION</span>
            <span>RISK</span>
            <span>STATUS</span>

          </div>


          {/* ROW 1 */}
          <div className="risk-transaction-row">

            <span className="transaction-id">
              #TXN-98241
            </span>

            <span>
              ₹84,500
            </span>

            <span>
              Mumbai, IN
            </span>

            <strong className="transaction-risk high">
              82
            </strong>

            <b className="transaction-status blocked">
              Blocked
            </b>

          </div>


          {/* ROW 2 */}
          <div className="risk-transaction-row">

            <span className="transaction-id">
              #TXN-98240
            </span>

            <span>
              ₹12,800
            </span>

            <span>
              Pune, IN
            </span>

            <strong className="transaction-risk medium">
              61
            </strong>

            <b className="transaction-status review">
              Review
            </b>

          </div>


          {/* ROW 3 */}
          <div className="risk-transaction-row">

            <span className="transaction-id">
              #TXN-98239
            </span>

            <span>
              ₹3,250
            </span>

            <span>
              Delhi, IN
            </span>

            <strong className="transaction-risk low">
              24
            </strong>

            <b className="transaction-status approved">
              Approved
            </b>

          </div>


          {/* ROW 4 */}
          <div className="risk-transaction-row">

            <span className="transaction-id">
              #TXN-98238
            </span>

            <span>
              ₹7,900
            </span>

            <span>
              Bengaluru, IN
            </span>

            <strong className="transaction-risk low">
              18
            </strong>

            <b className="transaction-status approved">
              Approved
            </b>

          </div>

        </div>

      </section>

    </div>
  )
}

export default RiskMonitor