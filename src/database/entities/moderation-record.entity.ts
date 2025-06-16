import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ModerationRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column('boolean')
  flagged: boolean;

  @Column('float')
  toxicity: number;

  @Column('float')
  insult: number;

  @Column('float')
  threat: number;

  @CreateDateColumn()
  createdAt: Date;
}
