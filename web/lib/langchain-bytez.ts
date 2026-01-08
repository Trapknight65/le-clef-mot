import { BaseChatModel, BaseChatModelParams } from "@langchain/core/language_models/chat_models";
import { BaseMessage, AIMessage } from "@langchain/core/messages";
import { ChatResult, ChatGeneration } from "@langchain/core/outputs";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { bytezSDK } from "@/lib/bytez";

export interface BytezChatInput extends BaseChatModelParams {
    modelId: string;
}

export class BytezChatModel extends BaseChatModel {
    modelId: string;

    constructor(fields: BytezChatInput) {
        super(fields);
        this.modelId = fields.modelId;
    }

    _llmType(): string {
        return "bytez";
    }

    async _generate(
        messages: BaseMessage[],
        options: this["ParsedCallOptions"],
        runManager?: CallbackManagerForLLMRun
    ): Promise<ChatResult> {
        const model = bytezSDK.model(this.modelId);

        // Convert LangChain messages to a prompt string
        let fullPrompt = "";
        for (const msg of messages) {
            const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);

            if (msg._getType() === "system") {
                fullPrompt += `System: ${content}\n`;
            } else if (msg._getType() === "human") {
                fullPrompt += `User: ${content}\n`;
            } else if (msg._getType() === "ai") {
                fullPrompt += `Assistant: ${content}\n`;
            }
        }
        fullPrompt += "Assistant:";

        try {
            const { error, output } = await model.run(fullPrompt);

            if (error) {
                throw new Error(`Bytez API Error: ${error}`);
            }

            let textOutput = "";
            if (typeof output === 'string') textOutput = output;
            else if (output && typeof output === 'object') {
                if ('text' in output) textOutput = (output as any).text;
                else if ('generated_text' in output) textOutput = (output as any).generated_text;
                else textOutput = JSON.stringify(output);
            } else {
                textOutput = JSON.stringify(output);
            }

            const generation: ChatGeneration = {
                text: textOutput,
                message: new AIMessage(textOutput),
            };

            return {
                generations: [generation],
            };

        } catch (e) {
            console.error("Bytez LangChain Call Failed:", e);
            throw e;
        }
    }
}
