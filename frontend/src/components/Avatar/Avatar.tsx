import { useAnimations, useGLTF } from '@react-three/drei';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Object3DEventMap } from 'three';

import { GLTFResult } from './types';

type AvatarProps = JSX.IntrinsicElements['group'];

export const Avatar: FC<AvatarProps> = (props) => {
	const { nodes, materials } = useGLTF(
		'/models/674a4cb0565cd4473b6688b9.glb'
	) as GLTFResult;

	const { animations } = useGLTF('/models/animations.glb');

	const groupRef = useRef<Group<Object3DEventMap>>(null);

	const { actions, mixer } = useAnimations(animations, groupRef);

	const initialAnimation = useMemo(
		() =>
			animations.find(({ name }) => name === 'Idle')
				? 'Idle'
				: animations[0].name,
		[animations]
	);

	const [animation, setAnimation] = useState(animations[8].name);

	useEffect(() => {
		actions[animation]?.reset().fadeIn(0.5).play();

		return () => {
			actions[animation]?.fadeOut(0.5);
		};
	}, [animation]);

	return (
		<group {...props} dispose={null} ref={groupRef}>
			<primitive object={nodes.Hips} />
			<skinnedMesh
				geometry={nodes.Wolf3D_Glasses.geometry}
				material={materials.Wolf3D_Glasses}
				skeleton={nodes.Wolf3D_Glasses.skeleton}
			/>
			<skinnedMesh
				geometry={nodes.Wolf3D_Body.geometry}
				material={materials.Wolf3D_Body}
				skeleton={nodes.Wolf3D_Body.skeleton}
			/>
			<skinnedMesh
				geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
				material={materials.Wolf3D_Outfit_Bottom}
				skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
			/>
			<skinnedMesh
				geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
				material={materials.Wolf3D_Outfit_Footwear}
				skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
			/>
			<skinnedMesh
				geometry={nodes.Wolf3D_Outfit_Top.geometry}
				material={materials.Wolf3D_Outfit_Top}
				skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
			/>
			<skinnedMesh
				name="EyeLeft"
				geometry={nodes.EyeLeft.geometry}
				material={materials.Wolf3D_Eye}
				skeleton={nodes.EyeLeft.skeleton}
				morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
				morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
			/>
			<skinnedMesh
				name="EyeRight"
				geometry={nodes.EyeRight.geometry}
				material={materials.Wolf3D_Eye}
				skeleton={nodes.EyeRight.skeleton}
				morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
				morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
			/>
			<skinnedMesh
				name="Wolf3D_Head"
				geometry={nodes.Wolf3D_Head.geometry}
				material={materials.Wolf3D_Skin}
				skeleton={nodes.Wolf3D_Head.skeleton}
				morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
				morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
			/>
			<skinnedMesh
				name="Wolf3D_Teeth"
				geometry={nodes.Wolf3D_Teeth.geometry}
				material={materials.Wolf3D_Teeth}
				skeleton={nodes.Wolf3D_Teeth.skeleton}
				morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
				morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
			/>
			<skinnedMesh
				name="Wolf3D_Beard"
				geometry={nodes.Wolf3D_Beard.geometry}
				material={materials.Wolf3D_Beard}
				skeleton={nodes.Wolf3D_Beard.skeleton}
				morphTargetDictionary={nodes.Wolf3D_Beard.morphTargetDictionary}
				morphTargetInfluences={nodes.Wolf3D_Beard.morphTargetInfluences}
			/>
		</group>
	);
};

useGLTF.preload('/models/674a4cb0565cd4473b6688b9.glb');
