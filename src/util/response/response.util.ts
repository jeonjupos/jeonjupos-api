import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseUtil {
  private res: any;
  private statusCode: number;
  private resCode: string;
  private message: string;
  private body: any;

  messageUtil(resCode: string) {
    const message = {
      // status 200
      '0000': '성공',
      '0001': '계정을 찾을 수 없습니다(id를 확인해주세요)',
      '0002': '지급할 쿠폰을 찾을 수 없습니다.',
      '0003': '쿠폰을 지급할 회원이 없습니다.',
      '0004': '비밀번호가 일치하지 않습니다.',
      '0005': '시간표를 찾을 수 없습니다.',
      '0006': '메뉴 재고 부족',
      '0007': '식사중인 테이블입니다.',
      '0008': '테이블을 찾을 수 없습니다.',
      '0009': '사용할 수 없는 테이블입니다.',
      '0010': '메뉴를 찾을 수 없습니다.',
      '0011': '주문서를 찾을 수 없습니다.',
      '0012': '결제 실패 다시 시도해주세요.',
      '0013': '결제금액을 초과했습니다',
      '0014': '다시 로그인해주세요',

      // status 400
      '4000': '파라미터 유효성 검증 실페',

      // status 401
      '8999': '토큰 형식이 올바르지 않습니다.',
      '8998': '토큰 type 이 올바르지 않습니다.',
      '8997': '토큰으로 회원을 찾을 수 없습니다.',
      '8996': '탈퇴한 회원입니다.',
      '8995': '비밀번호가 일치하지 않습니다.',

      // status 409

      // status 500
      '9999': '서버오류',
      '9998': 'DB 오류',
    };
    return message[resCode];
  }

  response(
    res: Response,
    statusCode: number,
    resCode: string,
    message: string,
    body: object,
  ): Response {
    this.res = res;
    this.statusCode = statusCode;
    this.resCode = resCode;
    this.body = body;
    this.message =
      message === ''
        ? this.messageUtil(resCode) !== undefined
          ? this.messageUtil(resCode)
          : ''
        : message;

    return this.res
      .status(this.statusCode)
      .json({ resCode: this.resCode, message: this.message, body: this.body });
  }
}
