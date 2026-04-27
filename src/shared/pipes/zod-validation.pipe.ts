import {PipeTransform, Injectable, BadRequestException, ArgumentMetadata} from "@nestjs/common"
import { error } from "console"
import type { ZodSchema } from "zod/v4"

@Injectable()
export class ZodValidationPipe implements PipeTransform{
    constructor (private schema: ZodSchema){}

    transform(value: unknown, metadata: ArgumentMetadata) {
        const result = this.schema.safeParse(value)

        if(!result.success){
            const errors = result.error.flatten();
            throw new BadRequestException({
                message: "Validation Failed",
                errors: errors.fieldErrors
            })
        }

        return result.data

    }
}