package com.example.bookroom.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * 新建会议请求模型
 * 对应前端新建会议表单的数据结构
 */
@Data
public class NewMeetingRequest {
    private String title;               // 会议名称
    private String type;                // 会议类型（周例会/项目启动会）
    private String convener;            // 召集人
    private String contact;             // 联系人
    private String roomId;              // 会议室ID
    private String content;             // 会议内容
    private LocalDate date;             // 会议日期
    private LocalTime startTime;        // 开始时间
    private LocalTime endTime;          // 结束时间
    private List<String> services;      // 会议服务列表
    private List<String> internalAttendees; // 内部参会人员
}