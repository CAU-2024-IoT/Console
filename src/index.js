import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import WebSocket from "ws"; // WebSocket 추가
import {handleSeatSensor, handleBrightnessSensor} from "./controllers/sensor.controller.js"
dotenv.config();

const app = express();
const server = http.createServer(app); // http 서버 생성
const io = new Server(server, {
  cors: {
    origin: "*", // 모든 출처 허용
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 3000;

// 외부 WebSocket 서버 주소
const EXTERNAL_WS_URL = process.env.EXTERNAL_WS_URL;
// WebSocket 클라이언트 (외부 서버와의 통신)
let externalWs = null;
// WebSocket 서버 설정 (Flask 서버와의 통신)
const wsServer = new WebSocket.Server({ port: 2026 });



function connectToExternalServer() {
  try {
    externalWs = new WebSocket(EXTERNAL_WS_URL);

    externalWs.on("open", () => {
      console.log(`Connected to external WebSocket server: ${EXTERNAL_WS_URL}`);
    });

    externalWs.on("error", (err) => {
      console.error("Error connecting to external WebSocket server:", err.message);
    });

    externalWs.on("close", () => {
      console.log("Disconnected from external WebSocket server. Reconnecting...");
      setTimeout(connectToExternalServer, 5000); // 5초 후 재연결
    });
  } catch (err) {
    console.error("Failed to connect to external WebSocket server:", err.message);
  }
}

// 외부 WebSocket 서버 연결 시도
connectToExternalServer();

wsServer.on("connection", (ws) => {
  console.log("Flask 서버가 WebSocket으로 연결되었습니다.");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Flask 서버로부터 받은 데이터:", data);
	  if (data.type === 'seat_sensor') {
        handleSeatSensor(data);
      } else if (data.type === 'brightness_sensor') {
        //handleBrightnessSensor(data);
      } else {
        console.error("Unknown data type received:", data.type);
      }
      // Socket.IO를 통해 클라이언트에 데이터 브로드캐스트
      io.emit("flask_data", data);

      // 외부 WebSocket 서버로 데이터 전송
      
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

  // 메시지 수신 및 응답 (테스트용)
  socket.on("message", (msg) => {
    console.log("수신된 메시지:", msg);
    socket.emit("response", `서버가 받은 메시지: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("클라이언트 연결 해제:", socket.id);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
