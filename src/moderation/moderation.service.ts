import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ModerationRecord } from '../database/entities/moderation-record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModerationService {
  constructor(private configService: ConfigService, @InjectRepository(ModerationRecord) private recordRepo: Repository<ModerationRecord>,
) {}

  async moderateMessage(message: string) {
    const apiKey = this.configService.get('PERSPECTIVE_API_KEY');

    try {
      const response = await axios.post(
        `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`,
        {
          comment: { text: message, type: 'PLAIN_TEXT' },
          languages: ['en'],
          requestedAttributes: {
            TOXICITY: {}, 
            INSULT: {}, 
            THREAT: {}
          },
          doNotStore: true,
        }
      );

      const scores = response.data.attributeScores;

      const toxicityScore = scores.TOXICITY.summaryScore.value;
      const insultScore = scores.INSULT.summaryScore.value;
      const threatScore = scores.THREAT.summaryScore.value;

      const flagged = toxicityScore > 0.7 || insultScore > 0.7 || threatScore > 0.7;

      const record = this.recordRepo.create({
      message,
      flagged,
      toxicity: toxicityScore,
      insult: insultScore,
      threat: threatScore,
    });
    await this.recordRepo.save(record);

      return {
        message,
        flagged,
        scores: {
          toxicity: toxicityScore,
          insult: insultScore,
          threat: threatScore,
        },
      };

    } catch (error) {
      console.error('Error calling Perspective API:', error.response?.data || error.message);
      throw new Error('Error moderating message');
    }
  }
}
