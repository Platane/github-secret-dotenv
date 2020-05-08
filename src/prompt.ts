import chalk from "chalk";
import readline from "readline";
// @ts-ignore
import ScreenManager from "@inquirer/core/lib/screen-manager";
// @ts-ignore
import MuteStream from "mute-stream";
import { dots as spinner } from "cli-spinners";

/**
 * use inquirer ScreenManager to create an animated prompt
 */
export const createPrompt = () => {
  const input = new MuteStream();
  const output = new MuteStream();
  output.pipe(process.stdout);

  const rl = readline.createInterface({ terminal: true, input, output });
  const screen = new ScreenManager(rl);

  let state: State = { items: [] };

  let tick = 0;

  const getSpinner = () => spinner.frames[tick % spinner.frames.length];

  const loop = () => {
    tick++;
    screen.render(render(state, getSpinner()));
  };
  let interval = setInterval(loop, spinner.interval);

  const update = (s: State) => {
    state = s;
    screen.render(render(state, getSpinner()));
  };

  const dispose = () => {
    clearInterval(interval);
    screen.done();
  };

  return { update, dispose };
};

const render = (state: State, spinner: string) =>
  state.items
    .map(({ status, action, name, error }) => {
      let statusIcon = "";
      if (status === "done") statusIcon = chalk.green("✔");
      if (status === "pending") statusIcon = chalk.yellow(spinner);
      if (status === "error") statusIcon = chalk.red("×");

      let verb = "";
      if (action === "remove" && status === "done") verb = "removed";
      if (action === "remove" && status === "pending") verb = "removing";
      if (action === "set" && status === "done") verb = "updated";
      if (action === "set" && status === "pending") verb = "";

      return `  ${statusIcon}  ${name}   ${
        error ? "⚠️  " + error.message : chalk.yellow(verb)
      }`;
    })
    .join("\n");

type Item = (
  | {
      action: "set";
      value: string;
    }
  | { action: "remove" }
) & {
  name: string;
  status: "pending" | "done" | "error";
  error?: Error;
};

export type State = {
  items: Item[];
};
