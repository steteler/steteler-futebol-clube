import * as jsonwebtoken from 'jsonwebtoken';
import ILogin from '../interfaces/ILogin';

const jwtConfig: object = {
  algorithm: 'HS256',
  expiresIn: '7d',
};

export default function generateToken(user: ILogin) {
  const { email } = user;

  const secret = process.env.JWT_SECRET;
  return jsonwebtoken.sign({ email }, secret as string, jwtConfig);
}
