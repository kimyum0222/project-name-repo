package com.example.bookroom.service;

import com.example.bookroom.model.ConferenceEvent;
import com.example.bookroom.model.ConferenceRoom;
import com.example.bookroom.model.NewMeetingRequest;
import com.example.bookroom.model.Meeting;
// import com.example.bookroom.repository.ConferenceEventRepository; // <-- 删除或注释掉此行导入
import com.example.bookroom.repository.ConferenceRoomRepository;
import com.example.bookroom.repository.MeetingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 重构后的会议日历服务类
 */
@Service
public class ConferenceCalendarService {

    // private final ConferenceEventRepository eventRepository; // <-- 删除此字段定义
    private final ConferenceRoomRepository roomRepository;
    private final MeetingRepository meetingRepository;

    @Autowired
    public ConferenceCalendarService(
                                    // ConferenceEventRepository eventRepository, // <-- 删除此构造函数参数
                                     ConferenceRoomRepository roomRepository,
                                     MeetingRepository meetingRepository) {
        // this.eventRepository = eventRepository; // <-- 删除此赋值语句
        this.roomRepository = roomRepository;
        this.meetingRepository = meetingRepository;
    }

    /**
     * [无需修改]
     * 获取用于 FullCalendar 的会议室资源列表。
     */
    public List<Map<String, Object>> getCalendarResources() {
        List<ConferenceRoom> allRooms = roomRepository.findAll();
        return allRooms.stream().map(room -> {
            Map<String, Object> resource = new HashMap<>();
            resource.put("id", room.getRoomNumber());
            resource.put("title", room.getName());
            return resource;
        }).collect(Collectors.toList());
    }

    /**
     * [已修改] 获取所有的会议事件 (现在从 meeting_details 表获取)
     */
    public List<ConferenceEvent> getAllEvents() {
        List<Meeting> allMeetings = meetingRepository.findAll();

        return allMeetings.stream().map(meeting -> {
            ConferenceEvent event = new ConferenceEvent();
            event.setId(String.valueOf(meeting.getId()));
            event.setTitle(meeting.getName());
            
            LocalDateTime startDateTime = LocalDateTime.of(meeting.getDate(), meeting.getStartTime());
            LocalDateTime endDateTime = LocalDateTime.of(meeting.getDate(), meeting.getEndTime());
            event.setStart(startDateTime);
            event.setEnd(endDateTime);

            event.setResourceId(meeting.getRoom());

            if ("已审核".equals(meeting.getStatus())) {
                event.setBackgroundColor("#67C23A");
                event.setBorderColor("#67C23A");
            } else {
                event.setBackgroundColor("#E6A23C");
                event.setBorderColor("#E6A23C");
            }
            return event;
        }).collect(Collectors.toList());
    }

    /**
     * [已修改] 创建一个新会议事件 (现在保存到 meeting_details 表)
     */
    public ConferenceEvent createNewEvent(NewMeetingRequest request) {
        Meeting meeting = new Meeting();

        meeting.setName(request.getTitle());
        meeting.setDate(request.getDate());
        meeting.setStartTime(request.getStartTime());
        meeting.setEndTime(request.getEndTime());
        meeting.setRoom(request.getRoomId());
        meeting.setInitiator(request.getConvener());

        meeting.setStatus("审核中");
        meeting.setAttachment(false);

        Meeting savedMeeting = meetingRepository.save(meeting);

        ConferenceEvent event = new ConferenceEvent();
        event.setId(String.valueOf(savedMeeting.getId()));
        event.setTitle(savedMeeting.getName());

        LocalDateTime startDateTime = LocalDateTime.of(savedMeeting.getDate(), savedMeeting.getStartTime());
        LocalDateTime endDateTime = LocalDateTime.of(savedMeeting.getDate(), savedMeeting.getEndTime());
        event.setStart(startDateTime);
        event.setEnd(endDateTime);

        event.setResourceId(savedMeeting.getRoom());

        if ("已审核".equals(savedMeeting.getStatus())) {
            event.setBackgroundColor("#67C23A");
            event.setBorderColor("#67C23A");
        } else {
            event.setBackgroundColor("#E6A23C");
            event.setBorderColor("#E6A23C");
        }
        return event;
    }
}