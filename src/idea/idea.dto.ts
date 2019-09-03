import { IsString, IsNotEmpty } from 'class-validator';
export class IdeaDTO {
  @IsString()
  @IsNotEmpty()
  idea: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
