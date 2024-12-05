import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { Experience, UI } from '@app/components';

const App = () => (
	<>
		<Loader />
		<UI />
		<Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
			<Experience />
		</Canvas>
	</>
);

export default App;
