package com.example.bookroom.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * ServiceItem (会议服务项) 实体类.
 * 它将映射到数据库中的 "service_items" 表.
 */
@Entity
@Table(name = "service_items")
@Data // Lombok 注解，自动生成 Getters, Setters, toString 等方法
public class ServiceItem {

    /**
     * 服务ID，作为主键.
     * @GeneratedValue(strategy = GenerationType.IDENTITY)
     * 表示这个ID将由数据库自动生成和自增长，我们不需要手动设置.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 服务名称.
     * nullable = false 表示这个字段不能为空.
     * unique = true 表示每个服务的名称都必须是唯一的，不能重复.
     */
    @Column(name = "service_name", nullable = false, unique = true)
    private String serviceName;

    /**
     * 是否停用.
     * 默认为 false (即“启用”).
     */
    @Column(name = "disabled", nullable = false)
    private boolean disabled = false;
}
