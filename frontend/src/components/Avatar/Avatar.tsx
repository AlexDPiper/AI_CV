import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
	Group,
	MathUtils,
	Object3D,
	Object3DEventMap,
	SkinnedMesh,
} from 'three';

import { GLTFResult } from './types';

const facialExpressions: Record<string, { [key: string]: number }> = {
	default: {},
	smile: {
		browInnerUp: 0.17,
		eyeSquintLeft: 0.4,
		eyeSquintRight: 0.44,
		noseSneerLeft: 0.1700000727403593,
		noseSneerRight: 0.14000002836874015,
		mouthPressLeft: 0.61,
		mouthPressRight: 0.41000000000000003,
	},
	funnyFace: {
		jawLeft: 0.63,
		mouthPucker: 0.53,
		noseSneerLeft: 1,
		noseSneerRight: 0.39,
		mouthLeft: 1,
		eyeLookUpLeft: 1,
		eyeLookUpRight: 1,
		cheekPuff: 0.9999924982764238,
		mouthDimpleLeft: 0.414743888682652,
		mouthRollLower: 0.32,
		mouthSmileLeft: 0.35499733688813034,
		mouthSmileRight: 0.35499733688813034,
	},
	sad: {
		mouthFrownLeft: 1,
		mouthFrownRight: 1,
		mouthShrugLower: 0.78341,
		browInnerUp: 0.452,
		eyeSquintLeft: 0.72,
		eyeSquintRight: 0.75,
		eyeLookDownLeft: 0.5,
		eyeLookDownRight: 0.5,
		jawForward: 1,
	},
	surprised: {
		eyeWideLeft: 0.5,
		eyeWideRight: 0.5,
		jawOpen: 0.351,
		mouthFunnel: 1,
		browInnerUp: 1,
	},
	crazy: {
		browInnerUp: 0.9,
		jawForward: 1,
		noseSneerLeft: 0.5700000000000001,
		noseSneerRight: 0.51,
		eyeLookDownLeft: 0.39435766259644545,
		eyeLookUpRight: 0.4039761421719682,
		eyeLookInLeft: 0.9618479575523053,
		eyeLookInRight: 0.9618479575523053,
		jawOpen: 0.9618479575523053,
		mouthDimpleLeft: 0.9618479575523053,
		mouthDimpleRight: 0.9618479575523053,
		mouthStretchLeft: 0.27893590769016857,
		mouthStretchRight: 0.2885543872656917,
		mouthSmileLeft: 0.5578718153803371,
		mouthSmileRight: 0.38473918302092225,
		tongueOut: 0.9618479575523053,
	},
};

const visemesMap = {
	A: 'viseme_PP',
	B: 'viseme_kk',
	C: 'viseme_I',
	D: 'viseme_AA',
	E: 'viseme_O',
	F: 'viseme_U',
	G: 'viseme_FF',
	H: 'viseme_TH',
	X: 'viseme_PP',
};

type AvatarProps = JSX.IntrinsicElements['group'];

export const Avatar: FC<AvatarProps> = (props) => {
	const { nodes, materials, scene } = useGLTF(
		'/models/674a4cb0565cd4473b6688b9.glb'
	) as GLTFResult;

	const { animations } = useGLTF('/models/animations.glb');

	const groupRef = useRef<Group<Object3DEventMap>>(null);

	const { actions } = useAnimations(animations, groupRef);

	const initialAnimation = useMemo(
		() =>
			animations.find(({ name }) => name === 'Idle')
				? 'Idle'
				: animations[0].name,
		[animations]
	);

	const [animation, setAnimation] = useState(initialAnimation);

	useEffect(() => {
		actions[animation]?.reset().fadeIn(0.5).play();

		return () => {
			actions[animation]?.fadeOut(0.5);
		};
	}, [animation]);

	const [blink, setBlink] = useState(false);
	const [facialExpressionName, setFacialExpressionName] = useState('');

	useEffect(() => {
		let blinkTimeout: number;

		const nextBlink = () => {
			blinkTimeout = setTimeout(
				() => {
					setBlink(true);
					setTimeout(() => {
						setBlink(false);
						nextBlink();
					}, 200);
				},
				MathUtils.randInt(1000, 5000)
			);
		};

		nextBlink();

		return () => clearTimeout(blinkTimeout);
	}, []);

	const lerpMorphTarget = useCallback(
		(target: string, value: number, speed = 0.1) => {
			scene.traverse((child: Object3D<Object3DEventMap>) => {
				if (child instanceof SkinnedMesh) {
					if (child.isSkinnedMesh && child.morphTargetDictionary) {
						const index = child.morphTargetDictionary[target];
						if (
							index === undefined ||
							child.morphTargetInfluences?.[index] === undefined
						) {
							return;
						}

						child.morphTargetInfluences[index] = MathUtils.lerp(
							child.morphTargetInfluences?.[index],
							value,
							speed
						);
					}
				}
			});
		},
		[scene]
	);

	useFrame(() => {
		if (nodes.EyeLeft.morphTargetDictionary) {
			Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
				const mapping = facialExpressions[facialExpressionName];
				if (key === 'eyeBlinkLeft' || key === 'eyeBlinkRight') {
					return;
				}
				if (mapping && mapping[key]) {
					lerpMorphTarget(key, mapping[key], 0.1);
				} else {
					lerpMorphTarget(key, 0, 0.1);
				}
			});
		}

		lerpMorphTarget('eyeBlinkLeft', blink ? 1 : 0, 0.5);
		lerpMorphTarget('eyeBlinkRight', blink ? 1 : 0, 0.5);
	});

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
