import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('blctms_equip_work_by_hour')
export class EquipWorkByHourEntity {
  @PrimaryColumn({ name: 'equip_id' })
  equipId: string;

  @PrimaryColumn({ name: 'work_time' })
  workTime: string;

  @Column({ name: 'ctn_20_size', nullable: true })
  ctn20Size: string;

  @Column({ name: 'ctn_40_size', nullable: true })
  ctn40Size: string;

  @Column({ name: 'ctn_45_size', nullable: true })
  ctn45Size: string;

  @Column({ name: 'nature_ctn', nullable: true })
  nosCount: string;

  @Column({ name: 'teu_count', nullable: true })
  teuCount: string;

  @Column({ name: 'double_ctn', nullable: true })
  doubleCount: string;

  @Column({ name: 'single_ctn', nullable: true })
  singleCount: string;

  @Column({ name: 'insert_time', nullable: true })
  insertTime: string;
}
