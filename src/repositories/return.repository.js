import { prisma } from "../db.config.js";

export const deleteRentRecord = async ({ user_id, book_id, rent_date }) => {
    console.log(user_id, book_id);
    try {
        // 특정 조건에 맞는 rent 기록을 삭제
        const rentRecord = await prisma.rent.deleteMany({
            where: {
                user_id: user_id,
                book_id: book_id,
                rent_date: rent_date
            }
        });

        if (rentRecord.count === 0) {
            throw new Error("No matching rent record found to delete.");
        }

        return { message: "Rent record deleted successfully", rentRecord };
    } catch (error) {
        console.error("Error deleting rent record:", error);
        throw new Error("Failed to delete rent record");
    }
};
