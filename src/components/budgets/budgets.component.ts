import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Budget } from '../../models/budget.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="fade-in">
        <div class="header">
          <h1>Budget Management</h1>
          <button class="btn-primary" (click)="showAddForm = !showAddForm">
            {{ showAddForm ? 'Cancel' : 'Set Budget' }}
          </button>
        </div>

        <!-- Add Budget Form -->
        <div *ngIf="showAddForm" class="card mb-3">
          <h2 class="mb-2">Set New Budget</h2>
          <form (ngSubmit)="addBudget()" class="budget-form">
            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="newBudget.categoryId" name="categoryId" required>
                  <option value="">Select category</option>
                  <option *ngFor="let category of expenseCategories" [value]="category.id">
                    {{ category.categoryName }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Budget Amount</label>
                <input type="number" 
                       [(ngModel)]="newBudget.amount" 
                       name="amount"
                       placeholder="Enter budget amount"
                       required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Month</label>
                <select [(ngModel)]="newBudget.month" name="month" required>
                  <option *ngFor="let month of months; let i = index" [value]="i + 1">
                    {{ month }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Year</label>
                <select [(ngModel)]="newBudget.year" name="year" required>
                  <option *ngFor="let year of years" [value]="year">
                    {{ year }}
                  </option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn-primary">Set Budget</button>
          </form>
        </div>

        <!-- Budget Overview -->
        <div class="card mb-3">
          <h2 class="mb-2">Budget Overview for {{ getMonthName(currentMonth) }} {{ currentYear }}</h2>
          <div class="budget-summary">
            <div class="summary-card">
              <h3>\${{ totalBudget.toLocaleString() }}</h3>
              <p>Total Budget</p>
            </div>
            <div class="summary-card">
              <h3>\${{ totalSpent.toLocaleString() }}</h3>
              <p>Total Spent</p>
            </div>
            <div class="summary-card">
              <h3 [ngClass]="remaining >= 0 ? 'income' : 'expense'">\${{ getAbsoluteValue(remaining).toLocaleString() }}</h3>
              <p>{{ remaining >= 0 ? 'Remaining' : 'Over Budget' }}</p>
            </div>
          </div>
        </div>

        <!-- Budget Details -->
        <div class="card">
          <h2 class="mb-2">Budget Details</h2>
          <div class="budget-list">
            <div *ngFor="let budget of budgets" class="budget-item">
              <div class="budget-header">
                <div class="budget-category">
                  <h3>{{ budget.categoryName }}</h3>
                  <div class="budget-amounts">
                    <span class="spent">\${{ budget.spent.toLocaleString() }}</span>
                    <span class="separator">/</span>
                    <span class="total">\${{ budget.amount.toLocaleString() }}</span>
                  </div>
                </div>
                <div class="budget-status" [ngClass]="getBudgetStatus(budget)">
                  {{ getBudgetStatusText(budget) }}
                </div>
              </div>
              
              <div class="budget-progress">
                <div class="progress-bar">
                  <div class="progress-fill" 
                       [style.width.%]="getMinValue((budget.spent / budget.amount) * 100, 100)"
                       [ngClass]="getProgressClass(budget.spent / budget.amount)">
                  </div>
                </div>
                <div class="progress-text">
                  {{ ((budget.spent / budget.amount) * 100).toFixed(1) }}%
                </div>
              </div>

              <div class="budget-actions">
                <button class="btn-secondary" (click)="editBudget(budget)">Edit</button>
                <button class="btn-delete" (click)="deleteBudget(budget.id)">Delete</button>
              </div>
            </div>
          </div>

          <div *ngIf="budgets.length === 0" class="no-budgets">
            <p>No budgets set for this month. Click "Set Budget" to get started!</p>
          </div>
        </div>

        <!-- Budget Tips -->
        <div class="card mt-3">
          <h2 class="mb-2">Budget Tips</h2>
          <div class="tips-grid">
            <div class="tip-card">
              <h4>🎯 Set Realistic Goals</h4>
              <p>Base your budgets on past spending patterns and set achievable targets.</p>
            </div>
            <div class="tip-card">
              <h4>📊 Track Regularly</h4>
              <p>Monitor your spending weekly to stay on track with your budget goals.</p>
            </div>
            <div class="tip-card">
              <h4>🔄 Adjust as Needed</h4>
              <p>Don't be afraid to adjust your budgets based on changing circumstances.</p>
            </div>
            <div class="tip-card">
              <h4>💡 Use the 50/30/20 Rule</h4>
              <p>50% needs, 30% wants, 20% savings and debt repayment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .budget-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 500;
      color: #333;
    }

    .form-group input,
    .form-group select {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #1976D2;
    }

    .budget-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .summary-card {
      text-align: center;
      padding: 24px;
      background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
      border-radius: 8px;
    }

    .summary-card h3 {
      font-size: 2.5em;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .summary-card p {
      color: #666;
      font-weight: 500;
    }

    .budget-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .budget-item {
      padding: 24px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }

    .budget-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .budget-category h3 {
      font-size: 1.3em;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    .budget-amounts {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .budget-amounts .spent {
      font-weight: 600;
      font-size: 1.2em;
      color: #d32f2f;
    }

    .budget-amounts .separator {
      color: #666;
      font-size: 1.1em;
    }

    .budget-amounts .total {
      font-weight: 600;
      font-size: 1.2em;
      color: #333;
    }

    .budget-status {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.85em;
      font-weight: 600;
    }

    .budget-status.good {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .budget-status.warning {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .budget-status.danger {
      background-color: #ffebee;
      color: #c62828;
    }

    .budget-progress {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .progress-bar {
      flex: 1;
      height: 12px;
      background-color: #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      transition: width 0.8s ease;
      border-radius: 6px;
    }

    .progress-fill.low {
      background: linear-gradient(90deg, #4CAF50, #66BB6A);
    }

    .progress-fill.medium {
      background: linear-gradient(90deg, #FF9800, #FFB74D);
    }

    .progress-fill.high {
      background: linear-gradient(90deg, #F44336, #EF5350);
    }

    .progress-text {
      font-weight: 600;
      color: #666;
      min-width: 45px;
    }

    .budget-actions {
      display: flex;
      gap: 12px;
    }

    .btn-delete {
      background-color: #F44336;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 0.9em;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .btn-delete:hover {
      background-color: #D32F2F;
    }

    .no-budgets {
      text-align: center;
      padding: 48px 0;
      color: #666;
    }

    .tips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .tip-card {
      padding: 20px;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: 8px;
    }

    .tip-card h4 {
      font-size: 1.1em;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1565c0;
    }

    .tip-card p {
      color: #555;
      font-size: 0.95em;
      line-height: 1.5;
    }

    h1 {
      font-size: 2.5em;
      font-weight: 300;
      color: #1976D2;
    }

    h2 {
      font-size: 1.5em;
      font-weight: 500;
      color: #333;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .budget-summary {
        grid-template-columns: 1fr;
      }

      .budget-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .tips-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BudgetsComponent implements OnInit {
  budgets: Budget[] = [];
  categories: Category[] = [];
  expenseCategories: Category[] = [];
  showAddForm = false;
  
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  years = [2024, 2025, 2026];

  // Computed properties
  get totalBudget(): number {
    return this.budgets.reduce((sum, budget) => sum + budget.amount, 0);
  }

  get totalSpent(): number {
    return this.budgets.reduce((sum, budget) => sum + budget.spent, 0);
  }

  get remaining(): number {
    return this.totalBudget - this.totalSpent;
  }

  // New budget form
  newBudget = {
    categoryId: 0,
    amount: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.mockDataService.getBudgets().subscribe(budgets => {
      this.budgets = budgets;
    });

    this.mockDataService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.expenseCategories = categories.filter(cat => cat.type === 'expense');
    });
  }

  getMonthName(monthNum: number): string {
    return this.months[monthNum - 1];
  }

  getProgressClass(percentage: number): string {
    if (percentage < 0.7) return 'low';
    if (percentage < 0.9) return 'medium';
    return 'high';
  }

  getBudgetStatus(budget: Budget): string {
    const percentage = budget.spent / budget.amount;
    if (percentage < 0.7) return 'good';
    if (percentage < 1.0) return 'warning';
    return 'danger';
  }

  getBudgetStatusText(budget: Budget): string {
    const percentage = budget.spent / budget.amount;
    if (percentage < 0.7) return 'On Track';
    if (percentage < 1.0) return 'Near Limit';
    return 'Over Budget';
  }

  addBudget() {
    if (this.newBudget.categoryId && this.newBudget.amount > 0) {
      const category = this.categories.find(c => c.id === this.newBudget.categoryId);
      
      const budget: Budget = {
        id: Date.now(),
        categoryId: this.newBudget.categoryId,
        categoryName: category?.categoryName || '',
        amount: this.newBudget.amount,
        spent: 0, // Would be calculated from transactions in real app
        month: this.newBudget.month,
        year: this.newBudget.year,
        userId: 1
      };

      this.budgets.push(budget);
      this.resetForm();
      this.showAddForm = false;
    }
  }

  editBudget(budget: Budget) {
    const newAmount = prompt(`Enter new budget amount for ${budget.categoryName}:`, budget.amount.toString());
    if (newAmount && !isNaN(Number(newAmount))) {
      budget.amount = Number(newAmount);
    }
  }

  deleteBudget(id: number) {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgets = this.budgets.filter(b => b.id !== id);
    }
  }

  private resetForm() {
    this.newBudget = {
      categoryId: 0,
      amount: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    };
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }
}