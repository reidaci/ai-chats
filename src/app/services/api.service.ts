import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string, endpoint: string = 'default'): Observable<any> {
    if (environment.useMockData) {
      return this.getMockResponse(message, endpoint).pipe(delay(1000));
    }
  
    const apiEndpoint = this.getApiEndpoint(endpoint);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getApiKey(endpoint)}`
    });
  
  
    if (endpoint === 'openai') {
      return this.http.post(
        'https://api.openai.com/v1/chat/completions',
        {
          messages: [{ role: 'user', content: message }],
          model: 'gpt-3.5-turbo',
          max_tokens: 500
        },
        { headers }
      ).pipe(
      
        map(response => ({
          response: response || 'No response from OpenAI',
          ai: endpoint
        }))
      );
    }
   
    return this.http.post(
      apiEndpoint,
  
      { headers }
    ).pipe(
      catchError(error => {
      
      
        return of({ response: `Sorry, there was an error communicating with server. Please try again.` });
      })
    );
  }

  private getApiEndpoint(endpoint: string): string {
    switch (endpoint) {
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      case 'claude':
        return 'https://api.anthropic.com/v1/messages';
      case 'gemini':
        return 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
      case 'llama':
        return 'https://llama-api-endpoint.your-backend.com/completion';
      case 'mistral':
        return 'https://api.mistral.ai/v1/chat/completions';
      default:
        return 'https://your-backend-api.com/chat';
    }
  }

  private getApiKey(endpoint: string): string {
    switch (endpoint) {
      case 'openai':
        return environment.openaiApiKey;
      case 'claude':
        return environment.claudeApiKey;
      case 'gemini':
        return environment.geminiApiKey;
      case 'llama':
        return environment.llamaApiKey;
      case 'mistral':
        return environment.mistralApiKey;
      default:
        return '';
    }
  }

  private getModelName(endpoint: string): string {
    switch (endpoint) {
      case 'openai':
        return 'gpt-3.5-turbo';
      case 'claude':
        return 'claude-instant-1.1';
      case 'gemini':
        return 'gemini-pro';
      case 'llama':
        return 'llama-2-7b-chat';
      case 'mistral':
        return 'mistral-tiny';
      default:
        return 'default-model';
    }
  }

  private getMockResponse(message: string, endpoint: string): Observable<any> {
    let aiName = 'AI';
    switch (endpoint) {
      case 'openai':
      aiName = 'ChatGPT';
      break;
      case 'claude':
        aiName = 'Claude';
        break;
      case 'gemini':
        aiName = 'Gemini';
        break;
      case 'llama':
        aiName = 'Llama';
        break;
      case 'mistral':
        aiName = 'Mistral';
        break;
    }

    const responses = [
      `Hello from ${aiName}! I received your message: "${message}"`,
      `This is ${aiName} responding to your question. I'm currently in mock mode.`,
      `${aiName} here! In a full implementation, I would process your message: "${message}" properly.`,
      `Thanks for chatting with ${aiName}! Your message was: "${message}"`,
      `${aiName} is thinking about "${message}". In a real implementation, I would give a more thoughtful response.`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return of({
      response: randomResponse,
      ai: endpoint
    });
  }
}