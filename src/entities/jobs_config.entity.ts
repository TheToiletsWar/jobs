import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('jobs_global_config')
export class JobsConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  restApiIp: string;

  @Column({ type: 'int', nullable: true, comment: '只能配置rest api端口' })
  restApiPort: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  kafkaTopicName: string;

  @Column({ type: 'int', nullable: true })
  positionThreshhold: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '对应crane_group中的group id',
  })
  groupId: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '可配置rest api端口，也可配置essential api端口',
  })
  restApiWritePort: number;
}
