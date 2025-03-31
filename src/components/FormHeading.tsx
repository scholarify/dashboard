
interface FormHeadingProps {
    title: string;
    subtitle: string;
    formIcon?: React.ReactNode; // Pour passer une icône SVG ou autre

}

export default function FormHeading({ title, subtitle, formIcon, ...props}: FormHeadingProps ) {
    return (
        <div className="">
            <div className="flex justify-center mb-4">
                {formIcon && (
                    <div className="flex justify-center mb-4">
                        {formIcon}
                    </div>
                )}

            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-[#17B890] mb-2">{title} </h2>
            <p className="text-center dark:text-gray-500 mb-6">{subtitle} </p>
        </div>
    )
}