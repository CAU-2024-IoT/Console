import { StatusCodes } from "http-status-codes";
import { returnBookDTO } from "../dtos/return.dto.js";
import { returnBook } from "../services/return.service.js";

export const handleReturnBook = async (req, res, next) => {
  console.log("Return Api called!");
  console.log("body:", req.body);
  
  try {
    const { bookId } = req.body;
    const userId = req.user.userId;

    const dto = returnBookDTO(bookId, userId);
    const rent = await returnBook(dto);

    res.status(StatusCodes.OK).success(rent);
  } catch (error) {
    next(error); // 전역 오류 처리 미들웨어로 전달
  }
};
