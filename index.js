import { join } from "path";
import child_process from "child_process";
import fs from "fs";
import net from "net";
import chalk from "chalk";
var version = "1.0.0";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let config = JSON.parse(
  fs.readFileSync(join(__dirname, "./config.json"), {
    encoding: "utf-8",
  })
);

// 建立套接字服务器
let server = net.createServer((socket) => {
  console.log(
    "[控制台连接] 连接已建立:\nAddress: " +
      socket.localAddress +
      "\nPort: " +
      socket.localPort +
      "\n"
  );
  socket.setEncoding("utf-8");
  socket.setTimeout(500);
  socket.on("data", (data) => {
    console.log("[控制台连接] 远程执行:\n" + data.toString());
    analyseCommand(data.toString().trim()) ||
      (child ? child.stdin.write(data.toString() + "\n") : false);
  });
  socket.on("close", function () {
    console.log(
      "[控制台连接] 连接已关闭:\nAddress: " +
        socket.localAddress +
        "\nPort: " +
        socket.localPort +
        "\n"
    );
  });
  socket.on("error", function () {
    console.log(
      "[控制台连接] 连接已断开:\nAddress: " +
        socket.localAddress +
        "\nPort: " +
        socket.localPort +
        "\n"
    );
  });
});
server.listen(config.port, () => {
  console.log("Cuber Engine Shell v" + version);
  console.log("Server Listen on Port " + config.port + "\n");
  console.log("Starting BDS..." + "\n");
});

// 日志
function logger(str) {
  console.log("\n[CuberEngineShell] " + str + "\n");
  // if(child) {
  //   child.stdin.write('tellraw @a {"rawtext":[{"text":"' + str + '"}]}')
  // }
}

// 监听子进程退出后的执行脚本
let exitFuncs = {
  // Normal; auto_restart = true
  normal_autoRestart: () => {
    logger("BDS异常停止运行，将在一秒后重启...");
    setTimeout(() => {
      child = startBDS();
    }, 1000);
  },
  // Normal; auto_restart = false
  normal: () => {
    logger(
      "BDS异常停止运行！若要启用自动重启，请在config.json中将auto_restart值改为true。"
    );
  },
  command_$stop: () => {
    logger(
      "BDS已停止运行！(原因:$stop命令)\n可使用$start再次启动BDS。"
    );
  },
  command_$restart: () => {
    logger(
      "BDS已停止运行！(原因:$restart命令)\n一秒后将再次启动BDS。"
    );
  },
};

// 配置自动重启
var exitFunc = exitFuncs.normal;
if (config.auto_restart) {
  logger("崩服自动重启已启用！");
  exitFunc = exitFuncs.normal_autoRestart;
}
// 创建BDS子进程 建立stdin通信
var child = startBDS();
function startBDS() {
  let childProcess = child_process.spawn(config.bds_path, {
    stdio: [null, "inherit", "inherit"],
  });
  child = childProcess;
  childProcess.on("close", () => {
    exitFunc();
  });
  childProcess.on("error", () => {
    exitFunc();
  });
  return childProcess;
}

process.stdin.on("data", function (data) {
  analyseCommand(data.toString().trim()) ||
    (child ? child.stdin.write(data) : false);
});

/**
 * 自定义服务端指令
 * @param {string} input
 */
function analyseCommand(input) {
  if (input == "$stop") {
    exitFunc = exitFuncs.command_$stop;
    if (child) child.kill();
    else {
      logger("无法执行$stop：BDS未运行！");
    }
    child = null;
    return true;
  } else if (input == "$start") {
    if (child) {
      logger(
        "BDS已在运行！\n若出现异常情况，请使用$restart命令重启服务器"
      );
    } else {
      exitFunc = exitFuncs.normal;
      if (config.auto_restart) {
        logger("崩服自动重启已启用！");
        exitFunc = exitFuncs.normal_autoRestart;
      }
      child = startBDS();
    }
    return true;
  } else if (input == "$kill") {
    if (!child) {
      logger("无法kill进程：BDS未运行！");
    } else child.kill();
    return true
  } else if (input == "$restart") {
    if (child) {
      exitFunc = exitFuncs.command_$restart;
      child.kill();
      child = null;
    }
    setTimeout(() => {
      exitFunc = exitFuncs.normal;
      if (config.auto_restart) {
        logger("崩服自动重启已启用！");
        exitFunc = exitFuncs.normal_autoRestart;
      }
      child = startBDS();
    }, 1000);
    return true
  } else if (input == "$help") {
    logger("使用帮助：\n$start     启动BDS\n$restart   重启BDS\n$stop      停止BDS\n$help      查看帮助\n$kill      强制终止BDS运行(可能触发异常自动重启)")
    return true
  }
}
