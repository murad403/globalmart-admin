import Messages from '@/components/shared/Messages'
import PageHeader from '@/components/shared/PageHeader'
import React from 'react'


type MessagePageProps = {
    searchParams?: Promise<{
        reseller?: string
    }>
}

const page = async ({ searchParams }: MessagePageProps) => {
    const resolvedSearchParams = (await searchParams) ?? {}
    const preselectedReseller = resolvedSearchParams.reseller

    return (
        <div className="space-y-4 sm:space-y-5">
            <PageHeader title='Message' description='Message with Wholesaler and Reseller'/>
            <Messages preselectedReseller={preselectedReseller} />
        </div>
    )
}

export default page
