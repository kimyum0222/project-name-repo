package com.example.bookroom.model;

// vvv--- 引入JPA需要的注解 ---vvv
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
// ^^^-----------------------^^^

import lombok.Data;
import lombok.NoArgsConstructor; // <-- 新增：Lombok 生成无参构造函数
import lombok.AllArgsConstructor; // <-- 新增：Lombok 生成全参构造函数


/**
 * ConferenceRoom 实体类.
 * @Entity 注解表明这是一个JPA实体，它会映射到数据库中的一张表.
 * @Table 注解指定了数据库中对应的表的名称.
 */
@Entity
@Table(name = "conference_rooms")
@Data
@NoArgsConstructor // 添加一个无参构造函数，JPA 需要
@AllArgsConstructor // 添加一个全参构造函数
public class ConferenceRoom {

    /**
     * 会议室房号，作为主键.
     * @Id 注解将这个字段标记为表的主键.
     * 我们使用Excel中的房号作为唯一标识符.
     */
    @Id
    @Column(name = "room_number")
    private String roomNumber;

    /**
     * 会议室名称.
     * @Column 注解可以用来指定列的详细信息，如果省略，则默认使用字段名.
     */
    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "managing_unit")
    private String managingUnit;

    @Column(name = "projection_device")
    private String projectionDevice;

    @Column(name = "computer_config")
    private String computerConfig;
}
