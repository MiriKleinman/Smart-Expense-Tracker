import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Category } from '../models/category.model';
import { Budget } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private categories: Category[] = [
    { id: 1, categoryName: 'Food & Dining', type: 'expense', color: '#FF5722' },
    { id: 2, categoryName: 'Transportation', type: 'expense', color: '#9C27B0' },
    { id: 3, categoryName: 'Entertainment', type: 'expense', color: '#E91E63' },
    { id: 4, categoryName: 'Utilities', type: 'expense', color: '#FF9800' },
    { id: 5, categoryName: 'Healthcare', type: 'expense', color: '#F44336' },
    { id: 6, categoryName: 'Salary', type: 'income', color: '#4CAF50' },
    { id: 7, categoryName: 'Freelance', type: 'income', color: '#8BC34A' },
    { id: 8, categoryName: 'Investments', type: 'income', color: '#CDDC39' }
  ];

  private transactions: Transaction[] = [
    { id: 1, amount: 5000, description: 'Monthly Salary', categoryId: 6, categoryName: 'Salary', type: 'income', date: new Date('2025-01-01'), userId: 1 },
    { id: 2, amount: 250, description: 'Grocery Shopping', categoryId: 1, categoryName: 'Food & Dining', type: 'expense', date: new Date('2025-01-02'), userId: 1 },
    { id: 3, amount: 80, description: 'Gas Station', categoryId: 2, categoryName: 'Transportation', type: 'expense', date: new Date('2025-01-03'), userId: 1 },
    { id: 4, amount: 150, description: 'Electric Bill', categoryId: 4, categoryName: 'Utilities', type: 'expense', date: new Date('2025-01-04'), userId: 1 },
    { id: 5, amount: 500, description: 'Freelance Project', categoryId: 7, categoryName: 'Freelance', type: 'income', date: new Date('2025-01-05'), userId: 1 },
    { id: 6, amount: 45, description: 'Restaurant Dinner', categoryId: 1, categoryName: 'Food & Dining', type: 'expense', date: new Date('2025-01-06'), userId: 1 },
    { id: 7, amount: 25, description: 'Movie Tickets', categoryId: 3, categoryName: 'Entertainment', type: 'expense', date: new Date('2025-01-07'), userId: 1 },
    { id: 8, amount: 200, description: 'Doctor Visit', categoryId: 5, categoryName: 'Healthcare', type: 'expense', date: new Date('2025-01-08'), userId: 1 }
  ];

  private budgets: Budget[] = [
    { id: 1, categoryId: 1, categoryName: 'Food & Dining', amount: 600, spent: 295, month: 1, year: 2025, userId: 1 },
    { id: 2, categoryId: 2, categoryName: 'Transportation', amount: 200, spent: 80, month: 1, year: 2025, userId: 1 },
    { id: 3, categoryId: 3, categoryName: 'Entertainment', amount: 150, spent: 25, month: 1, year: 2025, userId: 1 },
    { id: 4, categoryId: 4, categoryName: 'Utilities', amount: 300, spent: 150, month: 1, year: 2025, userId: 1 }
  ];

  getTransactions(): Observable<{transactions: Transaction[], total: number}> {
    return of({ transactions: this.transactions, total: this.transactions.length });
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getBudgets(): Observable<Budget[]> {
    return of(this.budgets);
  }

  getMonthlyStats(): Observable<{totalIncome: number, totalExpenses: number, balance: number}> {
    const totalIncome = this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    return of({ totalIncome, totalExpenses, balance });
  }

  getCategoryStats(): Observable<{category: string, amount: number, type: string}[]> {
    const categoryStats: {[key: string]: {amount: number, type: string}} = {};
    
    this.transactions.forEach(transaction => {
      if (!categoryStats[transaction.categoryName]) {
        categoryStats[transaction.categoryName] = { amount: 0, type: transaction.type };
      }
      categoryStats[transaction.categoryName].amount += transaction.amount;
    });

    return of(Object.entries(categoryStats).map(([category, data]) => ({
      category,
      amount: data.amount,
      type: data.type
    })));
  }
}