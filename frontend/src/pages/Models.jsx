function Models() {
  const models = [
    {
      name: "Transaction Risk Engine",
      type: "Fraud Detection",
      version: "v3.8.2",
      accuracy: "96.8%",
      precision: "94.2%",
      recall: "91.7%",
      status: "Production",
      updated: "2 hours ago",
    },
    {
      name: "Behavior Anomaly Model",
      type: "Anomaly Detection",
      version: "v2.4.1",
      accuracy: "93.4%",
      precision: "91.8%",
      recall: "89.6%",
      status: "Production",
      updated: "5 hours ago",
    },
    {
      name: "Device Trust Classifier",
      type: "Device Intelligence",
      version: "v1.9.4",
      accuracy: "97.2%",
      precision: "95.6%",
      recall: "93.1%",
      status: "Production",
      updated: "Yesterday",
    },
    {
      name: "Account Takeover Model",
      type: "Threat Detection",
      version: "v2.1.0",
      accuracy: "92.7%",
      precision: "90.4%",
      recall: "88.9%",
      status: "Monitoring",
      updated: "Yesterday",
    },
  ]

  return (
    <div className="page models-page">

      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">MODEL INTELLIGENCE</p>

          <h1>Models</h1>

          <p className="subtitle">
            Monitor fraud detection models and their performance
          </p>
        </div>

        <button className="model-action">
          + Deploy Model
        </button>
      </div>


      {/* MODEL OVERVIEW */}
      <section className="model-overview">

        <div className="model-stat">
          <span>Active Models</span>
          <strong>4</strong>
          <small>All systems operational</small>
        </div>

        <div className="model-stat">
          <span>Avg. Accuracy</span>
          <strong>95.0%</strong>
          <small>+1.8% this month</small>
        </div>

        <div className="model-stat">
          <span>Predictions Today</span>
          <strong>18.4K</strong>
          <small>+12.6% vs yesterday</small>
        </div>

        <div className="model-stat">
          <span>Model Health</span>
          <strong className="healthy">98.4%</strong>
          <small>Operating normally</small>
        </div>

      </section>


      {/* MODELS PANEL */}
      <section className="panel models-panel">

        <div className="panel-header">

          <div>
            <h2>Deployed Models</h2>

            <p>
              Active machine learning models powering the risk engine
            </p>
          </div>

          <button className="model-filter">
            All Models ▾
          </button>

        </div>


        {/* MODEL TABLE */}
        <div className="models-table">

          <div className="models-table-head">
            <span>Model</span>
            <span>Version</span>
            <span>Accuracy</span>
            <span>Precision</span>
            <span>Recall</span>
            <span>Status</span>
            <span>Updated</span>
          </div>


          {models.map((model) => (

            <div
              className="model-row"
              key={model.name}
            >

              {/* MODEL */}
              <div className="model-name">

                <div className="model-icon">
                  ◈
                </div>

                <div>
                  <strong>{model.name}</strong>
                  <small>{model.type}</small>
                </div>

              </div>


              {/* VERSION */}
              <span className="model-version">
                {model.version}
              </span>


              {/* ACCURACY */}
              <strong className="model-score">
                {model.accuracy}
              </strong>


              {/* PRECISION */}
              <strong className="model-score">
                {model.precision}
              </strong>


              {/* RECALL */}
              <strong className="model-score">
                {model.recall}
              </strong>


              {/* STATUS */}
              <span
                className={`model-status ${
                  model.status === "Production"
                    ? "production"
                    : "monitoring"
                }`}
              >
                <i></i>
                {model.status}
              </span>


              {/* UPDATED */}
              <span className="model-updated">
                {model.updated}
              </span>

            </div>

          ))}

        </div>

      </section>


      {/* LOWER SECTION */}
      <div className="grid-two model-lower">

        {/* PERFORMANCE */}
        <section className="panel model-performance">

          <div className="panel-header">

            <div>
              <h2>Model Performance</h2>

              <p>
                Average detection performance over time
              </p>
            </div>

            <button className="view-all">
              30 Days ▾
            </button>

          </div>


          <div className="model-chart">

            <div className="model-chart-grid">
              <span>100%</span>
              <span>95%</span>
              <span>90%</span>
              <span>85%</span>
              <span>80%</span>
            </div>

            <svg
              viewBox="0 0 500 170"
              preserveAspectRatio="none"
            >
              <path
                d="M0 125
                   C35 120, 45 105, 75 110
                   S115 90, 145 98
                   S180 78, 210 84
                   S245 62, 275 70
                   S315 55, 345 61
                   S385 42, 415 48
                   S460 30, 500 35"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M0 125
                   C35 120, 45 105, 75 110
                   S115 90, 145 98
                   S180 78, 210 84
                   S245 62, 275 70
                   S315 55, 345 61
                   S385 42, 415 48
                   S460 30, 500 35
                   L500 170
                   L0 170 Z"
                fill="rgba(166,111,52,0.08)"
                stroke="none"
              />
            </svg>

            <div className="model-chart-labels">
              <span>Aug 1</span>
              <span>Aug 8</span>
              <span>Aug 15</span>
              <span>Aug 22</span>
              <span>Aug 28</span>
            </div>

          </div>

        </section>


        {/* MODEL HEALTH */}
        <section className="panel model-health">

          <div className="panel-header">

            <div>
              <h2>Model Health</h2>

              <p>
                Current system diagnostics
              </p>
            </div>

          </div>


          <div className="health-list">

            <div className="health-item">
              <div>
                <span>Prediction Latency</span>
                <strong>42 ms</strong>
              </div>

              <div className="health-bar">
                <i style={{ width: "82%" }}></i>
              </div>
            </div>


            <div className="health-item">
              <div>
                <span>Data Quality</span>
                <strong>96.8%</strong>
              </div>

              <div className="health-bar">
                <i style={{ width: "96.8%" }}></i>
              </div>
            </div>


            <div className="health-item">
              <div>
                <span>Model Stability</span>
                <strong>98.4%</strong>
              </div>

              <div className="health-bar">
                <i style={{ width: "98.4%" }}></i>
              </div>
            </div>


            <div className="health-item">
              <div>
                <span>Drift Detection</span>
                <strong>Normal</strong>
              </div>

              <div className="health-bar">
                <i style={{ width: "91%" }}></i>
              </div>
            </div>

          </div>

        </section>

      </div>

    </div>
  )
}

export default Models