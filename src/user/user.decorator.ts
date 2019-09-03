import { createParamDecorator } from '@nestjs/common';

export const CustomUser = createParamDecorator((data, request) => {
  //data is the string passed in decorator, if true, we just get that specific prop from request
  return data ? request.user[data] : request.user;
});
