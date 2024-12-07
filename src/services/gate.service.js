import  {findGateInfo} from "../repositories/gate.repository.js"
import  {BookNotFoundError} from "../errors.js"

export const checkBook = async (gateId) => {
    if (isNaN(bookId)){
      throw new BookNotFoundError("gate ID 형식이 잘못되었습니다.", {"bookId" : bookId});
    }
    const isBookOk = await findGateInfo(gateId);
    return isBookOk;
};
