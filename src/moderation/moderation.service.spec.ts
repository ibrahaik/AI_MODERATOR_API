import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ModerationService } from './moderation.service';
import { ModerationRecord } from '../database/entities/moderation-record.entity';
import axios from 'axios';

// Mock de axios
jest.mock('axios');

describe('ModerationService', () => {
  let service: ModerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-api-key'),
          },
        },
        {
          provide: getRepositoryToken(ModerationRecord),
          useValue: {
            create: jest.fn().mockImplementation(dto => dto),
            save: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<ModerationService>(ModerationService);
  });

  it('debería detectar mensajes tóxicos', async () => {
 (axios.post as jest.Mock).mockResolvedValue({
  data: {
    attributeScores: {
      TOXICITY: { summaryScore: { value: 0.95 } },
      INSULT: { summaryScore: { value: 0.91 } },
      THREAT: { summaryScore: { value: 0.89 } },
    },
  },
});


    const resultado = await service.moderateMessage('some toxic message');
    expect(resultado.flagged).toBe(true);
  });

  it('no debería detectar mensajes no tóxicos', async () => {
 (axios.post as jest.Mock).mockResolvedValue({
  data: {
    attributeScores: {
      TOXICITY: { summaryScore: { value: 0.01 } },
      INSULT: { summaryScore: { value: 0.008 } },
      THREAT: { summaryScore: { value: 0.007 } },
    },
  },
});



    const resultado = await service.moderateMessage('hello, how are you?');
    expect(resultado.flagged).toBe(false);
  });
});
