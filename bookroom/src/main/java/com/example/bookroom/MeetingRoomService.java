package com.example.bookroom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class MeetingRoomService {
    @Autowired
    private MeetingRoomRepository repository;

    public List<MeetingRoom> getAllRooms() {
        return repository.findAll();
    }

    public Optional<MeetingRoom> getRoomByNumber(String number) {
        return repository.findByNumber(number);
    }
}