import  {StatusCodes} from "http-status-codes";
import  {getUserInfoDTO} from "../dtos/user.dto.js"
import  {getUserInfo} from "../services/user.service.js"

export const handleGetUserInfo = async (req, res, next) => {
    console.log("Get user info Api called!");
    console.log("body:", req.body);
    try {
      const { userId } = req.params;
      const dto = getUserInfoDTO(userId);
      const userInfo = await getUserInfo(dto); // dto를 사용해서 service로 넘김
  
      res.status(StatusCodes.OK).success(userInfo);
    } catch (error) {
      next(error); // 전역 오류 처리 미들웨어로 전달
    }
  };