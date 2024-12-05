import { FC, PropsWithChildren, useCallback, useState } from 'react';

import './UI.css';
import { useChat } from '@app/hooks';

export const UI: FC<PropsWithChildren> = () => {
	const { chat, incomingSingleMessage: message, loading } = useChat();
	const [inputUserMessage, setInputUserMessage] = useState('');

	const sendMessage = useCallback(() => {
		if (!loading && !message) {
			chat(inputUserMessage);
			setInputUserMessage('');
		}
	}, [chat, inputUserMessage, loading, message]);

	return (
		<div className="chat-container">
			<input
				type="text"
				className="chat-input"
				placeholder="Type a message..."
				value={inputUserMessage}
				onChange={(event) => {
					setInputUserMessage(event.currentTarget.value);
				}}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						sendMessage();
					}
				}}
			/>
			<button
				className="chat-button"
				disabled={loading || Boolean(message)}
				onClick={sendMessage}
			>
				Send
			</button>
		</div>
	);
};
