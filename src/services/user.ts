import { existsByLoginId } from '../handlers/userHandler';
import { CreateUser } from '../inerfaces/user';

export async function signUp(user: CreateUser) {
  try {
    const userExists = await existsByLoginId(user.loginId);

    if (userExists) {
    }
  } catch (e) {
    throw e;
  }
}
