export interface Transaction {
    id: number;
    amount: number;
    description: string;
    categoryId: number;
    categoryName: string;
    type: 'income' | 'expense';
    date: Date;
    userId: number;
  }
  
  export interface TransactionCreate {
    amount: number;
    description: string;
    categoryId: number;
    type: 'income' | 'expense';
    date: Date;
  }