package com.example.bookroom.controller;

import com.example.bookroom.model.ConferenceRoom;
import com.example.bookroom.service.RoomService;
import jakarta.persistence.EntityNotFoundException; // 引入新的异常类
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
//@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    /**
     * 处理 GET /api/rooms 请求，获取所有会议室。
     */
    @GetMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<List<ConferenceRoom>> getAllRooms() {
        List<ConferenceRoom> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    /**
     * 处理 POST /api/rooms 请求，添加一个新会议室。
     */
    @PostMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<?> addRoom(@RequestBody ConferenceRoom newRoom) {
        try {
            ConferenceRoom savedRoom = roomService.addRoom(newRoom);
            return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("添加会议室时发生未知错误。");
        }
    }

    /**
     * === vvv 新增的“修改”API端点 vvv ===
     * 处理 PUT /api/rooms/{roomNumber} 请求，修改一个会议室。
     * @param roomNumber 从URL路径中获取的房号
     * @param roomDetails 从请求体中获取的新数据
     */
    @PutMapping(value = "/{roomNumber}", produces = "application/json;charset=UTF-8")
    public ResponseEntity<?> updateRoom(@PathVariable String roomNumber, @RequestBody ConferenceRoom roomDetails) {
        try {
            ConferenceRoom updatedRoom = roomService.updateRoom(roomNumber, roomDetails);
            return ResponseEntity.ok(updatedRoom);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("修改会议室时发生未知错误。");
        }
    }

    /**
     * === vvv 新增的“删除”API端点 vvv ===
     * 处理 DELETE /api/rooms/{roomNumber} 请求，删除一个会议室。
     * @param roomNumber 从URL路径中获取的房号
     */
    @DeleteMapping(value = "/{roomNumber}", produces = "application/json;charset=UTF-8")
    public ResponseEntity<?> deleteRoom(@PathVariable String roomNumber) {
        try {
            roomService.deleteRoom(roomNumber);
            // 成功删除后，返回一个没有内容的主体和 204 NO_CONTENT 状态码，这是RESTful API的标准做法
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("删除会议室时发生未知错误。");
        }
    }
}
