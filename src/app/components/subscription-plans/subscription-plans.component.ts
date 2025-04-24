import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],  
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css'] 
})
export class SubscriptionPlansComponent {
  selectedPlan: 'monthly' | 'annual' = 'monthly';
  paymentMethod: 'card' | 'paypal' = 'card';
  paymentForm: FormGroup;
  submitted = false;
  showSuccessModal = false;
  
  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{16}$')
      ]],
      cardName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      cardExpiry: ['', [
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')
      ]],
      cardCVV: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{3,4}$')
      ]]
    });
  }
  
  selectPlan(plan: 'monthly' | 'annual') {
    this.selectedPlan = plan;
  }
  
  selectPaymentMethod(method: 'card' | 'paypal') {
    this.paymentMethod = method;
  }
  

  get f() { 
    return this.paymentForm.controls; 
  }
  
  processPayment() {
    this.submitted = true;
    

    if (this.paymentMethod === 'paypal') {
      console.log('Processing payment for', this.selectedPlan, 'plan using PayPal');
      this.showSuccessModal = true;
      return;
    }
    
   
    if (this.paymentForm.invalid) {
      return;
    }
    
    console.log('Processing payment for', this.selectedPlan, 'plan using card');
    console.log('Card details:', this.paymentForm.value);
    

    this.showSuccessModal = true;
  }
  
  closeModal() {
    this.showSuccessModal = false;
 
    this.submitted = false;
    this.paymentForm.reset();
  }

  navigateToHome() {
    this.router.navigate(['']);
  }
}