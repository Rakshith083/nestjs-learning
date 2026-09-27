import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing-provider';
import bcrypt from "bcrypt";

@Injectable()
export class BcryptProvider implements HashingProvider {
    public hashPassword(data: string | Buffer): string {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(data, salt);
        return hash;
    }

    comparePassword(data: string | Buffer, encrypted: string): boolean {
        return bcrypt.compareSync(data, encrypted);
    }
}
