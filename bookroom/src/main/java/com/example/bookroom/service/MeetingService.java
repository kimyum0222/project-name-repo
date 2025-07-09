package com.example.bookroom.service; // 保持在 com.example.bookroom.service 包下

import com.example.bookroom.model.Meeting; // 导入新的 Meeting 实体
import com.example.bookroom.repository.MeetingRepository; // 导入新的 MeetingRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * MeetingService (会议服务).
 * 负责处理会议查询页面的查询、新增、修改、删除业务逻辑。
 * 独立于 ConferenceCalendarService。
 */
@Service
public class MeetingService {

    @Autowired
    private MeetingRepository meetingRepository;

    /**
     * 根据查询条件获取会议列表。
     * 对应前端的 "统计" 按钮。
     * @param startDate 查询的开始日期 (如果dateRange有值)
     * @param endDate 查询的结束日期 (如果dateRange有值)
     * @param status 审核状态 (如果status有值)
     * @param showAll 是否显示所有 (如果为true，则忽略日期和状态过滤)
     * @return 符合条件的会议列表
     */
    public List<Meeting> searchMeetings(
            LocalDate startDate, LocalDate endDate, String status, Boolean showAll) {

        if (showAll != null && showAll) {
            return meetingRepository.findAll(); // 显示所有，返回所有会议
        }

        if (startDate != null && endDate != null && status != null && !status.isEmpty()) {
            // 按日期范围和状态查询
            return meetingRepository.findByDateBetweenAndStatus(startDate, endDate, status);
        } else if (startDate != null && endDate != null) {
            // 只按日期范围查询
            return meetingRepository.findByDateBetween(startDate, endDate);
        } else if (status != null && !status.isEmpty()) {
            // 只按状态查询
            return meetingRepository.findByStatus(status);
        } else {
            // 如果没有具体查询条件（且showAll为false），可以返回默认的，例如所有。
            return meetingRepository.findAll();
        }
    }

    /**
     * 新建会议。
     * @param meeting 会议对象 (前端提交的 form 数据会映射到此)
     * @return 新建并保存的会议
     */
    @Transactional
    public Meeting createMeeting(Meeting meeting) {
        // 设置默认状态为 "审核中"
        if (meeting.getStatus() == null || meeting.getStatus().isEmpty()) {
            meeting.setStatus("审核中");
        }
        // 设置默认附件状态为 false
        if (meeting.getAttachment() == null) {
            meeting.setAttachment(false);
        }
        return meetingRepository.save(meeting);
    }

    /**
     * 修改会议。
     * @param id 会议ID
     * @param meetingDetails 包含更新内容的会议对象
     * @return 更新后的会议 (Optional)
     */
    @Transactional
    public Optional<Meeting> updateMeeting(Long id, Meeting meetingDetails) {
        return meetingRepository.findById(id).map(existingMeeting -> {
            // 更新前端表单中可修改的字段
            existingMeeting.setName(meetingDetails.getName());
            existingMeeting.setDate(meetingDetails.getDate());
            existingMeeting.setStartTime(meetingDetails.getStartTime());
            existingMeeting.setEndTime(meetingDetails.getEndTime());
            existingMeeting.setRoom(meetingDetails.getRoom());
            existingMeeting.setInitiator(meetingDetails.getInitiator());
            existingMeeting.setStatus(meetingDetails.getStatus()); // 允许修改状态
            existingMeeting.setAttachment(meetingDetails.getAttachment()); // 允许修改附件状态

            return meetingRepository.save(existingMeeting);
        });
    }

    /**
     * 删除会议。
     * @param id 会议ID
     * @return true if deleted, false otherwise
     */
    @Transactional
    public boolean deleteMeeting(Long id) {
        if (meetingRepository.existsById(id)) {
            meetingRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * 根据ID获取单个会议详情。
     * @param id 会议ID
     * @return 会议详情 (Optional)
     */
    public Optional<Meeting> getMeetingById(Long id) {
        return meetingRepository.findById(id);
    }
}