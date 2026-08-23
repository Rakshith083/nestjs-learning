import { IsDate, IsOptional } from "class-validator";
import { IntersectionType } from "node_modules/@nestjs/swagger/dist/type-helpers/intersection-type.helper";
import { PaginationQueryDto } from "src/modules/common/dtos/pagination-query.dto";


class GetPostsBaseDto {
    @IsDate()
    @IsOptional()
    startDate?: Date;

    @IsDate()
    @IsOptional()
    endDate?: Date;
}

export class GetPostsDTO extends IntersectionType(
    GetPostsBaseDto,
    PaginationQueryDto
) { }