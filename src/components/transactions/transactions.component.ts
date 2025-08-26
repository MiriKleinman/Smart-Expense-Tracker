import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Transaction } from '../../models/transaction.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="fade-in">
        <div class="header">
          <h1>Transactions</h1>
          <button class="btn-primary" (click)="showAddForm = !showAddForm">
            {{ showAddForm ? 'Cancel' : 'Add Transaction' }}
          </button>
        </div>

        <!-- Add Transaction Form -->
        <div *ngIf="showAddForm" class="card mb-3">
          <h2 class="mb-2">Add New Transaction</h2>
          <form (ngSubmit)="addTransaction()" class="transaction-form">
            <div class="form-row">
              <div class="form-group">
                <label>Amount</label>
                <input type="number" 
                       [(ngModel)]="newTransaction.amount" 
                       name="amount"
                       placeholder="Enter amount"
                       required>
              </div>
              <div class="form-group">
                <label>Type</label>
                <select [(ngModel)]="newTransaction.type" name="type" required>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Description</label>
                <input type="text" 
                       [(ngModel)]="newTransaction.description" 
                       name="description"
                       placeholder="Enter description"
                       required>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="newTransaction.categoryId" name="categoryId" required>
                  <option value="">Select category</option>
                  <option *ngFor="let category of getFilteredCategories()" 
                          [value]="category.id">
                    {{ category.categoryName }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Date</label>
              <input type="date" 
                     [(ngModel)]="newTransaction.date" 
                     name="date"
                     required>
            </div>
            <button type="submit" class="btn-primary">Add Transaction</button>
          </form>
        </div>

        <!-- Filters -->
        <div class="card mb-3">
          <div class="filters">
            <div class="filter-group">
              <label>Filter by Type:</label>
              <select [(ngModel)]="filterType" (change)="applyFilters()">
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Filter by Category:</label>
              <select [(ngModel)]="filterCategory" (change)="applyFilters()">
                <option value="">All Categories</option>
                <option *ngFor="let category of categories" [value]="category.categoryName">
                  {{ category.categoryName }}
                </option>
              </select>
            </div>
            <div class="filter-group">
              <label>Search:</label>
              <input type="text" 
                     [(ngModel)]="searchTerm" 
                     (input)="applyFilters()"
                     placeholder="Search transactions...">
            </div>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="card">
          <h2 class="mb-2">Transaction History</h2>
          <div class="transaction-list">
            <div *ngFor="let transaction of filteredTransactions" 
                 class="transaction-item">
              <div class="transaction-date">
                {{ transaction.date | date:'MMM dd, yyyy' }}
              </div>
              <div class="transaction-details">
                <div class="transaction-main">
                  <strong>{{ transaction.description }}</strong>
                  <div class="transaction-meta">
                    <span class="category-tag" 
                          [style.background-color]="getCategoryColor(transaction.categoryName)">
                      {{ transaction.categoryName }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="transaction-amount" [ngClass]="transaction.type">
                {{ transaction.type === 'income' ? '+' : '-' }}\${{ transaction.amount.toLocaleString() }}
              </div>
              <div class="transaction-actions">
                <button class="btn-edit" (click)="editTransaction(transaction)">Edit</button>
                <button class="btn-delete" (click)="deleteTransaction(transaction.id)">Delete</button>
              </div>
            </div>
          </div>
          
          <div *ngIf="filteredTransactions.length === 0" class="no-transactions">
            <p>No transactions found matching your criteria.</p>
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

    .transaction-form {
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

    .filters {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-group label {
      font-weight: 500;
      color: #333;
    }

    .transaction-list {
      display: flex;
      flex-direction: column;
    }

    .transaction-item {
      display: grid;
      grid-template-columns: 100px 1fr auto auto;
      gap: 16px;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #eee;
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-date {
      font-size: 0.9em;
      color: #666;
      font-weight: 500;
    }

    .transaction-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .transaction-main strong {
      font-size: 1.1em;
      color: #333;
    }

    .transaction-meta {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .category-tag {
      padding: 4px 8px;
      border-radius: 12px;
      color: white;
      font-size: 0.8em;
      font-weight: 500;
    }

    .transaction-amount {
      font-weight: 600;
      font-size: 1.2em;
    }

    .transaction-actions {
      display: flex;
      gap: 8px;
    }

    .btn-edit,
    .btn-delete {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 0.85em;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .btn-edit {
      background-color: #00796B;
      color: white;
    }

    .btn-edit:hover {
      background-color: #00695C;
    }

    .btn-delete {
      background-color: #F44336;
      color: white;
    }

    .btn-delete:hover {
      background-color: #D32F2F;
    }

    .no-transactions {
      text-align: center;
      padding: 48px 0;
      color: #666;
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

      .filters {
        grid-template-columns: 1fr;
      }

      .transaction-item {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .transaction-actions {
        justify-content: flex-end;
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  categories: Category[] = [];
  showAddForm = false;
  
  // Filters
  filterType = '';
  filterCategory = '';
  searchTerm = '';

  // New transaction form
  newTransaction = {
    amount: 0,
    description: '',
    categoryId: 0,
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.mockDataService.getTransactions().subscribe(data => {
      this.transactions = data.transactions;
      this.applyFilters();
    });

    this.mockDataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  getFilteredCategories(): Category[] {
    return this.categories.filter(cat => cat.type === this.newTransaction.type);
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const matchesType = !this.filterType || transaction.type === this.filterType;
      const matchesCategory = !this.filterCategory || transaction.categoryName === this.filterCategory;
      const matchesSearch = !this.searchTerm || 
        transaction.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesType && matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addTransaction() {
    if (this.newTransaction.amount > 0 && this.newTransaction.description && this.newTransaction.categoryId) {
      const category = this.categories.find(c => c.id === this.newTransaction.categoryId);
      
      const transaction: Transaction = {
        id: Date.now(), // Simple ID generation for demo
        amount: this.newTransaction.amount,
        description: this.newTransaction.description,
        categoryId: this.newTransaction.categoryId,
        categoryName: category?.categoryName || '',
        type: this.newTransaction.type,
        date: new Date(this.newTransaction.date),
        userId: 1
      };

      this.transactions.unshift(transaction);
      this.applyFilters();
      this.resetForm();
      this.showAddForm = false;
    }
  }

  editTransaction(transaction: Transaction) {
    // In a real app, this would open an edit form
    alert(`Edit functionality would be implemented here for: ${transaction.description}`);
  }

  deleteTransaction(id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.applyFilters();
    }
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(c => c.categoryName === categoryName);
    return category?.color || '#666';
  }

  private resetForm() {
    this.newTransaction = {
      amount: 0,
      description: '',
      categoryId: 0,
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    };
  }
}