import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,FormsModule,ReactiveFormsModule],  
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css'] 
})
export class SubscriptionPlansComponent {
  selectedPlan: 'monthly' | 'annual' = 'monthly';
  paymentMethod: 'card' | 'paypal' = 'card';
 
  cardDetails = {
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  };
  
  selectPlan(plan: 'monthly' | 'annual') {
    this.selectedPlan = plan;
  }
  
  selectPaymentMethod(method: 'card' | 'paypal') {
    this.paymentMethod = method;
  }
  
  processPayment() {
    console.log('Processing payment for', this.selectedPlan, 'plan using', this.paymentMethod);
    console.log('Card details:', this.paymentMethod === 'card' ? this.cardDetails : 'Using PayPal');
   
  }
}