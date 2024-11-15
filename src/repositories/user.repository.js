import { prisma } from "../db.config.js";

export const findUserInfo = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        rents: {
          orderBy: {
            rent_date: 'desc' // 최신순 정렬
          },
          select: {
            book: true, // 필요한 경우 연결된 book 데이터를 가져옴
          }
        }
      }
    });
    return user;
  } catch (error) {
    throw new Error(
      `오류가 발생했어요. 요청을 확인해 주세요. (${error.message})`
    );
  }
};
