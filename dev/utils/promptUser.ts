export const promptUser = (question: string): Promise<string> =>
  new Promise((resolve) => {
    process.stdout.write(question);

    process.stdin.once("data", (data) => {
      const userInput = data.toString().trim();
      resolve(userInput);
    });
  });
