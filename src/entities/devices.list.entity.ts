import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('devices_list')
export class DevicesListEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '名称(不可更改)',
  })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  device_number: string;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @Column({ type: 'int', nullable: true })
  is_delete: number;

  @Column({ type: 'text', nullable: true })
  manufacturer: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  device_type: string;

  @Column({ type: 'text', nullable: true })
  model: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '别名 用于内部请求',
  })
  cranevalue: string;

  @Column({ type: 'text', nullable: true })
  pictureupload: string;

  @Column({
    type: 'datetime',
    precision: 3,
    nullable: true,
    comment: '同步ums数据时间',
  })
  sync_time: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  affiliatedunit: string;

  @Column({ type: 'datetime', nullable: true })
  purchasedate: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  project_no: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  rated_lifting_capacity: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  lift_height: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  outreach: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  track_gauge: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  backreach: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remote_control: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  driver_cab: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  device_value: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  hoist: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  trolley_mechanism: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  pitch_mechanism: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cart_mechanism: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  slips_or_slippers: string;

  @Column({ type: 'tinyint', nullable: true })
  newfixedassets: number;

  @Column({ type: 'tinyint', nullable: true })
  operatingassets: number;

  @Column({ type: 'tinyint', nullable: true })
  fixedassetsornot: number;
}
