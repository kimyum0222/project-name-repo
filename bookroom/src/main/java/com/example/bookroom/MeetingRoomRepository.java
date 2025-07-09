package com.example.bookroom;

import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public class MeetingRoomRepository {
    private final List<MeetingRoom> meetingRooms = Arrays.asList(
            new MeetingRoom("619", "519会议室", "办公室大楼", 100, "总部", "投影屏", "无"),
            new MeetingRoom("112", "11会议室", "办公室大楼", 30, "何时投影仪不单独运行？", "无", "无"),
            new MeetingRoom("314", "第一会议室", "办公室大楼", 18, "总部", "红色大厅", "白天")
            // 添加更多会议室...
    );

    public List<MeetingRoom> findAll() {
        return meetingRooms;
    }

    public Optional<MeetingRoom> findByNumber(String roomNumber) {
        return meetingRooms.stream()
                .filter(room -> room.getRoomNumber().equals(roomNumber))
                .findFirst();
    }
}