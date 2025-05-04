import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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
    const headers = this.getApiHeaders(endpoint);
    const requestBody = this.prepareRequestBody(message, endpoint);
  
   
    let finalEndpoint = apiEndpoint;
    if (endpoint === 'gemini' && this.getApiKey(endpoint)) {
      finalEndpoint = `${apiEndpoint}?key=${this.getApiKey(endpoint)}`;
    }

    return this.http.post(
      finalEndpoint,
      requestBody,
      { headers }
    ).pipe(
      map(response => {
        
        return this.formatResponse(response, endpoint);
      }),
      catchError((error: HttpErrorResponse) => {
        
        const errorResponse = this.extractErrorFromResponse(error);
        return of({ 
          response: errorResponse, 
          ai: endpoint,
          isError: true 
        });
      })
    );
  }

  private extractErrorFromResponse(error: HttpErrorResponse): string {
  
    let errorMessage = error.statusText || 'Unknown error';
    
    try {
     
      if (error.error) {
        if (typeof error.error === 'object') {
       
          if (error.error.error) {
            if (typeof error.error.error === 'object' && error.error.error.message) {
              errorMessage = error.error.error.message;
            } else if (typeof error.error.error === 'string') {
              errorMessage = error.error.error;
            }
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
        } else if (typeof error.error === 'string') {
      
          errorMessage = error.error;
        }
      }
      
    
      return this.truncateMessage(errorMessage);
    } catch (e) {
    
      return `Error ${error.status || ''}: Request failed`;
    }
  }
  

  private truncateMessage(message: string, maxLength: number = 100): string {
    if (!message || message.length <= maxLength) return message;
    

    const nearPeriod = message.indexOf('.', maxLength/2);
    if (nearPeriod > 0 && nearPeriod < maxLength) {
      return message.substring(0, nearPeriod + 1);
    }
    

    const nearSpace = message.lastIndexOf(' ', maxLength);
    if (nearSpace > 0) {
      return message.substring(0, nearSpace) + '...';
    }
    

    return message.substring(0, maxLength) + '...';
  }

  private getApiHeaders(endpoint: string): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    const apiKey = this.getApiKey(endpoint);
    if (apiKey) {
      switch (endpoint) {
        case 'openai':
          headers = headers.set('Authorization', `Bearer ${apiKey}`);
          break;
        case 'claude':
          headers = headers.set('x-api-key', apiKey)
                          .set('anthropic-version', '2023-06-01');
          break;
        case 'mistral':
          headers = headers.set('Authorization', `Bearer ${apiKey}`);
          break;
        default:
          headers = headers.set('Authorization', `Bearer ${apiKey}`);
      }
    }
    
    return headers;
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
        formattedResponse = response.choices && response.choices[0]?.message?.content || 'No response content';
        break;
      case 'claude':
        formattedResponse = response.content && response.content[0]?.text || 'No response content';
        break;
      case 'gemini':
        formattedResponse = response.candidates && response.candidates[0]?.content?.parts[0]?.text || 'No response content';
        break;
      case 'llama':
        formattedResponse = response.generation || response.text || 'No response content';
        break;
      case 'mistral':
        formattedResponse = response.choices && response.choices[0]?.message?.content || 'No response content';
        break;
      default:
        formattedResponse = response.message || 'No response from AI';
    }
    
    return {
      response: formattedResponse,
      ai: endpoint
    };
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

  private getMockResponse(message: string, endpoint: string): Observable<any> {
    let aiName = '';
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