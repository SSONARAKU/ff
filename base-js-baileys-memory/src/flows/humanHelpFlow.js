// src/flows/humanHelpFlow.js
import { addKeyword } from '@builderbot/bot';

const humanHelpFlow = addKeyword(['necesito hablar con un humano', 'ayuda humana', 'atención humana'])
    .addAction(async (ctx, { flowDynamic, state }) => {
        console.log(`Notificación: El usuario ${ctx.from} necesita atención humana.`);

        await state.update({ humanHelp: true });

        await flowDynamic('Su solicitud ha sido recibida. Un humano le atenderá pronto.');
    });

export default humanHelpFlow;
