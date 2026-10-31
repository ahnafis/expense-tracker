import { TransactionKind, type Transaction } from "@/features/tracker";

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 1,
        created_at: 1000,
        occurred_at: 1000,
        amount: 5000,
        kind: TransactionKind.INCOME,
        note: "Monthly salary",
    },
    {
        id: 2,
        created_at: 2000,
        occurred_at: 2000,
        amount: 1200,
        kind: TransactionKind.EXPENSE,
        note: "Groceries",
    },
    {
        id: 3,
        created_at: 3000,
        occurred_at: 3000,
        amount: 800,
        kind: TransactionKind.LEND,
        note: "Loan to friend",
    },
    {
        id: 4,
        created_at: 4000,
        occurred_at: 4000,
        amount: 1500,
        kind: TransactionKind.BORROW,
        note: "Borrowed cash",
    },
    {
        id: 5,
        created_at: 5000,
        occurred_at: 5000,
        amount: 300,
        kind: TransactionKind.REPAY_IN,
        note: "Rahim paid back",
    },
    {
        id: 6,
        created_at: 6000,
        occurred_at: 6000,
        amount: 400,
        kind: TransactionKind.REPAY_OUT,
        note: "Paid back Karim",
    },
];
