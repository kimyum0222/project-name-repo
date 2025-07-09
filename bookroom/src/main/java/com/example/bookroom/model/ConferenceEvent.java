package com.example.bookroom.model;

// 移除所有 Jakarta Persistence (JPA) 相关的注解
// import jakarta.persistence.*; // 删除或注释掉这行
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 会议日历事件模型 (现在作为DTO使用，不再是JPA实体)
 * 适配前端FullCalendar组件的数据结构
 */
// @Entity // 移除此注解
// @Table(name = "conference_event") // 移除此注解
@Data
public class ConferenceEvent {
    private String id;               // 事件ID（申请单号）
    private String title;            // 会议名称

    // @Column(name = "event_start") // 移除此注解
    private LocalDateTime start;     // 开始时间

    // @Column(name = "event_end")   // 移除此注解
    private LocalDateTime end;       // 结束时间

    private String resourceId;       // 会议室ID
    private String backgroundColor;  // 背景颜色
    private String borderColor;      // 边框颜色

    // 默认构造函数
    public ConferenceEvent() {}

    // 全参数构造函数
    public ConferenceEvent(String id, String title, LocalDateTime start,
                           LocalDateTime end, String resourceId,
                           String backgroundColor, String borderColor) {
        this.id = id;
        this.title = title;
        this.start = start;
        this.end = end;
        this.resourceId = resourceId;
        this.backgroundColor = backgroundColor;
        this.borderColor = borderColor;
    }
}