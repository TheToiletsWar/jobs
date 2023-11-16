import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('jobs_crane')
export class CraneEntity {
  @PrimaryColumn({ type: 'int', name: 'crane_id' })
  craneId: number;
  @Column({ type: 'varchar', length: 100, name: 'crane_name' })
  craneName: string;
}
