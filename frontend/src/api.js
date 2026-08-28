const API_URL = "http://127.0.0.1:8000"

async function request(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`)

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
export const getDashboardData = async () => {
  const [
    dashboard,
    transactions,
    alerts,
    risk
  ] = await Promise.all([
    getDashboard(),
    getTransactions(),
    getAlerts(),
    getRisk()
  ])

  return {
    dashboard,
    transactions,
    alerts,
    risk
  }
}