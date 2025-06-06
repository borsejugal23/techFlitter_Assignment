# 📊 React Dashboard UI (TypeScript + MUI + Nivo)

This project is a dynamic dashboard built with **React**, **TypeScript**, **Material UI v5**, and **Nivo** charting library. It features data filtering, user switching, table and chart visualizations, all in a clean and responsive interface.

## 🚀 Live Demo

[🔗 View the Live App](https://your-live-site.vercel.app)

## 📁 Features Overview

- 📌 **Tabs**: Switch between **Metrics View** and **Analytics View**
- 👥 **User Switching**: "My Members" modal with mock users
- 📆 **Filters**: Date range, sector, category, grouping attributes, metric selector
- 📊 **Charts**: Bar chart (Nivo), optional time-series and stacked charts
- 📋 **Data Table**: Grouped, paginated, and sortable table using MUI

---

## 🛠 Tech Stack

- React.js (Vite)
- TypeScript
- Material UI v5 (`@mui/material`)
- Nivo Charts
- State Management: React Context API

---

## 📦 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/borsejugal23/techFlitter_Assignment.git
cd techFlitter_Assignment

# Install dependencies using Yarn
yarn install

# Run the app in development mode
yarn dev


## 🧪 Mock Data Structure
[
  {
    "country": "India",
    "state": "Maharashtra",
    "city": "Mumbai",
    "sector": "Retail",
    "category": "Juice",
    "startDate": "2024-04-01",
    "endDate": "2024-04-30",
    "mySpend": {
      "current": 120000,
      "reference": 100000,
      "absoluteChange": 20000,
      "percentChange": 20
    },
    ...
  },
  ...
]
