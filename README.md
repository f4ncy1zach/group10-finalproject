# Travel Advisor 🌍

Live Build: [https://travle-advisor.vercel.app/](https://travle-advisor.vercel.app/)

## Project Overview

Travel Advisor is a Vite + React application designed to help users discover new destinations and get recommendations using AI. This guide provides step-by-step instructions to deploy and run the application locally.

---

## 🚀 Getting Started (Local Deployment)

Follow these steps precisely to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/f4ncy1zach/group10-finalproject.git
cd group10-finalproject
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed (LTS version recommended).

Open your terminal in file directory and run

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following variable:

```
VITE_OPENAI_API_KEY=<your-openai-api-key>
```

> 🔐 **Note**: Replace `<your-openai-api-key>` with your actual OpenAI API key.

### 4. Run the Application Locally

```bash
npm run dev
```

This will start the development server. You should see output in the terminal indicating that the project is running. Open the provided `localhost` URL in your browser to test the app.

---

## ❗Important Notes

- If the application fails to run, check that all steps above have been followed exactly.
- This project uses **Vite**, so it benefits from fast build times and hot module replacement.

---

## 🔗 Live Build

You can view the deployed version here:  
👉 [https://travle-advisor.vercel.app/](https://travle-advisor.vercel.app/)

---

Happy travels! ✈️🌎