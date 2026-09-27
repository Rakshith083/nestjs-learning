import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import express from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../inerfaces/paginated-interface';

@Injectable()
export class PaginationProvider {

    constructor(
        @Inject(REQUEST)
        private readonly request: express.Request,
    ) { }

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQuery: PaginationQueryDto,
        repository: Repository<T>): Promise<Paginated<T>> {
        const page = paginationQuery?.page ?? 1;
        const limit = paginationQuery?.limit ?? 10;
        const results = await repository.find({
            take: limit,
            skip: ((page - 1) * limit)
        });

        const baseUrl = this.request.protocol + "://" + this.request.host + "/"
        const newUrl = new URL(this.request.url, baseUrl);
        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems / limit);
        const nextPage = page === totalPages ? page : page + 1;
        const prevPage = page === 1 ? page : page - 1;
        const finalResponse: Paginated<T> = {
            data: results,
            meta: {
                itemsPerPage: limit,
                totalItems: totalItems,
                currentPage: page,
                totalPages: totalPages
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${1}`,
                last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
                current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
                next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
                previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${prevPage}`,
            }
        }
        return finalResponse;
    }
}
