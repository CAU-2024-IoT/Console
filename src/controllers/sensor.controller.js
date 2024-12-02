// 좌석 상태를 저장하는 데이터 구조
const studyRooms = [
	{
	  roomId: 1,
	  desks: [
		{ deskId: 1, seats: [false, false, false, false] },
		{ deskId: 2, seats: [false, false, false, false] },
		{ deskId: 3, seats: [false, false, false, false] },
		{ deskId: 4, seats: [false, false, false, false] },
	  ],
	},
	{
	  roomId: 2,
	  desks: [
		{ deskId: 1, seats: [false, false, false, false] },
		{ deskId: 2, seats: [false, false, false, false] },
		{ deskId: 3, seats: [false, false, false, false] },
		{ deskId: 4, seats: [false, false, false, false] },
	  ],
	},
	{
	  roomId: 3,
	  desks: [
		{ deskId: 1, seats: [false, false, false, false] },
		{ deskId: 2, seats: [false, false, false, false] },
		{ deskId: 3, seats: [false, false, false, false] },
		{ deskId: 4, seats: [false, false, false, false] },
	  ],
	},
  ];
  // 외부 WebSocket 서버 주소

// 외부 WebSocket 클라이언트 선언 (전역 변수)
let externalWs = null;

  // ID와 좌석 매칭 로직 (id를 열람실, 책상, 좌석에 매핑)
  function getSeatPositionById(id) {
	const desksPerRoom = 4;
	const seatsPerDesk = 4;
	const totalSeatsPerRoom = desksPerRoom * seatsPerDesk;
  
	const roomIndex = Math.floor((id - 1) / totalSeatsPerRoom); // 열람실 인덱스
	const deskIndex = Math.floor(((id - 1) % totalSeatsPerRoom) / seatsPerDesk); // 책상 인덱스
	const seatIndex = (id - 1) % seatsPerDesk; // 좌석 인덱스
  
	return { roomIndex, deskIndex, seatIndex };
  }
  
  // 전체 열람실 상태를 JSON으로 변환
  function generateSeatStatusMessage() {
	const seatStatus = {};
	studyRooms.forEach((room) => {
	  seatStatus[`열람실${room.roomId}`] = room.desks.map((desk) => desk.seats);
	});
	return {
	  type: "seatStatusUpdate",
	  seatStatus,
	};
  }
  
  // 1번 함수: seat_sensor 데이터를 처리
  export function handleSeatSensor(data) {
	console.log("Handling seat sensor data:", data);
  
	const { id, state } = data;
  
	// ID를 좌석 위치로 매핑
	const position = getSeatPositionById(id);
	const { roomIndex, deskIndex, seatIndex } = position;
  
	// 현재 좌석 상태 가져오기
	const currentSeatStatus = studyRooms[roomIndex]?.desks[deskIndex]?.seats[seatIndex];
  
	if (currentSeatStatus === undefined) {
	  console.error(`Invalid seat ID: ${id}`);
	  return;
	}
  
	// 새로운 상태 계산
	const newSeatStatus = state === 1;
  
	// 상태가 다르면 변경하고 전체 상태 메시지 생성
	if (currentSeatStatus !== newSeatStatus) {
	  console.log(`Seat state changed for ID: ${id}`);
	  studyRooms[roomIndex].desks[deskIndex].seats[seatIndex] = newSeatStatus;
  
	  // 전체 좌석 상태 메시지 생성
	  const seatStatusMessage = generateSeatStatusMessage();
	  console.log("Updated seat status sent to external WebSocket server:", JSON.stringify(seatStatusMessage, null, 2));

	  // 외부 WebSocket 서버로 메시지 전송
	  if (externalWs && externalWs.readyState === WebSocket.OPEN) {
		externalWs.send(JSON.stringify(seatStatusMessage));
		console.log("Updated seat status sent to external WebSocket server:", seatStatusMessage);
	  } else {
		console.error("Cannot send updated seat status: External WebSocket server is not connected.");
	  }
	}
  }
  
  // 2번 함수: brightness_sensor 데이터를 처리
export function handleBrightnessSensor(data) {
	console.log("Handling brightness sensor data:", data);
  }