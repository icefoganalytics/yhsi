export const applicationName = "Yukon Historic Sites"
export const applicationIcon = "mdi-cash-register"
export const environment = process.env.NODE_ENV
export const apiBaseUrl =
  process.env.NODE_ENV == "production" ? "" : "http://localhost:3000"
