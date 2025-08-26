import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DashboardComponent,
    TransactionsComponent,
    BudgetsComponent,
    AnalyticsComponent
  ],
  template: `
    <div class="app">
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="logo">
              <h1>💰 Smart Expense Tracker</h1>
            </div>
            <nav class="nav">
              <button *ngFor="let tab of tabs" 
                      (click)="activeTab = tab.id"
                      [class.active]="activeTab === tab.id"
                      class="nav-button">
                {{ tab.icon }} {{ tab.label }}
              </button>
            </nav>
            <div class="user-info">
              <div class="user-avatar">JD</div>
              <span>John Doe</span>
            </div>
          </div>
        </div>
      </header>

      <main class="main">
        <app-dashboard *ngIf="activeTab === 'dashboard'"></app-dashboard>
        <app-transactions *ngIf="activeTab === 'transactions'"></app-transactions>
        <app-budgets *ngIf="activeTab === 'budgets'"></app-budgets>
        <app-analytics *ngIf="activeTab === 'analytics'"></app-analytics>
      </main>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 Smart Expense Tracker. Built with Angular 20 and modern web technologies.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
      color: white;
      padding: 16px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .logo h1 {
      font-size: 1.8em;
      font-weight: 600;
      color: white;
      margin: 0;
    }

    .nav {
      display: flex;
      gap: 8px;
    }

    .nav-button {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .nav-button.active {
      background: rgba(255, 255, 255, 0.9);
      color: #1976D2;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }

    .main {
      flex: 1;
      padding: 32px 0;
      background: #f5f5f5;
    }

    .footer {
      background: #333;
      color: white;
      padding: 16px 0;
      text-align: center;
    }

    .footer p {
      margin: 0;
      font-size: 0.9em;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 16px;
      }

      .nav {
        order: -1;
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .nav-button {
        flex: 1;
        min-width: 120px;
      }

      .logo h1 {
        font-size: 1.5em;
      }
    }
  `]
})
export class App {
  activeTab = 'dashboard';
  
  tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'budgets', label: 'Budgets', icon: '🎯' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
});