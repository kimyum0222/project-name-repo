package com.example.bookroom.repository; // 保持在 com.example.bookroom.repository 包下

import com.example.bookroom.model.Meeting; // 导入新的 Meeting 实体
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> { // 针对 Meeting 实体和 Long 类型ID

    /**
     * 根据日期范围和审核状态查询会议。
     * @param startDate 查询的开始日期
     * @param endDate 查询的结束日期
     * @param status 审核状态
     * @return 匹配的会议列表
     */
    List<Meeting> findByDateBetweenAndStatus(LocalDate startDate, LocalDate endDate, String status);

    /**
     * 根据日期范围查询会议。
     * @param startDate 查询的开始日期
     * @param endDate 查询的结束日期
     * @return 匹配的会议列表
     */
    List<Meeting> findByDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * 根据审核状态查询会议。
     * @param status 审核状态
     * @return 匹配的会议列表
     */
    List<Meeting> findByStatus(String status);

    // 您还可以添加其他查询方法，例如按会议室、发起人等，如果前端有需求
    // List<Meeting> findByRoomAndDateBetween(String room, LocalDate startDate, LocalDate endDate);
    // List<Meeting> findByInitiator(String initiator);
}