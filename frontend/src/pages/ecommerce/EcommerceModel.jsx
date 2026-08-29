function EcommerceModel() {

  return (
    <div className="ecommerce-page">

      <div className="page-eyebrow">
        MODEL 2 • AI ENGINE
      </div>

      <h1>E-Commerce Fraud Model</h1>

      <p className="page-description">
        Information and performance of the NEXRA E-Commerce Fraud Detection
        model.
      </p>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <span className="card-label">MODEL STATUS</span>
          <strong>Online</strong>
          <small>Currently active</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">ACCURACY</span>
          <strong>96.8%</strong>
          <small>Validation performance</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">PRECISION</span>
          <strong>94.2%</strong>
          <small>Fraud classification</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">RECALL</span>
          <strong>92.7%</strong>
          <small>Fraud detection</small>
        </div>

      </div>

      <div className="dashboard-card wide-card">

        <h2>Model Information</h2>

        <div className="model-info">

          <div>
            <span>Model</span>
            <strong>E-Commerce Fraud Detection</strong>
          </div>

          <div>
            <span>Version</span>
            <strong>Model 2.0</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>Active</strong>
          </div>

          <div>
            <span>Prediction Type</span>
            <strong>Fraud / Legitimate</strong>
          </div>

        </div>

      </div>

    </div>
  )
}

export default EcommerceModel