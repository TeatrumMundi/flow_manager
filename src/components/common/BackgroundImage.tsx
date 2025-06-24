import Image from "next/image";

export default function BackgroundImage() {
  return (
    <Image
      src="/loginBG.png"
      alt="Background"
      fill
      priority
      className="object-cover z-[-1]"
      quality={100}
    />
  );
}