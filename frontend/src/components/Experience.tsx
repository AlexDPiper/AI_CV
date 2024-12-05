import {
	CameraControls,
	ContactShadows,
	Environment,
	Text,
} from '@react-three/drei';
import { FC, Suspense, useEffect, useRef, useState } from 'react';
import { useChat } from '@app/hooks';
import { Avatar } from './Avatar';

type DotsProps = JSX.IntrinsicElements['group'];

const Dots: FC<DotsProps> = (props) => {
	const { loading } = useChat();
	const [loadingText, setLoadingText] = useState('');

	useEffect(() => {
		if (loading) {
			const interval = setInterval(() => {
				setLoadingText((loadingText) => {
					if (loadingText.length > 2) {
						return '.';
					}
					return loadingText + '.';
				});
			}, 800);
			return () => clearInterval(interval);
		} else {
			setLoadingText('');
		}
	}, [loading]);
	if (!loading) return null;

	return (
		<group {...props}>
			<Text fontSize={0.14} anchorX={'left'} anchorY={'bottom'}>
				{loadingText}
				<meshBasicMaterial attach="material" color="black" />
			</Text>
		</group>
	);
};

export const Experience = () => {
	const cameraControls = useRef<CameraControls>(null);

	useEffect(() => {
		cameraControls.current?.setLookAt(0, 2, 2, 0, 1.5, 0);
	}, []);

	return (
		<>
			<CameraControls ref={cameraControls} />
			<Environment preset="sunset" />
			{/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
			<Suspense>
				<Dots position-y={1.75} position-x={-0.02} />
			</Suspense>
			<Avatar />
			<ContactShadows opacity={0.7} />
		</>
	);
};
