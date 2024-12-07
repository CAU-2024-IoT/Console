import  {StatusCodes} from "http-status-codes";
import  {getBookInfoDTO, taskDoneDTO} from "../dtos/book.dto.js"
import  {getBookInfo, getBooksInfo} from "../services/book.service.js"
import  {doneRequest} from "../integrations/check.integration.js";
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

  export const handleGetBooksInfo = async (req, res, next) => {
    console.log("Get books info Api called!");
    console.log("body:", req.body);
    try {
      const bookInfo = await getBooksInfo(); // dto를 사용해서 service로 넘김
  
      res.status(StatusCodes.OK).success(bookInfo);
    } catch (error) {
      next(error); // 전역 오류 처리 미들웨어로 전달
    }
  };

  export const handleTaskDone = async (req,res,next)=>{
    console.log("Done Api called");
    console.log("body :", req.body);
    try{
      const dto = taskDoneDTO(req.body);
      const shelfId = dto.shelfId;
      const bookId = dto.bookId;
      const rentResult = await doneRequest(shelfId, bookId);
      if (!rentResult) {
        throw new Error("Failed to rent book from shelf.");
     }
      console.log(rentResult);
    }catch (error) {
      console.error(`Error renting book: ${error.message}`);
      throw new Error(`Failed to rent book: ${error.message}`);
    }
  };