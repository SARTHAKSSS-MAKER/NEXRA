function EcommerceReports() {

  return (
    <div className="ecommerce-page">

      <div className="page-eyebrow">
        MODEL 2 • REPORTING
      </div>

      <h1>E-Commerce Reports</h1>

      <p className="page-description">
        Review fraud detection statistics and e-commerce transaction activity.
      </p>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <span className="card-label">TOTAL TRANSACTIONS</span>
          <strong>18,642</strong>
          <small>This month</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">FRAUD CASES</span>
          <strong>326</strong>
          <small>Detected by Model 2</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">PREVENTED LOSS</span>
          <strong>₹18.4L</strong>
          <small>Estimated</small>
        </div>

      </div>

      <div className="dashboard-card wide-card">

        <h2>Detection Summary</h2>

        <div className="report-row">
          <span>Legitimate Transactions</span>
          <strong>98.25%</strong>
        </div>

        <div className="report-row">
          <span>Suspicious Transactions</span>
          <strong>1.75%</strong>
        </div>

        <div className="report-row">
          <span>Model Availability</span>
          <strong>99.9%</strong>
        </div>

      </div>

    </div>
  )
}

export default EcommerceReports