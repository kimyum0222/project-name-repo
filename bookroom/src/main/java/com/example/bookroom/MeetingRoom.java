package com.example.bookroom;

public class MeetingRoom {
    private String roomNumber;
    private String name;
    private String address;
    private int capacity;
    private String department;
    private String projectorInfo;
    private String computerConfig;

    // 全参数构造函数
    public MeetingRoom(String roomNumber, String name, String address, int capacity,
                       String department, String projectorInfo, String computerConfig) {
        this.roomNumber = roomNumber;
        this.name = name;
        this.address = address;
        this.capacity = capacity;
        this.department = department;
        this.projectorInfo = projectorInfo;
        this.computerConfig = computerConfig;
    }

    // Getter和Setter（省略部分以节省空间）
    public String getRoomNumber() { return roomNumber; }
    public String getName() { return name; }
    // 其他属性的Getter/Setter...
}