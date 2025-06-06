# 📊 React Dashboard UI (TypeScript + MUI + Nivo)

This project is a dynamic dashboard built with **React**, **TypeScript**, **Material UI v5**, and **Nivo** charting library. It features data filtering, user switching, table and chart visualizations, all in a clean and responsive interface.

## 🚀 Live Demo

[🔗 View the Live App](https://tech-flitter-assignment-b5ph.vercel.app/)

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

# Dashboard Images
## Metrics Summary
![Screenshot 2025-06-06 114222](https://github.com/user-attachments/assets/33c7bfea-6d37-4b5a-bfe4-001a078e9d05)


## Bar Chart 

![Screenshot 2025-06-06 114238](https://github.com/user-attachments/assets/732205fc-6881-4e71-b64a-8861eba17f2a)

## Data Table

![Screenshot 2025-06-06 114309](https://github.com/user-attachments/assets/7cbfadb5-54a7-4127-a3df-4cc0a9e602db)

## Analytical View

![Screenshot 2025-06-06 114330](https://github.com/user-attachments/assets/e0a68adf-9e4c-4e99-af1c-7f53ad1501c8)


## Stacked Group Chart
![Screenshot 2025-06-06 114344](https://github.com/user-attachments/assets/cfe0e74f-ebd9-42b1-8348-67131f71ea9d)

