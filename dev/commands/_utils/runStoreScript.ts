/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";

import inquirer from "inquirer";

export type Command = {
  name: string;
  filename: string;
  description: string;
};

const promptForCommand = async (
  commands: Command[]
): Promise<Command | string> => {
  const choices = commands.map((command, index) => ({
    name: `${index + 1}. ${command.name} - ${command.description}`,
    value: command,
  }));

  const questions = [
    {
      choices: [...choices, new inquirer.Separator(), "Exit"],
      message: "What would you like to do?",
      name: "command",
      type: "list",
    },
  ];

  const { command } = await inquirer.prompt(questions);

  return command;
};

const runCommand = async (command: Command | string) => {
  if (typeof command === "string") {
    console.log("Exiting program. See ya later! 👋");

    process.exit(0);
  }

  const rootDir = process.cwd();
  const commandFilePath = path.join(
    rootDir,
    `dev/commands/${command.filename}`
  );

  console.log(commandFilePath);

  if (!fs.existsSync(commandFilePath)) {
    console.error(`Command file not found: ${command.filename}`);
    process.exit(1);
  }

  try {
    const commandModule = await import(commandFilePath);

    commandModule.run();
  } catch (error) {
    console.error(
      `Error loading or executing command file: ${command.filename}`
    );
    console.error(error);
  }
};

export const runStoreScript = async (commands: Command[]) => {
  const selectedCommand = await promptForCommand(commands);
  await runCommand(selectedCommand);
};
