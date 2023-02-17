import * as bcryptjs from 'bcryptjs';
import ILogin from '../interfaces/ILogin';
import User from '../database/models/User.Model';
import generateToken from '../utils/generateToken';
import ErrorHandler from '../utils/errorHandler';
import { errorEmailPasswordInvalid } from '../utils/errorsMessage';
import IUser from '../interfaces/IUser';

export default class LoginService {
  constructor(
    private _userModel = User,
  ) {}

  public login = async (body: ILogin): Promise<string | void> => {
    const { email, password } = body;

    const account = await this._userModel.findOne({ where: { email } });

    if (account && bcryptjs.compareSync(password, account.password)) {
      const newToken = generateToken(body);
      return newToken;
    }

    const { status, message } = errorEmailPasswordInvalid;

    throw new ErrorHandler(status, message);
  };

  public getRole = async (user: IUser): Promise<Partial<IUser>> => {
    const account = await this._userModel.findOne({
      where: { email: user.email },
    });

    if (account) {
      return { role: account.role };
    }

    const { status, message } = errorEmailPasswordInvalid;
    throw new ErrorHandler(status, message);
  };
}
