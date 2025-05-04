import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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
    
   
    const requestBody = this.prepareRequestBody(message, endpoint);
  
    return this.http.post(
      apiEndpoint,
      requestBody,
      { headers }
    ).pipe(
      map(response => {
        
        return this.formatResponse(response, endpoint);
      }),
      catchError((error: HttpErrorResponse) => {
      
        const errorMessage = this.extractErrorMessage(error, endpoint);
        return of({ 
          response: errorMessage, 
          ai: endpoint,
          isError: true 
        });
      })
    );
  }

  private prepareRequestBody(message: string, endpoint: string): any {
    switch (endpoint) {
      case 'openai':
        return {
          messages: [{ role: 'user', content: message }],
          model: 'gpt-3.5-turbo',
          max_tokens: 500
        };
      case 'claude':
        return {
          model: this.getModelName(endpoint),
          messages: [{ role: 'user', content: message }],
          max_tokens: 500
        };
      case 'gemini':
        return {
          contents: [{ role: 'user', parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 500
          }
        };
      case 'llama':
        return {
          prompt: message,
          model: this.getModelName(endpoint),
          max_tokens: 500
        };
      case 'mistral':
        return {
          messages: [{ role: 'user', content: message }],
          model: this.getModelName(endpoint)
        };
      default:
        return { message };
    }
  }

  private formatResponse(response: any, endpoint: string): any {
    let formattedResponse;
    
    switch (endpoint) {
      case 'openai':
        formattedResponse = response.choices && response.choices[0]?.message?.content || 'No response content from OpenAI';
        break;
      case 'claude':
        formattedResponse = response.content && response.content[0]?.text || 'No response content from Claude';
        break;
      case 'gemini':
        formattedResponse = response.candidates && response.candidates[0]?.content?.parts[0]?.text || 'No response content from Gemini';
        break;
      case 'llama':
        formattedResponse = response.generation || response.text || 'No response content from Llama';
        break;
      case 'mistral':
        formattedResponse = response.choices && response.choices[0]?.message?.content || 'No response content from Mistral';
        break;
      default:
        formattedResponse = response.message || 'No response from AI service';
    }
    
    return {
      response: formattedResponse,
      ai: endpoint
    };
  }

  private extractErrorMessage(error: HttpErrorResponse, endpoint: string): string {
    if (error.error && typeof error.error === 'object') {
   
      if (error.error.error) {
       
        if (typeof error.error.error === 'object' && error.error.error.message) {
          return `Error from ${this.getAiName(endpoint)}: ${error.error.error.message}`;
        } else if (typeof error.error.error === 'string') {
          return `Error from ${this.getAiName(endpoint)}: ${error.error.error}`;
        }
      } else if (error.error.message) {
   
        return `Error from ${this.getAiName(endpoint)}: ${error.error.message}`;
      }
    }
    

    if (error.status === 401) {
      return `Authentication failed for ${this.getAiName(endpoint)}. Your API key may be invalid or your usage plan may have exceeded its limit.`;
    } else if (error.status === 429) {
      return `Rate limit exceeded for ${this.getAiName(endpoint)}. Your usage plan limits have been reached.`;
    } else if (error.status === 403) {
      return `Access forbidden for ${this.getAiName(endpoint)}. Your account may not have permission to use this service.`;
    }
    
    return `Error communicating with ${this.getAiName(endpoint)}: ${error.message || error.statusText || 'Unknown error'}`;
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
        return 'claude-3-haiku-20240307';
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

  private getAiName(endpoint: string): string {
    switch (endpoint) {
      case 'openai':
        return 'ChatGPT';
      case 'claude':
        return 'Claude';
      case 'gemini':
        return 'Gemini';
      case 'llama':
        return 'Llama';
      case 'mistral':
        return 'Mistral';
      default:
        return 'AI';
    }
  }

  private getMockResponse(message: string, endpoint: string): Observable<any> {
    let aiName = this.getAiName(endpoint);

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