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
	incomingSingleMessage: string;
	onMessagePlayed: () => void;
	loading: boolean;
}

const chatContextInitialState: ChatContextProps = {
	chat: async () => {},
	incomingSingleMessage: '',
	onMessagePlayed: () => {},
	loading: false,
};

const ChatContext = createContext<ChatContextProps>(chatContextInitialState);

type ChatProviderProps = PropsWithChildren;

export const ChatProvider: FC<ChatProviderProps> = ({ children }) => {
	const [incomingMessages, setIncomingMessages] = useState<string[]>([]);
	const [incomingSingleMessage, setIncomingSingleMessage] =
		useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const onMessagePlayed = () => {
		setIncomingMessages((messages) => messages.slice(1));
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

		setIncomingMessages((messages) => [...messages, ...resp]);
		setLoading(false);
	};

	useEffect(() => {
		if (incomingMessages.length > 0) {
			setIncomingSingleMessage(incomingMessages[0]);
		} else {
			setIncomingSingleMessage('');
		}
	}, [incomingMessages]);

	return (
		<ChatContext.Provider
			value={{
				chat,
				incomingSingleMessage,
				onMessagePlayed,
				loading,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);
