package com.example.bookroom.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * User (人员) 实体类.
 * 它将映射到数据库中的 "users" 表.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * 人员的工号，我们将它作为主键 (Primary Key).
     * @Id 注解表明这是主键.
     */
    @Id
    private String id;

    /**
     * 人员的姓名.
     */
    private String name;
}
