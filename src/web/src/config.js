export const applicationName = "Yukon Historic Sites"
export const applicationIcon = "mdi-cash-register"
export const hasSidebar = true
export const hasSidebarClosable = false
export const environment = process.env.NODE_ENV
export const apiBaseUrl =
  process.env.NODE_ENV == "production" ? "" : "http://localhost:3000"

export const sections = [
  {
    name: "Sites",
    group: "/sites",
    sections: [
      {
        name: "Summary",
        icon: "mdi-note-text-outline",
        makeUrl: (id) => `/sites/${id}/summary`,
      },
      {
        name: "Location",
        icon: "mdi-map-check",
        makeUrl: (id) => `/sites/${id}/location`,
      },
      {
        name: "Dates & Condition",
        icon: "mdi-calendar-range",
        makeUrl: (id) => `/sites/${id}/dates_&_condition`,
      },
      {
        name: "Themes & Function",
        icon: "mdi-shape",
        makeUrl: (id) => `/sites/${id}/themes_&_function`,
      },
      {
        name: "Associations",
        icon: "mdi-account-group",
        makeUrl: (id) => `/sites/${id}/associations`,
      },
      {
        name: "Legal & Zoning",
        icon: "mdi-script-text-outline",
        makeUrl: (id) => `/sites/${id}/legal_&_zoning`,
      },
      {
        name: "Photos (combined)",
        icon: "mdi-image",
        makeUrl: (id) => `/sites/${id}/photos`,
      },
      {
        name: "Management",
        icon: "mdi-hammer-wrench",
        makeUrl: (id) => `/sites/${id}/management`,
      },
      {
        name: "Description",
        icon: "mdi-alphabetical",
        makeUrl: (id) => `/sites/${id}/description`,
      },
    ],
  },
]
