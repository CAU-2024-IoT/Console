import { prisma } from "../db.config.js";

export const findGateInfo = async (gateId) => {
  try {
    // gateId로 책 검색
    const gateInfo = await prisma.book.findUnique({
      where: { gate_id: gateId },
    });

    // 책이 존재하지 않는 경우
    if (!gateInfo) {
      return false;
    }

    // 책의 상태를 확인
    if (gateInfo.status === "DAEYONG") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(
      `오류가 발생했어요. 요청을 확인해 주세요. (${error.message})`
    );
  }
};
