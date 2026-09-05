import { useEffect, useMemo, useState } from "react"
import { getModels, getEvaluation } from "../api"

function Models() {
  const [modelsData, setModelsData] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      getModels(),
      getEvaluation(),
    ])
      .then(([modelData, evaluationData]) => {
        setModelsData(modelData)
        setEvaluation(evaluationData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Models API error:", err)
        setError("Unable to connect to NEXRA backend")
        setLoading(false)
      })
  }, [])

  const fraudModel = useMemo(() => {
    const backendModels = Array.isArray(modelsData)
      ? modelsData
      : modelsData?.models || []

    const realModel =
      backendModels.find(
        (model) =>
          model.name === "Fraud Detection Model"
      ) || {}

    return {
      id: realModel.id || "MOD-001",

      name: "Fraud Detection Model",

      type: "Financial Transaction Fraud",

      version:
        realModel.version ||
        "Financial Fraud Detection v1.0",

      accuracy:
        evaluation?.accuracy != null
          ? evaluation.accuracy * 100
          : 0,

      precision:
        evaluation?.precision != null
          ? evaluation.precision * 100
          : 0,

      recall:
        evaluation?.recall != null
          ? evaluation.recall * 100
          : 0,

      f1:
        evaluation?.f1_score != null
          ? evaluation.f1_score * 100
          : 0,

      status:
        realModel.status || "Production",

      testSamples:
        Number(evaluation?.test_samples || 0),
    }
  }, [modelsData, evaluation])

  const predictionsToday = Number(
    modelsData?.predictions_today || 0
  )

  const modelReady =
    evaluation !== null &&
    evaluation.test_samples > 0

  const falsePositives = Number(
    evaluation?.false_positive || 0
  )

  const falseNegatives = Number(
    evaluation?.false_negative || 0
  )

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
          Loading NEXRA model intelligence...
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

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            MODEL INTELLIGENCE
          </p>

          <h1>
            Models
          </h1>

          <p className="subtitle">
            Monitor the financial fraud detection model and its performance
          </p>

        </div>

        <span
          className="model-action"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Model 1 Active
        </span>

      </div>


      <section className="model-overview">

        <div className="model-stat">

          <span>
            Active Models
          </span>

          <strong>
            1
          </strong>

          <small>
            Financial fraud model
          </small>

        </div>


        <div className="model-stat">

          <span>
            Model Accuracy
          </span>

          <strong>
            {fraudModel.accuracy.toFixed(1)}%
          </strong>

          <small>
            Held-out test performance
          </small>

        </div>


        <div className="model-stat">

          <span>
            Predictions Today
          </span>

          <strong>
            {predictionsToday.toLocaleString("en-IN")}
          </strong>

          <small>
            Processed by risk engine
          </small>

        </div>


        <div className="model-stat">

          <span>
            Model Status
          </span>

          <strong
            className="healthy"
            style={{
              fontSize: "24px",
            }}
          >
            {modelReady ? "READY" : "OFFLINE"}
          </strong>

          <small>
            {modelReady
              ? "Evaluation verified"
              : "Evaluation unavailable"}
          </small>

        </div>

      </section>


      <section className="panel models-panel">

        <div className="panel-header">

          <div>

            <h2>
              Deployed Model
            </h2>

            <p>
              Active machine learning model powering the financial risk engine
            </p>

          </div>

          <span
            className="model-filter"
            style={{
              cursor: "default",
            }}
          >
            Financial Fraud ▾
          </span>

        </div>


        <div className="models-table">

          <div className="models-table-head">

            <span>
              Model
            </span>

            <span>
              Version
            </span>

            <span>
              Accuracy
            </span>

            <span>
              Precision
            </span>

            <span>
              Recall
            </span>

            <span>
              Status
            </span>

            <span>
              Test Set
            </span>

          </div>


          <div className="model-row">

            <div className="model-name">

              <div className="model-icon">
                ◈
              </div>

              <div>

                <strong>
                  {fraudModel.name}
                </strong>

                <small>
                  {fraudModel.type}
                </small>

              </div>

            </div>


            <span className="model-version">
              {fraudModel.version}
            </span>


            <strong className="model-score">
              {fraudModel.accuracy.toFixed(1)}%
            </strong>


            <strong className="model-score">
              {fraudModel.precision.toFixed(1)}%
            </strong>


            <strong className="model-score">
              {fraudModel.recall.toFixed(1)}%
            </strong>


            <span className="model-status production">

              <i></i>

              Production

            </span>


            <span className="model-updated">

              {fraudModel.testSamples.toLocaleString(
                "en-IN"
              )}

            </span>

          </div>

        </div>

      </section>


      <div className="grid-two model-lower">


        <section className="panel model-performance">

          <div className="panel-header">

            <div>

              <h2>
                Held-out Evaluation
              </h2>

              <p>
                Actual performance on unseen test data
              </p>

            </div>

            <span
              className="view-all"
              style={{
                cursor: "default",
              }}
            >
              {fraudModel.testSamples.toLocaleString(
                "en-IN"
              )} Samples
            </span>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: "18px",
              padding: "25px",
            }}
          >

            <div
              className="model-stat"
              style={{
                minHeight: "120px",
              }}
            >

              <span>
                Accuracy
              </span>

              <strong>
                {fraudModel.accuracy.toFixed(1)}%
              </strong>

              <small>
                Overall predictions
              </small>

            </div>


            <div
              className="model-stat"
              style={{
                minHeight: "120px",
              }}
            >

              <span>
                Precision
              </span>

              <strong>
                {fraudModel.precision.toFixed(1)}%
              </strong>

              <small>
                Fraud prediction precision
              </small>

            </div>


            <div
              className="model-stat"
              style={{
                minHeight: "120px",
              }}
            >

              <span>
                Fraud Recall
              </span>

              <strong>
                {fraudModel.recall.toFixed(1)}%
              </strong>

              <small>
                Fraud cases detected
              </small>

            </div>


            <div
              className="model-stat"
              style={{
                minHeight: "120px",
              }}
            >

              <span>
                F1 Score
              </span>

              <strong>
                {fraudModel.f1.toFixed(1)}%
              </strong>

              <small>
                Precision-recall balance
              </small>

            </div>

          </div>

        </section>


        <section className="panel model-health">

          <div className="panel-header">

            <div>

              <h2>
                Model Diagnostics
              </h2>

              <p>
                Current evaluation and system status
              </p>

            </div>

          </div>


          <div className="health-list">


            <div className="health-item">

              <div>

                <span>
                  Model Availability
                </span>

                <strong>
                  {modelReady
                    ? "Ready"
                    : "Unavailable"}
                </strong>

              </div>

              <div className="health-bar">

                <i
                  style={{
                    width: modelReady
                      ? "100%"
                      : "0%",
                  }}
                ></i>

              </div>

            </div>


            <div className="health-item">

              <div>

                <span>
                  Evaluation Coverage
                </span>

                <strong>
                  {fraudModel.testSamples.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div className="health-bar">

                <i
                  style={{
                    width: "100%",
                  }}
                ></i>

              </div>

            </div>


            <div className="health-item">

              <div>

                <span>
                  False Positives
                </span>

                <strong>
                  {falsePositives.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div className="health-bar">

                <i
                  style={{
                    width: `${Math.min(
                      (falsePositives /
                        Math.max(
                          fraudModel.testSamples,
                          1
                        )) *
                        100,
                      100
                    )}%`,
                  }}
                ></i>

              </div>

            </div>


            <div className="health-item">

              <div>

                <span>
                  False Negatives
                </span>

                <strong>
                  {falseNegatives.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div className="health-bar">

                <i
                  style={{
                    width: `${Math.min(
                      (falseNegatives /
                        Math.max(
                          fraudModel.testSamples,
                          1
                        )) *
                        100,
                      100
                    )}%`,
                  }}
                ></i>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  )
}

export default Models