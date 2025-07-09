package com.example.bookroom.controller; // 保持在 com.example.bookroom.controller 包下

import com.example.bookroom.model.Meeting; // 导入新的 Meeting 实体
import com.example.bookroom.service.MeetingService; // 导入新的 MeetingService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 会议查询与管理控制器。
 * 对应前端的会议查询页面。
 * 提供查询、新增、修改、删除会议的API。
 */
@RestController
@RequestMapping("/api/meetings") // 新的API路径，与 /api/calendar 区分
//@CrossOrigin(origins = "http://localhost:5173")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    /**
     * GET /api/meetings
     * 查询会议列表
     * 支持根据日期范围 (dateRange), 审核状态 (status), 显示所有 (showAll) 进行过滤。
     *
     * 前端请求示例:
     * - /api/meetings?startDate=2025-07-01&endDate=2025-07-31&status=已审核
     * - /api/meetings?status=审核中
     * - /api/meetings?showAll=true
     */
    @GetMapping
    public ResponseEntity<List<Meeting>> getMeetings(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean showAll) {

        List<Meeting> meetings = meetingService.searchMeetings(startDate, endDate, status, showAll);
        return ResponseEntity.ok(meetings);
    }

    /**
     * POST /api/meetings
     * 新建会议
     * 前端会发送包含 name, date, startTime, endTime, room, initiator 等字段的数据。
     * 后端将这些数据映射到 Meeting 实体并保存。
     */
    @PostMapping
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        Meeting createdMeeting = meetingService.createMeeting(meeting);
        return new ResponseEntity<>(createdMeeting, HttpStatus.CREATED);
    }

    /**
     * PUT /api/meetings/{id}
     * 更新会议
     */
    @PutMapping("/{id}")
    public ResponseEntity<Meeting> updateMeeting(@PathVariable Long id, @RequestBody Meeting meetingDetails) {
        return meetingService.updateMeeting(id, meetingDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/meetings/{id}
     * 删除会议
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable Long id) {
        if (meetingService.deleteMeeting(id)) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.notFound().build(); // 404 Not Found
    }
}