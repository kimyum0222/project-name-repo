package com.example.bookroom.repository;

import com.example.bookroom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * UserRepository (人员仓库).
 * 继承 JpaRepository 来获得所有基础的数据库操作功能.
 * 我们要操作的实体是 User，它的主键(ID)类型是 String.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // 这里是空的，但我们已经拥有了 findAll(), findById(), save() 等所有魔法.
}
