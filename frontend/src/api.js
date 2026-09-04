const API_URL = "http://127.0.0.1:8000"

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

export const getHealth = () => {
  return request("/api/health")
}

export const getTransactions = () => {
  return request("/api/transactions")
}

export const getAlerts = () => {
  return request("/api/alerts")
}

export const getModels = () => {
  return request("/api/models")
}

export const getReports = () => {
  return request("/api/reports")
}

export const getRisk = () => {
  return request("/api/risk")
}

export const getDashboard = () => {
  return request("/api/dashboard")
}

export const getSettings = () => {
  return request("/api/settings")
}
export const updateSettings = (settings) => {
  return request("/api/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  })
}

export const getDashboardData = async () => {
  const [
    dashboard,
    transactions,
    alerts,
    risk,
  ] = await Promise.all([
    getDashboard(),
    getTransactions(),
    getAlerts(),
    getRisk(),
  ])

  return {
    dashboard,
    transactions,
    alerts,
    risk,
  }
}

export const predictFraud = (features) => {
  return request("/api/predict", {
    method: "POST",
    body: JSON.stringify({
      features,
    }),
  })
}
export const getTestTransactions = () => {
  return request("/api/test-transactions")
}

export const getEvaluation = () => {
  return request("/api/evaluate")
}