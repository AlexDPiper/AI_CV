import {
	createContext,
	FC,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ChatContextProps {
	chat: (message: string) => Promise<void>;
	message: string;
	onMessagePlayed: () => void;
	loading: boolean;
	// cameraZoomed: boolean
	// setCameraZoomed: React.Dispatch<React.SetStateAction<boolean>>
}

const chatContextInitialState = {
	chat: async () => {},
	message: '',
	onMessagePlayed: () => {},
	loading: false,
};

const ChatContext = createContext<ChatContextProps>(chatContextInitialState);

type ChatProviderProps = PropsWithChildren;

export const ChatProvider: FC<ChatProviderProps> = ({ children }) => {
	const [messages, setMessages] = useState<string[]>([]);
	const [message, setMessage] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	// const [cameraZoomed, setCameraZoomed] = useState<boolean>(true);

	const onMessagePlayed = () => {
		setMessages((messages) => messages.slice(1));
	};

	const chat = async (message: string) => {
		setLoading(true);

		const data = await fetch(`${backendUrl}/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ message }),
		});

		const resp = (await data.json()).messages;

		setMessages((messages) => [...messages, ...resp]);
		setLoading(false);
	};

	useEffect(() => {
		if (messages.length > 0) {
			setMessage(messages[0]);
		} else {
			setMessage('');
		}
	}, [messages]);

	return (
		<ChatContext.Provider
			value={{
				chat,
				message,
				onMessagePlayed,
				loading,
				// cameraZoomed,
				// setCameraZoomed,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => useContext(ChatContext);
