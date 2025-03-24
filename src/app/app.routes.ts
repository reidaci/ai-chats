import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SubscriptionPlansComponent } from './components/subscription-plans/subscription-plans.component';

export const routes: Routes = [
  { path: '', component: SidebarComponent, title: 'Home' },
  { path: 'subscription', component: SubscriptionPlansComponent, title: 'Subscription' }
];