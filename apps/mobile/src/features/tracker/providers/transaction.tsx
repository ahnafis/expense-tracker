import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    type Transaction,
    TransactionService,
} from "@lib/core/features/tracker";
import { InMemoryTransactionStorage } from "@lib/core/utils";

import { mock_data } from "../fixtures";

// Core API's
const transaction_storage = new InMemoryTransactionStorage(mock_data);
const transaction_service = new TransactionService(transaction_storage);

// Contexts
type TransactionsContextValue = {
    transactions: Transaction[];
    loading_transactions: boolean;
    refreshTransactions: () => Promise<void>;

    balance: number;
    loading_balance: boolean;
    refreshBalance: () => Promise<void>;
};

const ServiceContext = createContext<TransactionService | null>(null);
const StateContext = createContext<TransactionsContextValue | null>(null);

// Hooks
function useTransactionService() {
    const service = useContext(ServiceContext);

    if (!service) {
        throw new Error(
            "Transaction service must be within a TransactionService provider",
        );
    }

    return service;
}

function useTransactions() {
    const state = useContext(StateContext);

    if (!state) {
        throw new Error(
            "useTransactions must be used within TransactionsProvider",
        );
    }

    return state;
}

// Provider components
type ProviderProps = {
    children: React.ReactNode;
};

function TransactionServiceProvider({ children }: ProviderProps) {
    return (
        <ServiceContext.Provider value={transaction_service}>
            {children}
        </ServiceContext.Provider>
    );
}

function TransactionsProvider({ children }: ProviderProps) {
    const service = useTransactionService();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState(0);
    const [loading_balance, setLoadingBalance] = useState(false);
    const [loading_transactions, setLoadingTransactions] = useState(false);

    const refreshTransactions = useCallback(async () => {
        try {
            setLoadingTransactions(true);
            setTransactions(await service.listTransactions());
        } finally {
            setLoadingTransactions(false);
        }
    }, [service]);

    const refreshBalance = useCallback(async () => {
        try {
            setLoadingBalance(true);
            setBalance(await service.getBalance());
        } finally {
            setLoadingBalance(false);
        }
    }, [service]);

    useEffect(() => {
        void refreshTransactions();
        void refreshBalance();
    }, [refreshTransactions, refreshBalance]);

    return (
        <StateContext.Provider
            value={{
                transactions,
                loading_transactions,
                refreshTransactions,
                balance,
                loading_balance,
                refreshBalance,
            }}
        >
            {children}
        </StateContext.Provider>
    );
}

function TransactionProvider({ children }: ProviderProps) {
    return (
        <TransactionServiceProvider>
            <TransactionsProvider>{children}</TransactionsProvider>
        </TransactionServiceProvider>
    );
}

export { TransactionProvider, useTransactions, useTransactionService };
