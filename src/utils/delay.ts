export const delay = (amount: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, amount));