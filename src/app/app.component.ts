import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { ais } from './modelsAI/aismodel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,  
    SidebarComponent, 
    ChatWindowComponent,
    SubscriptionComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isPremiumUser: boolean = false;
  selectedAi: any;
  ais = [...ais];

  constructor(private router: Router) {}  

  onAiSelected(ai: any) {
    this.selectedAi = ai;
  }

  isSubscriptionPage(): boolean {
    return this.router.url === '/subscription';
  }
}
