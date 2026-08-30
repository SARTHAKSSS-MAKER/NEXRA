import { useEffect, useMemo, useState } from "react"
import { getModels } from "../api"

function Models() {
  const [models, setModels] = useState([])
  const [predictionsToday, setPredictionsToday] = useState(0)
  const [filter, setFilter] = useState("All Models")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getModels()
      .then((data) => {
        // Supports either:
        // /api/models -> [...]
        // /api/models -> { models: [...] }
        const modelData = Array.isArray(data)
          ? data
          : data.models || data.data || []

        setModels(modelData)
        setPredictionsToday(Array.isArray(data)
        ? 0
        :
        Number(data.predictions_today || 0))
        setLoading(false)
      })
      .catch((err) => {
        console.error("Models API error:", err)
        setError("Unable to connect to NEXRA backend")
        setLoading(false)
      })
  }, [])

  const normalizedModels = useMemo(() => {
    return models.map((model, index) => ({
      id: model.id || model.name || `model-${index}`,

      name:
        model.name ||
        model.model_name ||
        "Unknown Model",

      type:
        model.type ||
        model.model_type ||
        "Fraud Detection",

      version:
        model.version ||
        model.model_version ||
        "v1.0.0",

      accuracy: Number(
        model.accuracy ??
        model.accuracy_score ??
        0
      ),

      precision: Number(
        model.precision ??
        model.precision_score ??
        0
      ),

      recall: Number(
        model.recall ??
        model.recall_score ??
        0
      ),

      status:
        model.status ||
        "Production",

      updated:
        model.updated ||
        model.updated_at ||
        "Recently",

      health: Number(
        model.health ??
        model.stability ??
        98
      ),

      latency: Number(
        model.latency ??
        model.prediction_latency ??
        42
      ),
    }))
  }, [models])

  const filteredModels =
    filter === "All Models"
      ? normalizedModels
      : normalizedModels.filter(
          (model) => model.status === filter
        )

  const activeModels = normalizedModels.filter(
    (model) =>
      model.status === "Production" ||
      model.status === "Monitoring"
  ).length

  const averageAccuracy =
    normalizedModels.length > 0
      ? (
          normalizedModels.reduce(
            (sum, model) => sum + model.accuracy,
            0
          ) / normalizedModels.length
        ).toFixed(1)
      : "0.0"

  const averageHealth =
    normalizedModels.length > 0
      ? (
          normalizedModels.reduce(
            (sum, model) => sum + model.health,
            0
          ) / normalizedModels.length
        ).toFixed(1)
      : "0.0"

  if (loading) {
    return (
      <div className="page models-page">
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Loading NEXRA models...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page models-page">
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#ff6b6b",
          }}
        >
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="page models-page">

      {/* PAGE HEADING */}
      <div className="page-heading">

        <div>
          <p className="eyebrow">
            MODEL INTELLIGENCE
          </p>

          <h1>Models</h1>

          <p className="subtitle">
            Monitor fraud detection models and their performance
          </p>
        </div>

        <button
          className="model-action"
          type="button"
        >
          + Deploy Model
        </button>

      </div>


      {/* MODEL OVERVIEW */}
      <section className="model-overview">

        <div className="model-stat">

          <span>Active Models</span>

          <strong>
            {activeModels}
          </strong>

          <small>
            All systems operational
          </small>

        </div>


        <div className="model-stat">

          <span>Avg. Accuracy</span>

          <strong>
            {averageAccuracy}%
          </strong>

          <small>
            Across deployed models
          </small>

        </div>


        <div className="model-stat">

          <span>Predictions Today</span>

          <strong>
            {predictionsToday.toLocaleString("en-IN")}
          </strong>

          <small>
            Processed by risk engine
          </small>

        </div>


        <div className="model-stat">

          <span>Model Health</span>

          <strong className="healthy">
            {averageHealth}%
          </strong>

          <small>
            Operating normally
          </small>

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


          {/* FILTER */}
          <button
            type="button"
            className="model-filter"
            onClick={() => {
              if (filter === "All Models") {
                setFilter("Production")
              } else if (filter === "Production") {
                setFilter("Monitoring")
              } else {
                setFilter("All Models")
              }
            }}
          >
            {filter} ▾
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


          {filteredModels.length === 0 ? (

            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#888",
              }}
            >
              No models available.
            </div>

          ) : (

            filteredModels.map((model) => (

              <div
                className="model-row"
                key={model.id}
              >

                {/* MODEL */}
                <div className="model-name">

                  <div className="model-icon">
                    ◈
                  </div>

                  <div>

                    <strong>
                      {model.name}
                    </strong>

                    <small>
                      {model.type}
                    </small>

                  </div>

                </div>


                {/* VERSION */}
                <span className="model-version">
                  {model.version}
                </span>


                {/* ACCURACY */}
                <strong className="model-score">
                  {model.accuracy
                    ? `${model.accuracy}%`
                    : "—"}
                </strong>


                {/* PRECISION */}
                <strong className="model-score">
                  {model.precision
                    ? `${model.precision}%`
                    : "—"}
                </strong>


                {/* RECALL */}
                <strong className="model-score">
                  {model.recall
                    ? `${model.recall}%`
                    : "—"}
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

            ))

          )}

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

            <button
              type="button"
              className="view-all"
            >
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
                d="
                  M0 125
                  C35 120, 45 105, 75 110
                  S115 90, 145 98
                  S180 78, 210 84
                  S245 62, 275 70
                  S315 55, 345 61
                  S385 42, 415 48
                  S460 30, 500 35
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />


              <path
                d="
                  M0 125
                  C35 120, 45 105, 75 110
                  S115 90, 145 98
                  S180 78, 210 84
                  S245 62, 275 70
                  S315 55, 345 61
                  S385 42, 415 48
                  S460 30, 500 35
                  L500 170
                  L0 170
                  Z
                "
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


            {/* LATENCY */}
            <div className="health-item">

              <div>
                <span>
                  Prediction Latency
                </span>

                <strong>
                  {normalizedModels.length
                    ? `${Math.round(
                        normalizedModels.reduce(
                          (sum, model) =>
                            sum + model.latency,
                          0
                        ) / normalizedModels.length
                      )} ms`
                    : "—"}
                </strong>
              </div>

              <div className="health-bar">
                <i style={{ width: "82%" }}></i>
              </div>

            </div>


            {/* DATA QUALITY */}
            <div className="health-item">

              <div>
                <span>
                  Data Quality
                </span>

                <strong>
                  {averageAccuracy}%
                </strong>
              </div>

              <div className="health-bar">
                <i
                  style={{
                    width: `${Math.min(
                      Number(averageAccuracy),
                      100
                    )}%`,
                  }}
                ></i>
              </div>

            </div>


            {/* MODEL STABILITY */}
            <div className="health-item">

              <div>
                <span>
                  Model Stability
                </span>

                <strong>
                  {averageHealth}%
                </strong>
              </div>

              <div className="health-bar">
                <i
                  style={{
                    width: `${Math.min(
                      Number(averageHealth),
                      100
                    )}%`,
                  }}
                ></i>
              </div>

            </div>


            {/* DRIFT */}
            <div className="health-item">

              <div>
                <span>
                  Drift Detection
                </span>

                <strong>
                  Normal
                </strong>
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