import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
}



const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "fire-tempy",
      description: "a simple script to have a temperature conversion between celsius & fahrenheit",
      author: "miawgogo",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {};
  },
  run: (runRequest) => {
    const { logger } = runRequest.modules;
    const tempre = /([0-9]*)\s?([cfCF])/;

    let userCMD = runRequest.trigger.metadata.userCommand.args.join(" ");
    logger.debug(userCMD);
    let og_msg = runRequest.trigger.metadata.chatMessage;
    if (!tempre.test(userCMD)){
      runRequest.modules.twitchChat.sendChatMessage("You need to put in a temperature like !temp 32f", null, null, og_msg.id);
      return;
    }

    let regex_results = tempre.exec(userCMD);
    logger.debug(regex_results.toString())
    
    let temp = parseInt(regex_results.at(1))
    let unit = regex_results.at(2)

    let result = 0.0;
    let out_unit = ""

    if (unit.toLowerCase() == "c"){
      result = (temp * 9/5) + 32;
      out_unit = "°F"
    }else if (unit.toLowerCase() == "f") {
      result = (temp - 32.0) * 5/9;
      out_unit = "°C";
    }else{
      runRequest.modules.twitchChat.sendChatMessage("thats not a temperature i can convert", null, null, og_msg.id);
      return;
    }

    runRequest.modules.twitchChat.sendChatMessage(`${result} ${out_unit}`, null, null, og_msg.id);

  },
};

export default script;
