import Image from "next/image";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <Image
        src="/loginBG.png"
        alt="Background"
        fill
        priority
        className="object-cover blur-xs pointer-events-none"
        quality={25}
      />
    </div>
  );
}
