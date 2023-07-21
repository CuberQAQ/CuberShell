import net from "net";
import fs, { read } from "fs";
import readline from "readline";
let config = JSON.parse(
  fs.readFileSync("./config.json", {
    encoding: "utf-8",
  })
);

let client = net.createConnection(
  {
    port: config.port,
  },
  () => {
    console.log("Connection Success!\n");
  }
);

let rc = readline.createInterface(process.stdin, process.stdout);

rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});
rc.question("Input a command: ", (answer) => {client.write(answer)});

