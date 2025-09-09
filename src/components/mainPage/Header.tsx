import Image from "next/image";

export default function Header() {
  return (
    <div className="flex items-center">
      <Image
        src="/flowIcon.png"
        alt="Flow Manager Logo"
        width={70}
        height={70}
        className="object-contain"
        priority
      />
      <h1 className="text-4xl font-semibold tracking-tight text-gray-700">
        Flow Manager
      </h1>
    </div>
  );
}