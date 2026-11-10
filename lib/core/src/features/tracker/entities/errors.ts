class TransactionError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "TransactionError";
    }
}

class InvalidAmount extends TransactionError {
    constructor(message = "Amount must be positive") {
        super(message);
        this.name = "InvalidAmount";
    }
}

class InvalidTransaction extends TransactionError {
    constructor(message = "The transaction was invalid") {
        super(message);
        this.name = "InvalidTransaction";
    }
}

class TransactionNotFound extends TransactionError {
    constructor(message: string) {
        super(message);
        this.name = "TransactionNotFound";
    }
}

export {
    InvalidAmount,
    InvalidTransaction,
    TransactionError,
    TransactionNotFound,
};
