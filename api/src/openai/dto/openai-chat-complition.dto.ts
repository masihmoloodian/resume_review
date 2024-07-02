import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ModelEnum } from 'src/shared/enum/model.enum';
export type RoleTypes = 'user' | 'system' | 'assistant';

export class ChatMessagesDto {
  @IsNotEmpty()
  @ApiProperty()
  role: RoleTypes;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;
}

export class ChatCompletionDto {
  @IsOptional()
  @ApiPropertyOptional({ isArray: true, type: ChatMessagesDto })
  messages?: ChatMessagesDto[];

  @IsNotEmpty()
  @IsEnum(ModelEnum)
  @ApiProperty({ enum: ModelEnum })
  model: ModelEnum;

  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  temperature?: number;

  conversationId?: string;
  message?: string;
}
