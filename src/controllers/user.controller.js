import { StatusCodes } from "http-status-codes";
import { getUserInfoDTO } from "../dtos/user.dto.js";
import { getUserInfo } from "../services/user.service.js";

export const handleGetUserInfo = async (req, res, next) => {
  console.log("Get user info Api called!");
  console.log("body:", req.body);
  
  try {
    const { userId } = req.params;

    // 토큰에서 추출된 사용자 정보
    if (req.user.userId !== parseInt(userId, 10)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        resultType: "FAIL",
        error: {
          errorCode: "ACCESS_DENIED",
          reason: "You do not have permission to access this user information",
        },
        success: null,
      });
    }

    const dto = getUserInfoDTO(userId);
    const userInfo = await getUserInfo(dto);

    res.status(StatusCodes.OK).success(userInfo);
  } catch (error) {
    next(error); // 전역 오류 처리 미들웨어로 전달
  }
};
