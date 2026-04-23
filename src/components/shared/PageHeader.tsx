import React from "react"

const SellerPageHeader = ({
    title,
    description,
}: {
    title: string
    description: string
}) => {
    return (
        <header>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[28px]">
                {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 md:text-base">{description}</p>
        </header>
    )
}

export default SellerPageHeader

