import { ApiHeader } from '@nestjs/swagger';

export const JwtHeader = ApiHeader({
  name: 'Authorization',
  description: `jwt token 입력. 앞에 Bearer 붙여야함.  
      Ex. Bearer alksdjga.aslkdhgas.asdfjha`,
  required: true,
});
