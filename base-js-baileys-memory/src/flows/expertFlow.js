// src/flows/expertFlow.js
import { addKeyword } from '@builderbot/bot';
import treatments from '../data.js';

const expertFlow = addKeyword(['tratamiento', 'pregunta sobre tratamientos']).addAnswer(
    'Por favor, dígame el nombre del tratamiento sobre el que tiene preguntas.',
    { capture: true },
    async (ctx, { flowDynamic }) => {
        const query = ctx.body.toLowerCase();
        const tratamiento = treatments.find(t => t.name.toLowerCase() === query);

        if (tratamiento) {
            let response = `Información sobre ${tratamiento.name}:\n\nDescripción: ${tratamiento.description}\n\n`;
            tratamiento.faqs.forEach(faq => {
                response += `Pregunta: ${faq.question}\nRespuesta: ${faq.answer}\n\n`;
            });
            await flowDynamic(response);
        } else {
            await flowDynamic('Lo siento, no tengo información sobre ese tratamiento.');
        }
    }
);

export default expertFlow;
