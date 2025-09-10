import Image from 'next/image';

export default function Background() {
    return (
        <Image
            src="/loginBG.png"
            alt="Background"
            fill
            priority
            className="object-cover z-[-1] blur-xs"
            quality={25}
        />
    );
}