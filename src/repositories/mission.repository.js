import { prisma } from "../db.config.js";

// Mission 추가
export const addMission = async (data) => {
  try {
    const storeExists = await prisma.stores.findUnique({
      where: { id: data.store_id },
    });
    if (!storeExists) return null;

    const mission = await prisma.missions.create({
      data: {
        storeId: data.store_id,
        name: data.name,
        description: data.description,
        award: data.award,
        awardPoint: data.award_point,
      },
    });

    return mission.id;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  }
};

// 특정 Store ID와 Mission ID가 유효한지 확인하는 함수
export const checkMissionExists = async (storeId, missionId) => {
  const mission = await prisma.missions.findFirst({
    where: { id: missionId, storeId: storeId },
  });
  return mission !== null;
};

// 사용자가 특정 미션에 이미 도전 중인지 확인하는 함수
export const checkUserChallengeExists = async (userId, missionId) => {
  const challenge = await prisma.acceptedMission.findFirst({
    where: { userId: userId, missionId: missionId },
  });
  return challenge !== null;
};

// AcceptedMission 테이블에 새로운 도전 정보 추가
export const addChallenge = async (userId, missionId, dday) => {
  const challenge = await prisma.acceptedMission.create({
    data: { userId: userId, missionId: missionId, state: true, dday: dday || null },
  });
  return challenge.id;
};

// 특정 Store ID가 존재하는지 확인
export const checkStoreExists = async (storeId) => {
  const store = await prisma.stores.findUnique({
    where: { id: storeId },
  });
  return store ? store.id : null;
};

// 특정 가게의 모든 미션 가져오기
export const getStoreMission = async (storeId) => {
  const missions = await prisma.missions.findMany({
    where: { storeId: storeId },
    orderBy: { id: "desc" },
  });
  return missions;
};
