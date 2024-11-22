import { prisma } from "../db.config.js";

// export const countShelves = async () => {
//     try {
//         const shelfNum = await prisma.shelf.count();
//         return shelfNum;
//     } catch (error){
//         console.error('Error counting shelves:', error);
//     }
// };

const countShelves = async () => {
    // 데이터베이스에서 책장 개수 조회
    const shelfCount = await prisma.shelf.count();
    return shelfCount;
  };
  