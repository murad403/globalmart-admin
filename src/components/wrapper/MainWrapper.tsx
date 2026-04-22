import React from 'react'
import AdminSidebar from '../shared/AdminSidebar'

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <AdminSidebar />
            {children}
        </div>
    )
}

export default MainWrapper
