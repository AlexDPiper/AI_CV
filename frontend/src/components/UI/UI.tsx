import { FC, PropsWithChildren, useCallback, useState } from 'react';

import './UI.css';
import { useChat } from '@app/hooks';

export const UI: FC<PropsWithChildren> = () => {
	const { chat, message, loading } = useChat();
	const [inputMessage, setInputMessage] = useState('');

	const sendMessage = useCallback(() => {
		if (!loading && !message) {
			chat(inputMessage);
			setInputMessage('');
		}
	}, [chat, inputMessage, loading, message]);

	return (
		<div className="chat-container">
			<input
				type="text"
				className="chat-input"
				placeholder="Type a message..."
				value={inputMessage}
				onChange={(event) => {
					setInputMessage(event.currentTarget.value);
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
