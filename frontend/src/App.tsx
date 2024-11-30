import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components";

const App = () =>
  <>
    <Loader />
    <Leva hidden />
    <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
      <Experience />
    </Canvas>
  </>

export default App