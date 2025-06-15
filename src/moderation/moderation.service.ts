import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ModerationService {
  constructor(private configService: ConfigService) {}

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
