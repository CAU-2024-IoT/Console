import { StatusCodes } from "http-status-codes";
import { rentBookDTO } from "../dtos/rent.dto.js";
import { rentBook } from "../services/rent.service.js";

export const handleRentBook = async (req, res, next) => {
  console.log("Rent Api called!");
  console.log("body:", req.body);
  
  try {
    const { bookId } = req.body;
    const userId = req.user.userId;

    const dto = rentBookDTO(bookId, userId);
    const rent = await rentBook(dto);

    res.status(StatusCodes.OK).success(rent);
  } catch (error) {
    next(error); // 전역 오류 처리 미들웨어로 전달
  }
};
