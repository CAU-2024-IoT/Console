// 요청 본문에서 Mission 데이터를 추출하여 Mission 생성에 필요한 형식으로 변환
export const bodyToMission = (body) => {
  return {
    store_id: body.store_id,
    name: body.name,
    description: body.description,
    award: body.award,
    award_point: body.award_point,
  };
};

// Mission 도전 DTO 변환
export const challengeMissionDTO = (storeId, missionId, body) => {
  const user_id = body.user_id;
  const dday = body.dday ? new Date(body.dday) : null;

  if (!user_id) {
    throw new Error("user_id가 누락되었습니다.");
  }
  if (!storeId || !missionId) {
    throw new Error("storeId 또는 missionId가 누락되었습니다.");
  }

  return { storeId, missionId, user_id, dday };
};

// Store Mission 응답 형식으로 변환
export const responseFromStoreMission = ({ storeMissions }) => {
  return storeMissions.map((mission) => ({
    missionId: mission.id,
    name: mission.name,
    description: mission.description,
    award: mission.award,
    awardPoint: mission.awardPoint,
  }));
};

export const storeMissionDTO = (storeId) => {
  return parseInt(storeId, 10);
};
