function isValidAmount(value: string): boolean {
    return /^\d+(\.\d{1,2})?$/.test(value);
}

function parseAmount(value: string): number | undefined {
    if (!isValidAmount(value)) return undefined;

    const [taka, paisa = ""] = value.split(".");
    const amount = Number(taka) * 100 + Number(paisa.padEnd(2, "0"));

    return Number.isSafeInteger(amount) ? amount : undefined;
}

export { isValidAmount, parseAmount };
