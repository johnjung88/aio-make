import { Composition } from "remotion";
import { BrandShortsProof } from "./videos/brand-shorts-proof";
import { BlogAutoPilotProof } from "./videos/blogautopilot-proof";
import { VAioAdminProof } from "./videos/v-aio-admin-proof";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="BlogAutoPilotProof"
        component={BlogAutoPilotProof}
        durationInFrames={1080}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="VAioAdminProof"
        component={VAioAdminProof}
        durationInFrames={812}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="BrandShortsProof"
        component={BrandShortsProof}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
