package com.example.bookroom.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.List;

/**
 * 会议模板模型
 * 适配前端模板管理功能的数据结构
 */
@Entity
@Data
public class MeetingTemplate {
    @Id
    private String id;          // 模板ID
    private String name;        // 会议名称
    private String type;        // 会议类型
    private String room;        // 会议室
    private String content;     // 会议内容
    private String initiator;   // 发起人
    private String contact;     // 联系人
    private String customRoom;  // 自定义地点
    private List<String> services; // 会议服务列表

    // 默认构造函数（JPA要求）
    public MeetingTemplate() {}

    // 全参数构造函数
    public MeetingTemplate(String id, String name, String type,
                           String room, String content, String initiator) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.room = room;
        this.content = content;
        this.initiator = initiator;
    }
}