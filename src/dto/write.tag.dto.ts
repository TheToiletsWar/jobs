export class WriteTagDto {
  name: string;
  value: any;
  type?: string;

  constructor(partialObj: Partial<WriteTagDto>) {
    Object.assign(this, partialObj);
  }
}
