import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='min-h-screen flex justify-center items-center'>
            <div className='w-full max-w-2xl'>
                {children}
            </div>
        </div>
    )
}

export default layout
