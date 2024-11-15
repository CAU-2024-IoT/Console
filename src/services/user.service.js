import  {findUserInfo} from "../repositories/user.repository.js"
import  {UserNotFoundError} from "../errors.js"

export const getUserInfo = async (userId) => {
    if (isNaN(userId)){
      throw new UserNotFoundError("사용자 ID 형식이 잘못되었습니다.", {"userId" : userId});
    }
    const userInfo = await findUserInfo(userId);
    if (!userInfo) {
      throw new UserNotFoundError("사용자를 찾을 수 없습니다.", {"userId" : userId});
    }
    return userInfo;
};