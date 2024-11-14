import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  // 이메일이 이미 존재하는지 확인
  const user = await prisma.users.findFirst({
    where: { email: data.email },
  });

  if (user) {
    // 이미 사용자가 존재하면 null 반환
    return null;
  }

  // 사용자가 존재하지 않으면 새로운 사용자 생성
  const created = await prisma.users.create({
    data: data,
  });

  // 생성된 사용자의 ID 반환
  return created.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const user = await prisma.users.findFirstOrThrow({ where: { id: userId } });
  return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodId) => {
  await prisma.preference.create({
    data: {
      userId: userId,
      foodId: foodId, // 필드 이름을 정확히 확인합니다.
    },
  });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.preference.findMany({
    select: {
      id: true,
      userId: true,
      foodId: true,
      food: {
        select: {
          name: true, // food의 이름을 가져오려는 경우
        },
      },
    },
    where: { userId: userId },
    orderBy: { foodId: "asc" },
  });

  return preferences;
};


export const checkUserExists = async (userId) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    return !!user; // 유저가 존재하면 true, 그렇지 않으면 false 반환
  } catch (error) {
    throw new Error(
      `오류가 발생했어요. 요청을 확인해 주세요. (${error.message})`
    );
  }
};

export const getUserMissions = async (userId) => {
    try {
      const missions = await prisma.acceptedMission.findMany({
        where: { userId: userId },
        include: {
          mission: true,  // 'mission'이 AcceptedMission과의 관계에 해당하는 필드명이어야 합니다.
        },
      });
      return missions;
    } catch (error) {
      throw new Error(`오류가 발생했어요. 요청을 확인해 주세요. (${error.message})`);
    }
  };

export const getUserReview = async (userId) => {
    const userReview = await prisma.reviews.findMany({
        where: {userId: userId},
        orderBy: { date : "desc" },
        include: {
            reviewImages: {
              include: {
                image: { // 이미지 테이블의 URL을 가져오기 위한 설정
                  select: { url: true },
                },
              },
            },
          },
    });

    return userReview;
}
