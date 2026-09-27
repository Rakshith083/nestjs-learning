import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
    abstract hashPassword(data: string | Buffer):string
    abstract comparePassword(data: string | Buffer, encrypted: string): boolean
}
