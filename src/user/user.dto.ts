import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { IdeaEntity } from '../idea/idea.entity';

export class UserDTO {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;
}

export class UserRO {
  id: string;
  username: string;
  created: Date;
  updated: Date;
  token?: string;
  ideas?: IdeaEntity[];
  bookmarks?: IdeaEntity[];
}
