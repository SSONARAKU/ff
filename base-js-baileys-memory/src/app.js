import 'dotenv/config';
import { createBot, createProvider, createFlow } from '@builderbot/bot';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
import { EmployeesClass } from "@builderbot-plugins/openai-agents";
import MongoDBAdapter from './mongodbAdapter.js';

import welcomeFlow from './flows/welcomeFlow.js';
import expertFlow from './flows/expertFlow.js';
import humanHelpFlow from './flows/humanHelpFlow.js';
import resumeFlow from './flows/resumeFlow.js';

const PORT = process.env.PORT ?? 3008;

const employeeInstance = new EmployeesClass({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo-16k",
    temperature: 0
});

employeeInstance.employees([
    {
        name: "EXPERT_AGENT",
        description: "Hello, my name is Leifer. I am the specialized person in charge of resolving your doubts about our chatbot course, which is developed with Node.js and JavaScript. This course is designed to facilitate sales automation in your business. I will provide concise and direct answers to maximize your understanding.",
        flow: "expertFlow",
    }
]);

const main = async () => {
    const dbAdapter = new MongoDBAdapter();
    await dbAdapter.init();

    const adapterFlow = createFlow([...welcomeFlow, expertFlow, humanHelpFlow, resumeFlow]);
    const adapterProvider = createProvider(Provider);

    const configBot = {
        flow: adapterFlow,
        provider: adapterProvider,
        database: dbAdapter,
    };

    const configExtra = {
        extensions: {
            employeesAddon: employeeInstance
        }
    };

    const { handleCtx, httpServer } = await createBot(configBot, configExtra);

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body;
            const textMessage = typeof message === 'string' ? message : JSON.stringify(message);
            await bot.sendMessage(number, textMessage, { media: urlMedia ?? null });
            return res.end('sended');
        })
    );

    httpServer(+PORT);
};

main();
