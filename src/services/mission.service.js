import {
    addMission,
    checkMissionExists,
    checkUserChallengeExists,
    addChallenge,
    checkStoreExists,
    getStoreMission,
  } from "../repositories/mission.repository.js";
  import { responseFromStoreMission } from "../dtos/mission.dto.js";
import { DuplicateMissionError, MissionNotFoundError, StoreNotFoundError } from "../errors.js";
  
  // 새로운 미션 생성
  export const createMission = async (data) => {
    const joinStoreId = await addMission(data);
    if (joinStoreId === null) {
      throw new StoreNotFoundError("존재하지 않는 가게입니다.");
    }
  };
  
  // 미션 도전
  export const challengeMission = async (dto) => {
    const missionExists = await checkMissionExists(dto.storeId, dto.missionId);
    if (!missionExists) {
      throw new MissionNotFoundError("해당 미션이 존재하지 않습니다.");
    }
  
    const challengeExists = await checkUserChallengeExists(dto.user_id, dto.missionId);
    if (challengeExists) {
      throw new DuplicateMissionError("이미 도전 중인 미션입니다.");
    }
  
    const acceptedMissionId = await addChallenge(dto.user_id, dto.missionId, dto.dday);
    return acceptedMissionId;
  };
  
  // 가게의 미션 목록 가져오기
  export const storeGetMission = async (storeId) => {
    if (isNaN(storeId)){
        throw new StoreNotFoundError("유효하지 않은 storeId입니다.");
    }
    const joinStoreId = await checkStoreExists(storeId);
    if (!joinStoreId) {
      throw new StoreNotFoundError("존재하지 않는 가게입니다.");
    }
  
    const storeMissions = await getStoreMission(storeId);
    return responseFromStoreMission({ storeMissions });
  };
  