import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
    const paginationItems = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

        const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
        const validPages = Array.from(pages).filter((p) => p > 0 && p <= totalPages).sort((a, b) => a - b)

        const items: Array<number | 'ellipsis'> = []
        validPages.forEach((page, index) => {
            items.push(page)
            const next = validPages[index + 1]
            if (next && next - page > 1) items.push('ellipsis')
        })

        return items
    }, [currentPage, totalPages])


    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return
        onPageChange(page)
    }

    return (
        <nav className={`mt-10 flex flex-wrap items-center justify-center gap-1 ${className ?? ''}`}>
            <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="grid cursor-pointer place-items-center rounded border border-slate-300 bg-slate-100 p-1 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft className="size-3.5" />
            </button>

            {paginationItems.map((item, index) =>
                item === 'ellipsis' ? (
                    <span key={`e-${index}`} className="grid h-7 min-w-7 place-items-center text-sm text-description">
                        ...
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        onClick={() => handlePageChange(item)}
                        className={`grid place-items-center rounded border px-2.5 py-1.5 text-sm font-medium transition ${item === currentPage
                            ? 'border-heading bg-blue-500 text-white'
                            : 'border-slate-300 bg-slate-100 text-description hover:bg-white'
                            }`}
                    >
                        {item}
                    </button>
                )
            )}

            <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="grid cursor-pointer place-items-center rounded border border-slate-300 bg-slate-100 p-1 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronRight className="size-3.5" />
            </button>
        </nav>
    )
}

export default Pagination