import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, TransactionCreate } from '../models/transaction.model';
import { Category, CategoryCreate } from '../models/category.model';
import { Budget, BudgetCreate } from '../models/budget.model';
import { User, UserLogin, UserRegister } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://your-api-url.com/api'; // Replace with your actual API URL
  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Authentication
  login(credentials: UserLogin): Observable<{token: string, user: User}> {
    return this.http.post<{token: string, user: User}>(`${this.baseUrl}/auth/login`, credentials);
  }

  register(userData: UserRegister): Observable<{token: string, user: User}> {
    return this.http.post<{token: string, user: User}>(`${this.baseUrl}/auth/register`, userData);
  }

  // Transactions
  getTransactions(page = 1, limit = 50): Observable<{transactions: Transaction[], total: number}> {
    return this.http.get<{transactions: Transaction[], total: number}>(
      `${this.baseUrl}/transactions?page=${page}&limit=${limit}`,
      { headers: this.getHeaders() }
    );
  }

  createTransaction(transaction: TransactionCreate): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions`, transaction, { headers: this.getHeaders() });
  }

  updateTransaction(id: number, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/transactions/${id}`, transaction, { headers: this.getHeaders() });
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/transactions/${id}`, { headers: this.getHeaders() });
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`, { headers: this.getHeaders() });
  }

  createCategory(category: CategoryCreate): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category, { headers: this.getHeaders() });
  }

  // Budgets
  getBudgets(year: number, month: number): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.baseUrl}/budgets?year=${year}&month=${month}`, { headers: this.getHeaders() });
  }

  createBudget(budget: BudgetCreate): Observable<Budget> {
    return this.http.post<Budget>(`${this.baseUrl}/budgets`, budget, { headers: this.getHeaders() });
  }

  // Analytics
  getMonthlyStats(year: number, month: number): Observable<{totalIncome: number, totalExpenses: number, balance: number}> {
    return this.http.get<{totalIncome: number, totalExpenses: number, balance: number}>(
      `${this.baseUrl}/analytics/monthly?year=${year}&month=${month}`,
      { headers: this.getHeaders() }
    );
  }

  getCategoryStats(year: number, month: number): Observable<{category: string, amount: number, type: string}[]> {
    return this.http.get<{category: string, amount: number, type: string}[]>(
      `${this.baseUrl}/analytics/categories?year=${year}&month=${month}`,
      { headers: this.getHeaders() }
    );
  }
}