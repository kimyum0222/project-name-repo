package com.example.bookroom; // 或者您的主应用所在的包

import com.example.bookroom.model.Meeting;
import com.example.bookroom.repository.MeetingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 在应用启动时加载初始会议数据到H2数据库。
 */
@Configuration // 标记这是一个配置类
public class MeetingDataLoader {

    @Bean // 声明为一个Bean，Spring Boot会在启动时自动查找并执行它
    public CommandLineRunner loadMeetingData(MeetingRepository meetingRepository) {
        return (args) -> {
            // 检查数据库是否已经有数据，避免重复插入
            if (meetingRepository.count() == 0) {
                System.out.println("Loading initial meeting data...");

                Meeting meeting1 = new Meeting();
                // 注意：Meeting 的 ID 是数据库自动生成的，所以这里不需要设置
                meeting1.setName("第一季度总结");
                meeting1.setDate(LocalDate.of(2025, 7, 1));
                meeting1.setStartTime(LocalTime.of(9, 0));
                meeting1.setEndTime(LocalTime.of(11, 0));
                meeting1.setRoom("第一会议室");
                meeting1.setInitiator("张三");
                meeting1.setStatus("已审核");
                meeting1.setAttachment(true);
                meetingRepository.save(meeting1);

                Meeting meeting2 = new Meeting();
                meeting2.setName("新项目启动会");
                meeting2.setDate(LocalDate.of(2025, 7, 2));
                meeting2.setStartTime(LocalTime.of(14, 0));
                meeting2.setEndTime(LocalTime.of(15, 30));
                meeting2.setRoom("第二会议室");
                meeting2.setInitiator("李四");
                meeting2.setStatus("审核中");
                meeting2.setAttachment(false);
                meetingRepository.save(meeting2);

                Meeting meeting3 = new Meeting();
                meeting3.setName("技术分享");
                meeting3.setDate(LocalDate.of(2025, 7, 3));
                meeting3.setStartTime(LocalTime.of(10, 0));
                meeting3.setEndTime(LocalTime.of(12, 0));
                meeting3.setRoom("第五会议室");
                meeting3.setInitiator("王五");
                meeting3.setStatus("审核中");
                meeting3.setAttachment(true);
                meetingRepository.save(meeting3);

                System.out.println("Initial meeting data loaded successfully.");
            } else {
                System.out.println("Meeting data already exists, skipping initial data loading.");
            }
        };
    }
}