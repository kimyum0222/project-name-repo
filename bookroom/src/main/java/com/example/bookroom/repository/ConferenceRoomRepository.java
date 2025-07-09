package com.example.bookroom.repository;

import com.example.bookroom.model.ConferenceRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * ConferenceRoom Repository (数据仓库/指令官).
 * 这是一个接口，它继承了 Spring Data JPA 的 JpaRepository.
 * JpaRepository 提供了所有基础的数据库操作 (CRUD - Create, Read, Update, Delete).
 * 我们只需要定义这个接口，Spring Boot 就会在运行时自动为我们实现它.
 *
 * @Repository 注解将这个接口标记为一个 Spring Bean，方便在其他地方注入和使用.
 */
@Repository
public interface ConferenceRoomRepository extends JpaRepository<ConferenceRoom, String> {
    // 这个接口里面通常是空的.
    // 我们不需要写任何方法，就已经拥有了 findAll(), findById(), save(), deleteById() 等所有功能.
    // 如果未来有特殊的查询需求（比如“根据管理单位查询会议室”），我们才需要在这里定义新的方法.
}
