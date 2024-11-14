import  {StatusCodes} from "http-status-codes";
import  {bodyToUser, userGetReviewDTO, userMissionDTO} from "../dtos/user.dto.js";
import  {userSignUp, userGetReview, userMission} from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
    console.log("SignUp Api called!");
    console.log("body:", req.body);

    const user = await userSignUp(bodyToUser(req.body)); //dtoo를 사용해서 service로 넘김
    res.status(StatusCodes.OK).success(user);
};

export const handleUserMission = async (req, res, next) => {
    console.log("UserMission Api called!");

        const userId = req.params.userId;  // 경로 파라미터에서 userId와 missionId 가져오기
    
        // DTO 함수로 요청 데이터를 처리 (경로 파라미터와 요청 본문 전달)
        console.log(userId);
        const dto = userMissionDTO(userId);
        console.log(dto);
        // 서비스 레이어 호출, DTO 데이터를 전달
        const userMissionId = await userMission(dto);
    
        // 성공 응답
        res.status(StatusCodes.OK).success(userMissionId);
}

export const handleUserReviews = async (req, res, next) => {
    console.log("User Review Api called!");
    console.log("body:", req.body);
    const { userId } = req.params;
    const dto = userGetReviewDTO(userId);
    const userReview = await userGetReview(dto); //dtoo를 사용해서 service로 넘김
    res.status(StatusCodes.OK).success(userReview);
}