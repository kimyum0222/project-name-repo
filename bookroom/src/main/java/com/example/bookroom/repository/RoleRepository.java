package com.example.bookroom.repository;

import com.example.bookroom.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * RoleRepository (角色仓库).
 * 继承 JpaRepository 来获得所有基础的数据库操作功能.
 * 我们要操作的实体是 Role，它的主键(ID)类型是 Long.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // 这里也是空的，所有功能都已由 Spring Data JPA 自动提供.
}
