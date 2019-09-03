import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        'Validation Failed: NO CONTENT SUBMITTED',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!metatype || this.isValueTypeValid(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        `Validation Failed: ${this.formatErrors(errors).toUpperCase()}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private isValueTypeValid(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !!types.includes(metatype);
  }

  private formatErrors(errors: any[]): string {
    return errors
      .map(err => {
        for (let property in err.constraints) {
          return err.constraints[property];
        }
      })
      .join(', ');
  }

  private isEmpty(object: Object) {
    return Object.keys(object).length > 0 ? false : true;
  }
}
