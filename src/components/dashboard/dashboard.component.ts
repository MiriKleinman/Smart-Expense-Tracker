import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Transaction } from '../../models/transaction.model';
import { Budget } from '../../models/budget.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="fade-in">
        <h1 class="mb-3">Dashboard</h1>
        
        <!-- Summary Cards -->
        <div class="grid grid-3 mb-3">
          <div class="card text-center">
            <h3 class="income">\${{ monthlyStats.totalIncome.toLocaleString() }}</h3>
            <p>Total Income</p>
          </div>
          <div class="card text-center">
            <h3 class="expense">\${{ monthlyStats.totalExpenses.toLocaleString() }}</h3>
            <p>Total Expenses</p>
          </div>
          <div class="card text-center">
            <h3 class="balance">\${{ monthlyStats.balance.toLocaleString() }}</h3>
            <p>Net Balance</p>
          </div>
        </div>

        <!-- Recent Transactions and Budget Overview -->
        <div class="grid grid-2">
          <!-- Recent Transactions -->
          <div class="card">
            <h2 class="mb-2">Recent Transactions</h2>
            <div class="transaction-list">
              <div *ngFor="let transaction of recentTransactions" class="transaction-item">
                <div class="transaction-info">
                  <strong>{{ transaction.description }}</strong>
                  <small class="transaction-category">{{ transaction.categoryName }}</small>
                </div>
                <div class="transaction-amount" [ngClass]="transaction.type">
                  {{ transaction.type === 'income' ? '+' : '-' }}\${{ transaction.amount.toLocaleString() }}
                </div>
              </div>
            </div>
          </div>

          <!-- Budget Overview -->
          <div class="card">
            <h2 class="mb-2">Budget Overview</h2>
            <div class="budget-list">
              <div *ngFor="let budget of budgets" class="budget-item">
                <div class="budget-info">
                  <strong>{{ budget.categoryName }}</strong>
                  <small>\${{ budget.spent.toLocaleString() }} / \${{ budget.amount.toLocaleString() }}</small>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" 
                         [style.width.%]="(budget.spent / budget.amount) * 100"
                         [ngClass]="getProgressClass(budget.spent / budget.amount)">
                    </div>
                  </div>
                  <small>{{ ((budget.spent / budget.amount) * 100).toFixed(0) }}%</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Breakdown Chart -->
        <div class="card mt-3">
          <h2 class="mb-2">Expense Categories</h2>
          <div class="category-chart">
            <div *ngFor="let stat of expenseStats" class="category-bar">
              <div class="category-info">
                <span>{{ stat.category }}</span>
                <span>\${{ stat.amount.toLocaleString() }}</span>
              </div>
              <div class="bar">
                <div class="bar-fill" 
                     [style.width.%]="(stat.amount / maxExpense) * 100"
                     [style.background-color]="getCategoryColor(stat.category)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .transaction-category {
      color: #666;
      font-size: 0.85em;
    }

    .transaction-amount {
      font-weight: 600;
      font-size: 1.1em;
    }

    .budget-item {
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .budget-item:last-child {
      border-bottom: none;
    }

    .budget-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .budget-progress {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background-color: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 4px;
    }

    .progress-fill.low {
      background-color: #4CAF50;
    }

    .progress-fill.medium {
      background-color: #FF9800;
    }

    .progress-fill.high {
      background-color: #F44336;
    }

    .category-chart {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-bar {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-info {
      display: flex;
      justify-content: space-between;
      font-weight: 500;
    }

    .bar {
      height: 24px;
      background-color: #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      transition: width 0.8s ease;
      border-radius: 12px;
    }

    h1 {
      font-size: 2.5em;
      font-weight: 300;
      color: #1976D2;
      margin-bottom: 24px;
    }

    h2 {
      font-size: 1.5em;
      font-weight: 500;
      color: #333;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 2em;
      font-weight: 600;
      margin-bottom: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  monthlyStats = { totalIncome: 0, totalExpenses: 0, balance: 0 };
  recentTransactions: Transaction[] = [];
  budgets: Budget[] = [];
  expenseStats: {category: string, amount: number}[] = [];
  maxExpense = 0;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Load monthly stats
    this.mockDataService.getMonthlyStats().subscribe(stats => {
      this.monthlyStats = stats;
    });

    // Load recent transactions
    this.mockDataService.getTransactions().subscribe(data => {
      this.recentTransactions = data.transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    });

    // Load budgets
    this.mockDataService.getBudgets().subscribe(budgets => {
      this.budgets = budgets;
    });

    // Load category stats
    this.mockDataService.getCategoryStats().subscribe(stats => {
      this.expenseStats = stats
        .filter(stat => stat.type === 'expense')
        .sort((a, b) => b.amount - a.amount);
      
      this.maxExpense = Math.max(...this.expenseStats.map(stat => stat.amount));
    });
  }

  getProgressClass(percentage: number): string {
    if (percentage < 0.7) return 'low';
    if (percentage < 0.9) return 'medium';
    return 'high';
  }

  getCategoryColor(categoryName: string): string {
    const colors: {[key: string]: string} = {
      'Food & Dining': '#FF5722',
      'Transportation': '#9C27B0',
      'Entertainment': '#E91E63',
      'Utilities': '#FF9800',
      'Healthcare': '#F44336'
    };
    return colors[categoryName] || '#666';
  }
}