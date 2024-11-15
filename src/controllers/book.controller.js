import  {StatusCodes} from "http-status-codes";
import  {getBookInfoDTO} from "../dtos/book.dto.js"
import  {getBookInfo} from "../services/book.service.js"

export const handleGetBookInfo = async (req, res, next) => {
    console.log("Get book info Api called!");
    console.log("body:", req.body);
    try {
      const { bookId } = req.params;
      const dto = getBookInfoDTO(bookId);
      const bookInfo = await getBookInfo(dto); // dto를 사용해서 service로 넘김
  
      res.status(StatusCodes.OK).success(bookInfo);
    } catch (error) {
      next(error); // 전역 오류 처리 미들웨어로 전달
    }
  };