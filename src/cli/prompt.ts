import readline from "readline";
import type IScreenManager from "inquirer/lib/utils/screen-manager";
// @ts-ignore
import ScreenManager from "@inquirer/core/lib/screen-manager";
import MuteStream from "mute-stream";
import cliSpinners from "cli-spinners";

const spinner = cliSpinners.dots;

/**
 * use inquirer ScreenManager to create an animated prompt
 */
export const createPrompt = (render: (spinner: string) => string) => {
  const input = new MuteStream();
  const output = new MuteStream();
  output.pipe(process.stdout);

  const rl = readline.createInterface({ terminal: true, input, output });
  const screen: IScreenManager = new ScreenManager(rl);

  let tick = 0;

  const getSpinner = () => spinner.frames[tick % spinner.frames.length];

  const loop = () => {
    tick++;
    screen.render(render(getSpinner()), "");
  };
  let interval = setInterval(loop, spinner.interval);

  const update = () => screen.render(render(getSpinner()), "");

  const dispose = () => {
    clearInterval(interval);
    screen.done();
  };

  return { update, dispose };
};
