import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ais } from './modelsAI/aismodel';
import { SubscriptionComponent } from './components/subscription/subscription.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ChatWindowComponent,SubscriptionComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isPremiumUser: boolean = false;
  selectedAi: any;
  ais=[...ais]
  

  onAiSelected(ai: any) {
    this.selectedAi = ai;
  }
}