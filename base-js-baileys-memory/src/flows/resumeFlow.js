// src/flows/resumeFlow.js
import { addKeyword } from '@builderbot/bot';

const resumeFlow = addKeyword(['reanudarse'])
    .addAction(async (ctx, { flowDynamic, state }) => {
        await state.update({ humanHelp: false });

        await flowDynamic('La interacción automatizada ha sido reanudada.');
    });

export default resumeFlow;
