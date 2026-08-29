function EcommerceAlerts() {

  const alerts = [
    {
      id: "EC-2048",
      type: "High Risk",
      amount: "₹48,500",
      category: "Electronics",
      status: "Investigating"
    },
    {
      id: "EC-2047",
      type: "Medium Risk",
      amount: "₹12,999",
      category: "Fashion",
      status: "Review"
    },
    {
      id: "EC-2046",
      type: "High Risk",
      amount: "₹75,000",
      category: "Electronics",
      status: "Blocked"
    }
  ]

  return (
    <div className="ecommerce-page">

      <div className="page-eyebrow">
        MODEL 2 • ALERT CENTER
      </div>

      <h1>E-Commerce Alerts</h1>

      <p className="page-description">
        Monitor suspicious online shopping transactions detected by Model 2.
      </p>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <span className="card-label">ACTIVE ALERTS</span>
          <strong>12</strong>
          <small>Require attention</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">HIGH RISK</span>
          <strong>5</strong>
          <small>Critical transactions</small>
        </div>

        <div className="dashboard-card">
          <span className="card-label">BLOCKED</span>
          <strong>28</strong>
          <small>Prevented transactions</small>
        </div>

      </div>

      <div className="dashboard-card wide-card">

        <h2>Recent E-Commerce Alerts</h2>

        <div className="alert-list">

          {alerts.map((alert) => (

            <div className="alert-row" key={alert.id}>

              <div>
                <strong>{alert.id}</strong>
                <span>{alert.category}</span>
              </div>

              <div>
                <strong>{alert.amount}</strong>
                <span>{alert.type}</span>
              </div>

              <span>{alert.status}</span>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default EcommerceAlerts