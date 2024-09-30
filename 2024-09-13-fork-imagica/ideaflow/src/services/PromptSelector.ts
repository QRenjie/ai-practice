import { ChatComponentType } from "@/context/WorkspaceContext";
import prompts from "../../config/prompts.json";
import { ApiMessage } from "@/types/apiTypes";

export class PromptSelector {
  static getPrompt(componentType?: ChatComponentType): ApiMessage {
    const content = componentType === "react" ? prompts.coderNextjs : prompts.coderHTML;
    return {
      role: "system",
      content,
    };
  }
}