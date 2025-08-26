import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="fade-in">
        <h1 class="mb-3">Analytics & Reports</h1>

        <!-- Summary Cards -->
        <div class="grid grid-3 mb-3">
          <div class="card text-center">
            <h3 class="income">\${{ monthlyStats.totalIncome.toLocaleString() }}</h3>
            <p>Total Income</p>
            <small>This Month</small>
          </div>
          <div class="card text-center">
            <h3 class="expense">\${{ monthlyStats.totalExpenses.toLocaleString() }}</h3>
            <p>Total Expenses</p>
            <small>This Month</small>
          </div>
          <div class="card text-center">
            <h3 class="balance">\${{ monthlyStats.balance.toLocaleString() }}</h3>
            <p>Net Savings</p>
            <small>This Month</small>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-2 mb-3">
          <!-- Expense Categories Pie Chart -->
          <div class="card">
            <h2 class="mb-2">Expense Categories</h2>
            <div class="chart-container">
              <canvas #expenseChart></canvas>
            </div>
          </div>

          <!-- Income vs Expenses -->
          <div class="card">
            <h2 class="mb-2">Income vs Expenses</h2>
            <div class="chart-container">
              <canvas #incomeExpenseChart></canvas>
            </div>
          </div>
        </div>

        <!-- Monthly Trend -->
        <div class="card mb-3">
          <h2 class="mb-2">Monthly Trend</h2>
          <div class="chart-container-large">
            <canvas #trendChart></canvas>
          </div>
        </div>

        <!-- Financial Insights -->
        <div class="grid grid-2">
          <!-- Key Insights -->
          <div class="card">
            <h2 class="mb-2">Key Insights</h2>
            <div class="insights-list">
              <div class="insight-item" *ngFor="let insight of insights">
                <div class="insight-icon" [ngClass]="insight.type">
                  {{ insight.icon }}
                </div>
                <div class="insight-content">
                  <h4>{{ insight.title }}</h4>
                  <p>{{ insight.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Spending Categories -->
          <div class="card">
            <h2 class="mb-2">Top Spending Categories</h2>
            <div class="category-stats">
              <div *ngFor="let stat of topSpendingCategories; let i = index" class="category-stat">
                <div class="category-rank">{{ i + 1 }}</div>
                <div class="category-info">
                  <strong>{{ stat.category }}</strong>
                  <div class="category-amount expense">\${{ stat.amount.toLocaleString() }}</div>
                </div>
                <div class="category-bar">
                  <div class="bar-fill" 
                       [style.width.%]="(stat.amount / maxCategorySpend) * 100"
                       [style.background-color]="getCategoryColor(stat.category)">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Export Section -->
        <div class="card mt-3">
          <h2 class="mb-2">Export Reports</h2>
          <p class="mb-2">Download your financial data for external analysis or record keeping.</p>
          <div class="export-buttons">
            <button class="btn-primary" (click)="exportToCsv()">Export to CSV</button>
            <button class="btn-secondary" (click)="exportToPdf()">Export to PDF</button>
            <button class="btn-secondary" (click)="generateReport()">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }

    .chart-container-large {
      position: relative;
      height: 400px;
      width: 100%;
    }

    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .insight-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .insight-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2em;
      flex-shrink: 0;
    }

    .insight-icon.positive {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .insight-icon.warning {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .insight-icon.info {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .insight-content h4 {
      font-size: 1.1em;
      font-weight: 600;
      margin-bottom: 4px;
      color: #333;
    }

    .insight-content p {
      color: #666;
      font-size: 0.95em;
      line-height: 1.5;
    }

    .category-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-stat {
      display: grid;
      grid-template-columns: 30px 1fr 100px;
      gap: 16px;
      align-items: center;
    }

    .category-rank {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #1976D2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85em;
    }

    .category-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .category-info strong {
      font-size: 1em;
      color: #333;
    }

    .category-amount {
      font-weight: 600;
      font-size: 0.95em;
    }

    .category-bar {
      height: 8px;
      background-color: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.8s ease;
    }

    .export-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
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

    h3 {
      font-size: 2em;
      font-weight: 600;
      margin-bottom: 8px;
    }

    small {
      color: #666;
      font-size: 0.85em;
    }

    @media (max-width: 768px) {
      .chart-container,
      .chart-container-large {
        height: 250px;
      }

      .category-stat {
        grid-template-columns: 30px 1fr;
        gap: 12px;
      }

      .category-bar {
        grid-column: 1 / -1;
        margin-top: 8px;
      }

      .export-buttons {
        justify-content: stretch;
      }

      .export-buttons button {
        flex: 1;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('expenseChart', { static: true }) expenseChartRef!: ElementRef;
  @ViewChild('incomeExpenseChart', { static: true }) incomeExpenseChartRef!: ElementRef;
  @ViewChild('trendChart', { static: true }) trendChartRef!: ElementRef;

  monthlyStats = { totalIncome: 0, totalExpenses: 0, balance: 0 };
  topSpendingCategories: {category: string, amount: number}[] = [];
  maxCategorySpend = 0;

  insights = [
    {
      icon: '💡',
      type: 'info',
      title: 'Spending Pattern',
      description: 'Your highest spending is on Food & Dining. Consider meal planning to reduce costs.'
    },
    {
      icon: '📈',
      type: 'positive',
      title: 'Savings Growth',
      description: 'You\'ve saved 23% more this month compared to last month. Great progress!'
    },
    {
      icon: '⚠️',
      type: 'warning',
      title: 'Budget Alert',
      description: 'You\'re approaching your Food & Dining budget limit. Monitor carefully.'
    },
    {
      icon: '🎯',
      type: 'info',
      title: 'Goal Progress',
      description: 'You\'re 67% towards your monthly savings goal of $1,500.'
    }
  ];

  private expenseChart?: Chart;
  private incomeExpenseChart?: Chart;
  private trendChart?: Chart;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadAnalyticsData();
  }

  private loadAnalyticsData() {
    // Load monthly stats
    this.mockDataService.getMonthlyStats().subscribe(stats => {
      this.monthlyStats = stats;
      this.createIncomeExpenseChart();
    });

    // Load category stats
    this.mockDataService.getCategoryStats().subscribe(stats => {
      const expenseStats = stats.filter(stat => stat.type === 'expense');
      this.topSpendingCategories = expenseStats
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
      
      this.maxCategorySpend = Math.max(...this.topSpendingCategories.map(stat => stat.amount));
      
      this.createExpenseChart(expenseStats);
    });

    this.createTrendChart();
  }

  private createExpenseChart(expenseStats: {category: string, amount: number}[]) {
    const ctx = this.expenseChartRef.nativeElement.getContext('2d');
    
    this.expenseChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: expenseStats.map(stat => stat.category),
        datasets: [{
          data: expenseStats.map(stat => stat.amount),
          backgroundColor: [
            '#FF5722',
            '#9C27B0',
            '#E91E63',
            '#FF9800',
            '#F44336'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  private createIncomeExpenseChart() {
    const ctx = this.incomeExpenseChartRef.nativeElement.getContext('2d');
    
    this.incomeExpenseChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['This Month'],
        datasets: [{
          label: 'Income',
          data: [this.monthlyStats.totalIncome],
          backgroundColor: '#4CAF50',
          borderRadius: 4
        }, {
          label: 'Expenses',
          data: [this.monthlyStats.totalExpenses],
          backgroundColor: '#F44336',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return '$' + Number(value).toLocaleString();
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  private createTrendChart() {
    const ctx = this.trendChartRef.nativeElement.getContext('2d');
    
    // Mock monthly data for the past 6 months
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const incomeData = [4800, 5200, 4900, 5100, 5300, 5500];
    const expenseData = [3200, 3600, 3400, 3800, 3900, 3750];
    
    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Income',
          data: incomeData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return '$' + Number(value).toLocaleString();
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
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

  exportToCsv() {
    // In a real app, this would generate and download a CSV file
    alert('CSV export functionality would be implemented here. This would download a CSV file with all transaction data.');
  }

  exportToPdf() {
    // In a real app, this would generate and download a PDF report
    alert('PDF export functionality would be implemented here. This would generate a comprehensive financial report in PDF format.');
  }

  generateReport() {
    // In a real app, this would generate a detailed financial report
    alert('Report generation functionality would be implemented here. This would create a detailed monthly financial summary.');
  }

  ngOnDestroy() {
    // Clean up charts
    if (this.expenseChart) {
      this.expenseChart.destroy();
    }
    if (this.incomeExpenseChart) {
      this.incomeExpenseChart.destroy();
    }
    if (this.trendChart) {
      this.trendChart.destroy();
    }
  }
}