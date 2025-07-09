package com.example.bookroom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
public class MeetingRoomController {

    @Autowired
    private MeetingRoomService service;

    @GetMapping
    public List<MeetingRoom> getAllRooms() {
        return service.getAllRooms();
    }

    @GetMapping("/{number}")
    public ResponseEntity<MeetingRoom> getRoom(@PathVariable String number) {
        Optional<MeetingRoom> room = service.getRoomByNumber(number);
        return room.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}