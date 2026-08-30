import { useState } from "react"
import { predictFraud } from "../../api"

function EcommerceAnalysis() {

  const [amount, setAmount] = useState("")
  const [quantity, setQuantity] = useState("")
  const [category, setCategory] = useState("")
  const [payment, setPayment] = useState("")

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeTransaction = async () => {

    if (!amount || !quantity || !category || !payment) {
      setResult({
        type: "error",
        message: "Please enter all transaction details."
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {

      /*
       * Model 2 currently expects:
       *
       * Time + V1...V28 + Amount = 30 features
       *
       * The current UI provides e-commerce fields,
       * so we create a temporary feature vector
       * for testing the complete React → FastAPI → ML flow.
       */

      const categoryCode = {
        "Electronics": 1,
        "Fashion": 2,
        "Grocery": 3,
        "Home & Furniture": 4,
        "Beauty": 5,
        "Other": 6,
      }[category] || 0

      const paymentCode = {
        "Credit Card": 1,
        "Debit Card": 2,
        "UPI": 3,
        "Net Banking": 4,
        "Wallet": 5,
      }[payment] || 0

      const numericAmount = Number(amount)
      const numericQuantity = Number(quantity)

      /*
       * 30 features
       *
       * Time
       * V1 - V28
       * Amount
       */

      const features = [
        0,                  // Time
        numericQuantity,    // V1
        categoryCode,       // V2
        paymentCode,        // V3
        numericAmount,      // V4

        0,                  // V5
        0,                  // V6
        0,                  // V7
        0,                  // V8
        0,                  // V9
        0,                  // V10
        0,                  // V11
        0,                  // V12
        0,                  // V13
        0,                  // V14
        0,                  // V15
        0,                  // V16
        0,                  // V17
        0,                  // V18
        0,                  // V19
        0,                  // V20
        0,                  // V21
        0,                  // V22
        0,                  // V23
        0,                  // V24
        0,                  // V25
        0,                  // V26
        0,                  // V27
        0,                  // V28

        numericAmount       // Amount
      ]

      const data = await predictFraud(features)

      setResult({
        type: data.fraud ? "danger" : "safe",
        message: data.fraud
          ? "Potential fraudulent transaction detected."
          : "Transaction appears legitimate.",
        ...data,
      })

    } catch (error) {

      console.error("Prediction API error:", error)

      setResult({
        type: "error",
        message: "Unable to connect to the NEXRA ML backend."
      })

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ecommerce-page">

      <div className="page-eyebrow">
        MODEL 2 • E-COMMERCE
      </div>

      <h1>Transaction Analysis</h1>

      <p className="page-description">
        Analyze an online shopping transaction using the NEXRA E-Commerce
        Fraud Detection model.
      </p>

      <div className="analysis-grid">

        {/* INPUT PANEL */}

        <div className="dashboard-card">

          <h2>Transaction Details</h2>

          <p className="card-subtitle">
            Enter e-commerce transaction information
          </p>

          <div className="form-grid">

            <div>
              <label>Transaction Amount</label>

              <input
                type="number"
                placeholder="₹ 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label>Product Quantity</label>

              <input
                type="number"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label>Product Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Grocery</option>
                <option>Home & Furniture</option>
                <option>Beauty</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label>Payment Method</label>

              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="">Select payment method</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>UPI</option>
                <option>Net Banking</option>
                <option>Wallet</option>
              </select>
            </div>

          </div>

          <button
            className="primary-button"
            onClick={analyzeTransaction}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Transaction"}
          </button>

        </div>


        {/* RESULT PANEL */}

        <div className="dashboard-card">

          <h2>Fraud Intelligence</h2>

          <p className="card-subtitle">
            AI prediction generated by Model 2
          </p>

          {!result && (
            <div className="empty-result">

              <div className="result-icon">
                ◇
              </div>

              <h3>
                Awaiting Analysis
              </h3>

              <p>
                Enter transaction details and run the Model 2 analysis.
              </p>

            </div>
          )}


          {result && (
            <div className={`prediction-result ${result.type}`}>

              <div className="result-icon">
                {result.fraud ? "!" : "✓"}
              </div>

              <h3>
                {result.fraud
                  ? "Fraud Detected"
                  : "Transaction Approved"}
              </h3>

              <p>
                {result.message}
              </p>


              {/* ML RESULT */}

              {result.risk_score !== undefined && (
                <div className="prediction-details">

                  <div>
                    <span>Risk Score</span>
                    <strong>
                      {result.risk_score}/100
                    </strong>
                  </div>

                  <div>
                    <span>Risk Level</span>
                    <strong>
                      {result.risk_level}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>
                      {result.status}
                    </strong>
                  </div>

                  <div>
                    <span>Fraud Probability</span>
                    <strong>
                      {(result.fraud_probability * 100).toFixed(2)}%
                    </strong>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default EcommerceAnalysis