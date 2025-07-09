package com.example.bookroom.controller;

import com.example.bookroom.model.ConferenceEvent; // 仍然需要导入 ConferenceEvent 作为返回类型
import com.example.bookroom.model.NewMeetingRequest;
import com.example.bookroom.service.ConferenceCalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * [已更新] 会议日历控制器
 */
@RestController
@RequestMapping("/api/calendar")
//@CrossOrigin(origins = "*") // 开发时允许所有跨域
public class ConferenceCalendarController {

    private final ConferenceCalendarService calendarService;

    @Autowired
    public ConferenceCalendarController(ConferenceCalendarService calendarService) {
        this.calendarService = calendarService;
    }

    /**
     * [无需修改] 获取所有会议事件
     * 调用了重构后的 service.getAllEvents() 方法
     */
    @GetMapping("/events")
    public ResponseEntity<List<ConferenceEvent>> getAllEvents() {
        List<ConferenceEvent> events = calendarService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    /**
     * [无需修改] 获取所有会议室资源
     * 这个接口现在调用 service.getCalendarResources() 方法,
     * 返回的是专门为 FullCalendar 定制的 {id, title} 格式的数据。
     */
    @GetMapping("/resources")
    public ResponseEntity<List<Map<String, Object>>> getCalendarResources() {
        List<Map<String, Object>> resources = calendarService.getCalendarResources();
        return ResponseEntity.ok(resources);
    }

    /**
     * [无需修改] 创建新会议
     * 这个接口的逻辑是正确的，继续使用。
     */
    @PostMapping("/events")
    public ResponseEntity<ConferenceEvent> createNewEvent(@RequestBody NewMeetingRequest request) {
        try {
            ConferenceEvent newEvent = calendarService.createNewEvent(request);
            return ResponseEntity.ok(newEvent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // ... (其他部分保持不变)
}