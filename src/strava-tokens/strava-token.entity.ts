import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class StravaTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  athleteId: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
