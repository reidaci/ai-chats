# AI Chats

A web application that allows users to chat with different AI models using their respective APIs.
https://ai-chats-free.netlify.app/

## Features

- Chat with multiple AI assistants including OpenAI (ChatGPT), Claude, Gemini, Llama, and Mistral
- Compare responses from different AI models
- Clean, intuitive user interface
- Save and export your conversations

## Prerequisites

- Node.js (v16 or higher)
- Angular CLI
- API keys for the AI services you want to use

## Installation

1. Clone the repository:
```bash
git clone https://github.com/reidaci/ai-chats.git
cd ai-chats
```

2. Install dependencies:
```bash
npm install
```

3. Set up your API keys (see below)

4. Start the development server:
```bash
ng serve
```

5. Open your browser and navigate to `http://localhost:4200`

## Setting Up API Keys

To use the AI services, you'll need to set up your API keys. These keys are not included in the repository for security reasons.

### Option 1: Update Environment Files Directly (Not Recommended for Production)

1. Edit `src/environments/environment.ts` and `src/environments/environment.prod.ts`
2. Add your API keys:

```typescript
export const environment = {
  production: false, // true in environment.prod.ts
  useMockData: false,
  openaiApiKey: 'your-openai-api-key-here',
  claudeApiKey: 'your-claude-api-key-here',
  geminiApiKey: 'your-gemini-api-key-here',
  llamaApiKey: 'your-llama-api-key-here',
  mistralApiKey: 'your-mistral-api-key-here'
};
```

### Option 2: Create a Separate API Keys File (Recommended)

1. Create a file named `api-keys.ts` in the `src/app` directory:

```typescript
export const API_KEYS = {
  openai: 'your-openai-api-key-here',
  claude: 'your-claude-api-key-here',
  gemini: 'your-gemini-api-key-here',
  llama: 'your-llama-api-key-here',
  mistral: 'your-mistral-api-key-here'
};
```

2. Make sure this file is listed in your `.gitignore` file to prevent accidental commits:

```
# API Keys
src/app/api-keys.ts
```

3. Update the environment files to use the API keys from this file:

```typescript
import { API_KEYS } from '../app/api-keys';

export const environment = {
  production: false, // true in environment.prod.ts
  useMockData: false,
  openaiApiKey: API_KEYS.openai,
  claudeApiKey: API_KEYS.claude,
  geminiApiKey: API_KEYS.gemini,
  llamaApiKey: API_KEYS.llama,
  mistralApiKey: API_KEYS.mistral
};
```

## Where to Get API Keys

- **OpenAI (ChatGPT)**: Sign up at [OpenAI's platform](https://platform.openai.com/signup) and create an API key in the dashboard.
- **Claude**: Sign up for [Claude's API access](https://www.anthropic.com/product) and get an API key.
- **Gemini**: Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
- **Mistral**: Create an account at [Mistral AI](https://mistral.ai/) to get your API key.
- **Llama**: Contact Meta AI or check their [Llama documentation](https://ai.meta.com/llama/) for API access.

## Mock Mode

If you don't have API keys, you can enable mock mode by setting `useMockData: true` in the environment files. This will use simulated responses instead of making real API calls.



## License

This project is licensed under the MIT License - see the LICENSE file for details.
