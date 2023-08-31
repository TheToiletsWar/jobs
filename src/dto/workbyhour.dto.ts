export class WorkByHourDto {
  equipId: string;
  nosCount: number;
  teuCount: number;
  constructor(patialObj: Partial<WorkByHourDto>) {
    Object.assign(this, patialObj);
  }
}
