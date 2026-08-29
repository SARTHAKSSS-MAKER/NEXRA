function EcommerceDashboard() {
  return (
    <div className="ecommerce-page">

      <div className="page-eyebrow">
        AI FRAUD DETECTION
      </div>

      <h1>E-Commerce Fraud Detection</h1>

      <p className="page-description">
        Monitor and analyze online shopping fraud using NEXRA Model 2.
      </p>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <span className="card-label">E-COMMERCE TRANSACTIONS</span>
          <strong>18,642</strong>
          <small>Processed this month</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">FRAUD DETECTED</span>
          <strong>326</strong>
          <small>Suspicious transactions</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">FRAUD RATE</span>
          <strong>1.75%</strong>
          <small>Current detection rate</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">MODEL ACCURACY</span>
          <strong>96.8%</strong>
          <small>Model 2 performance</small>
        </div>

      </div>

      <div className="dashboard-card wide-card">

        <h2>Model 2 Overview</h2>

        <p>
          E-Commerce Fraud Detection analyzes online shopping transactions
          using product, payment, quantity and transaction behaviour.
        </p>

        <div className="status-row">
          <span>Model Status</span>
          <b>● Online</b>
        </div>

      </div>

    </div>
  )
}

export default EcommerceDashboard