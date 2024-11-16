import Link from "next/link";
import Image from "next/image";

const Logo = () => (
    <div className="flex">
        <Link href="/#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Image
                src='/logo2.png'
                alt="Acme Inc Logo"
                width={120}
                height={120}
                className="h-24 w-24"
                priority
            />
            <span className="font-roboto font-black text-white text-[6vw] sm:text-[5vw] md:text-[3vw]">Singapur</span>
        </Link>
    </div>
);

export default Logo;
