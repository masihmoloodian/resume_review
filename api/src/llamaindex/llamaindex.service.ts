import { BadGatewayException, Injectable } from '@nestjs/common';
import {
  IngestionPipeline,
  OpenAIEmbedding,
  TitleExtractor,
  SimpleNodeParser,
  ChatMessage,
  Document,
  VectorStoreIndex,
  QdrantVectorStore,
  OpenAI,
  Metadata,
} from 'llamaindex';
import { ModelEnum } from 'src/shared/enum/model.enum';
import { readFileSync } from 'fs';
const pdf = require('pdf-parse');

@Injectable()
export class LlamaindexService {
  private vectorStore: QdrantVectorStore;
  constructor() {
    this.vectorStore = new QdrantVectorStore({
      url: process.env.QDRANT_URL,
    });
  }

  async loader(filePath: string): Promise<{
    document: Document<Metadata>;
    content: string;
  }> {
    const dataBuffer = readFileSync(filePath);
    const data = await pdf(dataBuffer);

    const document = new Document({ text: data.text });
    return {
      document,
      content: data.text,
    };
  }

  async ingest(
    documents?: Document<Metadata>[],
    text?: string,
    metadata?: { key: string; value: string }[],
  ) {
    let _documents: Document<Metadata>[] = [];

    if (text) _documents.push(new Document({ text }));

    if (documents) _documents.push(...documents);

    for (const document of _documents) {
      document.text = text.replace(/\n/g, ' ');
      for (const data of metadata) {
        document.metadata[data.key] = data.value;
      }
    }

    const pipeline = new IngestionPipeline({
      transformations: [
        new SimpleNodeParser({ chunkSize: 1024, chunkOverlap: 100 }),
        new TitleExtractor(),
        new OpenAIEmbedding(),
      ],
      vectorStore: this.vectorStore,
    });

    pipeline.run({ documents: _documents });
  }

  async query(
    query: string,
    chatHistory: ChatMessage[],
    filters: {
      key: string;
      value: string;
      filterType: 'ExactMatch';
    }[],
    modelKey?: string,
    model?: ModelEnum.GPT_4o,
  ) {
    try {
      const openai = new OpenAI({
        model,
        apiKey: modelKey ? modelKey : process.env.OPENAI_API_KEY,
      });

      const serviceContext: any = {
        llm: {
          chat: openai.chat,
          complete: openai.complete,
          metadata: openai.metadata,
        },
      };

      const index = await VectorStoreIndex.fromVectorStore(
        this.vectorStore,
        serviceContext,
      );

      // TODO: Implement with ChatEngine, at development time ChatEngine do not allow to filter on retriever data
      const queryEngine = index.asQueryEngine({
        preFilters: {
          filters,
        },
      });

      let history = '--- Begin on conversation history ---';
      for (const chat of chatHistory) {
        history += `
        role: ${chat.role}, content: ${chat.content}`;
      }
      history += '\n--- End on conversation history ---';

      const _query = `    
      ${history}
  
      Begin!
      User Question: ${query}`;

      const response = await queryEngine.query({
        query: _query,
      });

      return response.toString();
    } catch (err) {
      console.error('Chat Error: ', err);
      throw new BadGatewayException('Something went wrong on chat completion');
    }
  }

  async delete(
    filters: {
      key: string;
      value: string;
      filterType: 'ExactMatch';
    }[],
  ) {
    const index = await VectorStoreIndex.fromVectorStore(this.vectorStore);
    const retriever = index.asRetriever();

    // // TODO: Get item without query
    const results = await retriever.retrieve({
      query: 'query',
      preFilters: {
        filters,
      },
    });

    if (results) {
      for (const result of results) {
        const source = result.node.relationships.SOURCE as any;
        await this.vectorStore.delete(source.nodeId);
      }
    }
  }
}
