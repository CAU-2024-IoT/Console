import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io"; // 추가
import http from "http"; // 추가
import WebSocket from "ws"; // WebSocket 추가

import { handleGetUserInfo, handleGetUsersInfo } from "./controllers/user.controller.js";
import { handleGetBookInfo, handleGetBooksInfo } from "./controllers/book.controller.js";
import { authenticateToken } from './auth/auth.middleware.js';
import { handleRentBook } from "./controllers/rent.controller.js";
import { handleReturnBook } from "./controllers/return.controller.js";
dotenv.config();

const app = express();
const server = http.createServer(app); // http 서버 생성
const io = new Server(server, {
  cors: {
    origin: "*", // 모든 출처 허용
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3000;

// WebSocket 서버 설정 (Flask 서버와의 통신)
const wsServer = new WebSocket.Server({ port: 2026 });

wsServer.on("connection", (ws) => {
  console.log("Flask 서버가 WebSocket으로 연결되었습니다.");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Flask 서버로부터 받은 데이터:", data);

      // 필요한 데이터 처리 로직
      // 예: 데이터 저장, 다른 클라이언트에 브로드캐스트 등
      io.emit("flask_data", data); // Socket.IO를 통해 클라이언트에 데이터 브로드캐스트
    } catch (err) {
      console.error("WebSocket 메시지 처리 오류:", err.message);
    }
  });

  ws.on("close", () => {
    console.log("Flask 서버와의 WebSocket 연결이 종료되었습니다.");
  });

  ws.on("error", (err) => {
    console.error("WebSocket 에러:", err.message);
  });
});

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.use(cors()); // CORS 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 JSON으로 해석
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Socket.IO 이벤트 설정
io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다:", socket.id);

  socket.on("message", (msg) => {
    console.log("수신된 메시지:", msg);
    socket.emit("response", `서버가 받은 메시지: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("클라이언트 연결 해제:", socket.id);
  });
});

// 토큰 인증이 필요한 경로
app.get("/api/v1/user/:userId", authenticateToken, handleGetUserInfo);
app.post("/api/v1/books/rent", authenticateToken, handleRentBook);
app.post("/api/v1/books/return", authenticateToken, handleReturnBook);
// 토큰 인증이 필요 없는 경로
app.get("/api/v1/book/:bookId", handleGetBookInfo);
app.get("/api/v1/books", handleGetBooksInfo);
app.get("/api/v1/users", handleGetUsersInfo);

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err);
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

server.listen(port, "0.0.0.0", () => { // 모든 인터페이스에서 수신 대기
  console.log(`Example app listening on port ${port}`);
});
