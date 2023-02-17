import ILogin from './ILogin';

type role = 'admin' | 'user';

export default interface IUser extends ILogin {
  id: number;
  username: string;
  role: role;
}

export { role };
