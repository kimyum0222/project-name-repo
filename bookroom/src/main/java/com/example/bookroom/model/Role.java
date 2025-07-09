package com.example.bookroom.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * Role (角色) 实体类.
 * 它将映射到数据库中的 "meeting_roles" 表.
 */
@Entity
@Table(name = "meeting_roles")
@Data
public class Role {

    /**
     * 角色的ID，由数据库自动生成和自增长.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 角色的名称，我们要求它不能为空且唯一.
     */
    @Column(nullable = false, unique = true)
    private String roleName;

    /**
     * 存储与此角色关联的所有人员的工号(ID)列表.
     * @ElementCollection 是一个JPA注解，专门用来处理这种“一个实体包含一个基础类型集合”的情况.
     * 它会自动创建一张名为 "role_members" 的中间表来存储这些关系.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "role_members", joinColumns = @JoinColumn(name = "role_id"))
    @Column(name = "member_id")
    private List<String> memberIds = new ArrayList<>();
}

