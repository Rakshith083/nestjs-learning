export interface Paginated<T> {
    meta: {
        itemsPerPage: number,
        totalItems: number,
        currentPage: number,
        totalPages: number
    },
    links: {
        first: string,
        last: string,
        current: string,
        next: string,
        previos: string
    },
    data: T[]
}