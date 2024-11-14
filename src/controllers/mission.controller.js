import { StatusCodes } from "http-status-codes";
import { bodyToMission, challengeMissionDTO, storeMissionDTO } from "../dtos/mission.dto.js";
import {
  createMission,
  challengeMission,
  storeGetMission,
} from "../services/mission.service.js";

export const handleCreateMission = async (req, res, next) => {
  console.log("미션 추가를 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await createMission(bodyToMission(req.body));
  res.status(StatusCodes.OK).success(user);
};

export const handleChallengeMission = async (req, res) => {
    const { storeId, missionId } = req.params; // 경로 파라미터에서 storeId와 missionId 가져오기

    // DTO 함수로 요청 데이터를 처리 (경로 파라미터와 요청 본문 전달)
    const dto = challengeMissionDTO(storeId, missionId, req.body);

    // 서비스 레이어 호출, DTO 데이터를 전달
    const acceptedMissionId = await challengeMission(dto);

    // 성공 응답
    res.status(StatusCodes.OK).success(acceptedMissionId);
};

export const handleStoreMission = async (req, res, next) => {
    console.log("미션 조회를 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
    const { storeId } = req.params; // 경로 파라미터에서 storeId와 missionId 가져오기
    const dto = storeMissionDTO(storeId);
    // 서비스 레이어 호출, DTO 데이터를 전달
    const storeMissionId = await storeGetMission(dto);

    // 성공 응답
    res.status(StatusCodes.OK).success(storeMissionId);
};
