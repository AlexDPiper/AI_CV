import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/chat/completions';

interface Answer {
	text: string;
	audio: string;
	lipsync: string;
	facialExpression: string;
	animation: string;
}

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = process.env.VOICE_ID;

const port = process.env.PORT || 3001;

const app: Express = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
	res.send(`Server is running on ${port}`);
});

app.post('/chat', async (req: Request, res: Response) => {
	const userMessage = req.body.userMessage;
	const defaultAnswers: Answer[] = [];
	if (!userMessage) {
		res.send({
			messages: defaultAnswers,
		});
		return;
	}

	const completion: ChatCompletion = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo-1106',
		max_tokens: 100,
		temperature: 0.3,
		response_format: {
			type: 'json_object',
		},
		messages: [
			{
				role: 'system',
				content: `
            You are a virtual middle level frontend developer.
            You will always reply with a JSON array of messages. With a maximum of 3 messages.
            Each message has a text, facialExpression, and animation property.
            The different facial expressions are: smile, sad, surprised, and default.
            The different animations are: Talking_0, Talking_1, Talking_2, Laughing, Idle. 
            `,
			},
			{
				role: 'user',
				content: userMessage || 'Hello',
			},
		],
	});
});

app.listen(port, () => {
	console.log(`Server is running on ${port}`);
});
