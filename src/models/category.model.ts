export interface Category {
    id: number;
    categoryId?: number;
    categoryName: string;
    type: 'income' | 'expense';
    color: string;
    amount?: number;
    spent?: number;
    month?: number;
    year?: number;
    userId?: number;
  }
  
  export interface CategoryCreate {
    categoryId: number;
    amount: number;
    month: number;
    year: number;
  }