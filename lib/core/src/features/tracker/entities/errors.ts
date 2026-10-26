import { AppError } from "@/types";

export class InvalidAmount extends AppError {}
export class WriteError extends AppError {}
export class InvalidPropertyValue extends AppError {}
export class TransactionNotFound extends AppError {}
