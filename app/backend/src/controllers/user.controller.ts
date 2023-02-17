import { Request, Response } from 'express';
import LoginService from '../services/user.service';

export default class LoginController {
  constructor(
    private _userService: LoginService = new LoginService(),
  ) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    const token = await this._userService.login(req.body);
    res.status(200).json({ token });
  };

  public getRole = async (req: Request, res: Response): Promise<void> => {
    const role = await this._userService.getRole(req.body.user);
    res.status(200).json(role);
  };
}
