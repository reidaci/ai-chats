AI Chats
A web application that allows users to chat with different AI models using their respective APIs.
Features

Chat with multiple AI assistants including OpenAI (ChatGPT), Claude, Gemini, Llama, and Mistral
Compare responses from different AI models
Clean, intuitive user interface
Save and export your conversations

Prerequisites

Node.js (v16 or higher)
Angular CLI
API keys for the AI services you want to use

Installation

Clone the repository:
git clone https://github.com/reidaci/ai-chats.git
cd ai-chats

Install dependencies:
npm install

Set up your API keys (see below)
Start the development server:
ng serve

Open your browser and navigate to http://localhost:4200

Setting Up API Keys
To use the AI services, you'll need to set up your API keys. These keys are not included in the repository for security reasons.
Option 1: Update Environment Files Directly (Not Recommended for Production)

Edit src/environments/environment.ts and src/environments/environment.prod.ts
Add your API keys:
typescriptexport const environment = {
  production: false, // true in environment.prod.ts
  useMockData: false,
  openaiApiKey: 'your-openai-api-key-here',
  claudeApiKey: 'your-claude-api-key-here',
  geminiApiKey: 'your-gemini-api-key-here',
  llamaApiKey: 'your-llama-api-key-here',
  mistralApiKey: 'your-mistral-api-key-here'
};


Option 2: Create a Separate API Keys File (Recommended)

Create a file named api-keys.ts in the src/app directory:
typescriptexport const API_KEYS = {
  openai: 'your-openai-api-key-here',
  claude: 'your-claude-api-key-here',
  gemini: 'your-gemini-api-key-here',
  llama: 'your-llama-api-key-here',
  mistral: 'your-mistral-api-key-here'
};

Make sure this file is listed in your .gitignore file to prevent accidental commits:
# API Keys
src/app/api-keys.ts

Update the environment files to use the API keys from this file:
typescriptimport { API_KEYS } from '../app/api-keys';

export const environment = {
  production: false, // true in environment.prod.ts
  useMockData: false,
  openaiApiKey: API_KEYS.openai,
  claudeApiKey: API_KEYS.claude,
  geminiApiKey: API_KEYS.gemini,
  llamaApiKey: API_KEYS.llama,
  mistralApiKey: API_KEYS.mistral
};


Where to Get API Keys

OpenAI (ChatGPT): Sign up at OpenAI's platform and create an API key in the dashboard.
Claude: Sign up for Claude's API access and get an API key.
Gemini: Get an API key from Google AI Studio.
Mistral: Create an account at Mistral AI to get your API key.
Llama: Contact Meta AI or check their Llama documentation for API access.

Mock Mode
If you don't have API keys, you can enable mock mode by setting useMockData: true in the environment files. This will use simulated responses instead of making real API calls.
