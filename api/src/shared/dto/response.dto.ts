export enum StatusEnum {
  SUCCESS = 'success',
}

export enum StatusCodeEnum {
  SUCCESS = 200,
}

export class ResponseDto<T> {
  constructor(
    public data: T = null,
    public metadata: any = {},
    public status: number = StatusCodeEnum.SUCCESS,
    public message: string = StatusEnum.SUCCESS,
  ) {}
}
