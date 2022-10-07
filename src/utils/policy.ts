export const availableEmailRegex = // '계정@도메인.최상위도메인'
  '^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
export const availablePasswordRegex = // 최소 8 자, 하나 이상의 대문자, 하나의 소문자 및 하나의 숫자
  '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$';
