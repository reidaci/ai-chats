import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {
constructor(private router:Router){}

  @Input() show: boolean = false;
  isVisible = true;

  closeSubscription() {
    this.isVisible = false;
  }

  subscribe() {

   this.router.navigate(['/subscription'])
 
  }
}