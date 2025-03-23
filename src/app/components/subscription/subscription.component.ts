import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {
  @Input() show: boolean = false;
  isVisible = true;

  closeSubscription() {
    this.isVisible = false;
  }

  subscribe() {

    console.log('User clicked subscribe');
 
  }
}