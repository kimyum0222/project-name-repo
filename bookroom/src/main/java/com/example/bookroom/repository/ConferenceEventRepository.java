//package com.example.bookroom.repository;

//import com.example.bookroom.model.ConferenceEvent;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;

//import java.time.LocalDateTime;
//import java.util.List;

//@Repository
//public interface ConferenceEventRepository extends JpaRepository<ConferenceEvent, String> {

    // 查询指定日期范围内的会议 - 使用正确的列名
  //  @Query("SELECT e FROM ConferenceEvent e " +
    //        "WHERE e.start >= :start AND e.end <= :end")
    //List<ConferenceEvent> findByDateRange(LocalDateTime start, LocalDateTime end);

    // 查询所有会议
    //@Override
    //List<ConferenceEvent> findAll();
//}//