import { IsString } from 'class-validator';

export class commentDTO {
  @IsString()
  comment: string;

  created: Date;
  updated: Date;
}
