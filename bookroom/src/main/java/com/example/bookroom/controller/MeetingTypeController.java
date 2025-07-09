// MeetingTypeController.java (保持之前给出的修改)
package com.example.bookroom.controller;

import com.example.bookroom.model.MeetingType;
import com.example.bookroom.service.MeetingTypeService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meeting-types")
public class MeetingTypeController {

    @Autowired
    private MeetingTypeService meetingTypeService;

    // 获取所有会议类型 (用于管理页面，包括停用)
    @GetMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<List<MeetingType>> getAllMeetingTypes() {
        List<MeetingType> types = meetingTypeService.getAllMeetingTypes();
        return ResponseEntity.ok(types);
    }

    // 【新增方法】 获取所有未停用的会议类型 (用于新建会议等需要过滤的页面)
    @GetMapping(value = "/enabled", produces = "application/json;charset=UTF-8")
    public ResponseEntity<List<MeetingType>> getEnabledMeetingTypes() {
        List<MeetingType> types = meetingTypeService.getEnabledMeetingTypes();
        return ResponseEntity.ok(types);
    }

    // ... 其他方法 (addMeetingType, updateMeetingType, deleteMeetingType) 保持不变 ...
    @PostMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<MeetingType> addMeetingType(@RequestBody MeetingType meetingType) {
        try {
            MeetingType newType = meetingTypeService.addMeetingType(meetingType);
            return new ResponseEntity<>(newType, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(value = "/{id}", produces = "application/json;charset=UTF-8")
    public ResponseEntity<?> updateMeetingType(@PathVariable Long id, @RequestBody MeetingType typeDetails) {
        try {
            MeetingType updatedType = meetingTypeService.updateMeetingType(id, typeDetails);
            return ResponseEntity.ok(updatedType);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeetingType(@PathVariable Long id) {
        try {
            meetingTypeService.deleteMeetingType(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}