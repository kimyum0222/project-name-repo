package com.example.bookroom.model; // 保持在 com.example.bookroom 包下，或者您根据需要创建新的子包如 com.example.bookroom.meeting

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data; // 确保您的项目中添加了 Lombok 依赖

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 会议查询模块的会议实体。
 * 独立于 ConferenceEvent，用于会议明细查询和管理。
 */
@Entity
@Data // Lombok 注解，自动生成 getter, setter, toString, equals, hashCode
@Table(name = "meeting_details") // 新的表名，与 conference_event 区分
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID 自动递增
    private Long id;               // 申请单号 (Long 类型，对应数据库自增)
    private String name;           // 会议名称
    private LocalDate date;        // 日期
    private LocalTime startTime;   // 开始时间
    private LocalTime endTime;     // 结束时间
    private String room;           // 会议室
    private String initiator;      // 发起人
    private String status;         // 审核状态 (审核中, 已审核)
    private Boolean attachment;    // 是否有附件

    // 默认构造函数
    public Meeting() {}

    // 如果不使用 Lombok 的 @Data，则需要手动添加所有字段的 Getter 和 Setter 方法。
}