export interface Budget {
    id: number;
    categoryId: number;
    categoryName: string;
    amount: number;
    spent: number;
    month: number;
    year: number;
    userId: number;
  }
  
  export interface BudgetCreate {
    categoryId: number;
    amount: number;
    month: number;
    year: number;
  }