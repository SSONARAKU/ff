import { addKeyword, EVENTS } from '@builderbot/bot';
import { connectDB } from '../database.js';

const welcomeFlow = addKeyword([EVENTS.WELCOME]).addAction(async (ctx, { state, flowDynamic }) => {
    const userId = ctx.from;

    const db = await connectDB();
    const userInfo = await db.collection('users').findOne({ userId });

    if (!userInfo) {
        await flowDynamic('Bienvenido, por favor proporciona tu nombre:');
        state.update({ step: 'name' });
    } else {
        await flowDynamic(`Hola de nuevo, ${userInfo.name}. ¿En qué puedo ayudarte hoy?`);
    }
});

const nameFlow = addKeyword([EVENTS.MESSAGE]).addAnswer(
    async (ctx, { state, flowDynamic }) => {
        if (state.get('step') === 'name') {
            const name = ctx.body;
            state.update({ name, step: 'email' });
            await flowDynamic('Gracias. Ahora, por favor proporciona tu correo electrónico:');
        }
    }
);

const emailFlow = addKeyword([EVENTS.MESSAGE]).addAnswer(
    async (ctx, { state, flowDynamic }) => {
        if (state.get('step') === 'email') {
            const email = ctx.body;
            const name = state.get('name');
            const userId = ctx.from;

            const db = await connectDB();
            await db.collection('users').updateOne({ userId }, { $set: { name, email } }, { upsert: true });

            await flowDynamic(`Gracias, ${name}. Tu correo electrónico (${email}) ha sido guardado.`);
            state.clear();
        }
    }
);

export default [welcomeFlow, nameFlow, emailFlow];
