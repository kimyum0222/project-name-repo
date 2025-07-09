package com.example.bookroom.repository;

import com.example.bookroom.model.MeetingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // <<<<<<< 添加这行

@Repository
public interface MeetingTypeRepository extends JpaRepository<MeetingType, Long> {

    /**
     * 查询所有未被停用的会议类型。
     * @return 未被停用的会议类型列表
     */
    List<MeetingType> findByDisabledFalse();
}