import { StatusCodes } from "http-status-codes";
import { gateDTO } from "../dtos/gate.dto.js";
import { checkBook } from "../services/gate.service.js";

export const handleGate = async (req, res, next) => {
  console.log("Gate Api called!");
  console.log("body:", req.body);
  
  try {

    const gateId = gateDTO(req.body);
    const rent = await checkBook(gateId);

    res.status(StatusCodes.OK).success(rent);
  } catch (error) {
    next(error); // 전역 오류 처리 미들웨어로 전달
  }
};
