import React from 'react'

const SellerPageHeader = ({ title, description }: { title: string; description: string }) => {
    return (
        <header>
            <h1 className="text-2xl md:text-3xl font-bold text-title">{title}</h1>
            <p className="mt-1 text-description text-sm md:text-base">{description}</p>
        </header>
    )
}

export default SellerPageHeader

