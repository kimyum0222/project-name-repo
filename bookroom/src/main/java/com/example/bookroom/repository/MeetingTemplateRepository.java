package com.example.bookroom.repository;

import com.example.bookroom.model.MeetingTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository  // 添加此注解
public interface MeetingTemplateRepository extends JpaRepository<MeetingTemplate, String> {
    List<MeetingTemplate> findAll();
}