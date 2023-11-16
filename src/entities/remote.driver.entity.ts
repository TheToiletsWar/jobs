import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('jobs_remote_driver')
export class RemoteDriverEntity {
  @PrimaryColumn({ type: 'int' })
  id: number;
  @Column({ type: 'varchar', length: 100, name: 'username' })
  username: string;
  @Column({ type: 'varchar', length: 100, name: 'first_name', nullable: true })
  firstName: string;
  @Column({ type: 'varchar', length: 100, name: 'last_name', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, name: 'card_guid', nullable: true })
  cardGuid: string;
}
