import { Injectable } from '@nestjs/common';
import { ModelEnum } from 'src/shared/enum/model.enum';
import { TiktokenModel, encoding_for_model } from 'tiktoken';

export enum MessageRole {
  SYSTEM = 'system',
  ASSISTANT = 'assistant',
  USER = 'user',
}

@Injectable()
export class OpenaiService {
  async tokenCounter(model: ModelEnum, input: string) {
    let tokens = 0;
    try {
      const encoding = encoding_for_model(model as TiktokenModel);
      tokens = encoding.encode(input).length;
    } catch (e) {
      tokens = Math.ceil(input.length / 4);
    }
    return tokens;
  }
}
