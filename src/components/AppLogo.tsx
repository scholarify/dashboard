import Image from "next/image";

interface AppLogoProps {
    className?: string;
    logoSrc: string;
    logoAlt: string;
}

export default function AppLogo({ className, logoSrc, logoAlt }: AppLogoProps) {
    return (
        <div className={className}>
            <div className="flex justify-center py-6">
                <Image src={logoSrc} alt={logoAlt} width={200} height={200} />
            </div>
        </div>
    )
}