// MeetingTypeService.java
package com.example.bookroom.service;

import com.example.bookroom.model.MeetingType;
import com.example.bookroom.repository.MeetingTypeRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/**
 * MeetingTypeService (会议类型服务).
 * 负责处理所有与会议类型相关的业务逻辑.
 */
@Service
public class MeetingTypeService {

    @Autowired
    private MeetingTypeRepository meetingTypeRepository;

    /**
     * 项目启动时初始化会议类型数据（如果数据库中没有类型）
     * 只有当 meetingTypeRepository.count() 为 0 时（即表为空），才执行数据插入。
     */
    @PostConstruct
    public void initMeetingTypes() {
        if (meetingTypeRepository.count() == 0) { // 检查会议类型表是否为空
            List<MeetingType> types = Arrays.asList(
                // 您可以在这里添加更多会议类型
                new MeetingType("广告招商会"),
                new MeetingType("专题会议"),
                new MeetingType("招标会"),
                new MeetingType("交流会"),
                new MeetingType("办公室"),
                new MeetingType("党委会"),
                new MeetingType("研讨会"),
                new MeetingType("经营协会"),
                new MeetingType("季度会议"),
                new MeetingType("日常会议")
            );
            meetingTypeRepository.saveAll(types);
            System.out.println("MeetingTypeService: 会议类型数据初始化完成。已添加 " + types.size() + " 条会议类型记录。");
        } else {
          System.out.println("MeetingTypeService: 会议类型表已存在数据，跳过初始化。");
        }
    }

    /**
     * 【重要更正】获取所有会议类型，包括已停用的。
     * 此方法用于管理页面，需要看到所有类型。
     * 确保这里是 findAll()，而不是 findByDisabledFalse()。
     */
    public List<MeetingType> getAllMeetingTypes() {
        return meetingTypeRepository.findAll(); // <--- 保持或修改为 findAll()
    }

    /**
     * 【新增方法，仅当需要时添加】获取所有未被停用的会议类型。
     * 此方法用于日历等需要过滤的页面。
     * 如果你的日历页面已经有调用 `meetingTypeService.getAll()`，
     * 且希望日历只显示启用的类型，则需要这个方法，并且在日历页面调用 `getEnabledMeetingTypes()`。
     */
    public List<MeetingType> getEnabledMeetingTypes() {
        // 假设 MeetingTypeRepository 中已经有 findByDisabledFalse() 方法
        return meetingTypeRepository.findByDisabledFalse();
    }


    /**
     * 添加一个新的会议类型.
     */
    @Transactional
    public MeetingType addMeetingType(MeetingType meetingType) {
        return meetingTypeRepository.save(meetingType);
    }

    /**
     * 修改一个已存在的会议类型.
     */
    @Transactional
    public MeetingType updateMeetingType(Long id, MeetingType typeDetails) {
        MeetingType existingType = meetingTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("未找到ID为 " + id + " 的会议类型"));

        existingType.setTypeName(typeDetails.getTypeName());
        existingType.setRemark(typeDetails.getRemark());
        existingType.setDisabled(typeDetails.isDisabled()); // 允许修改停用状态

        return meetingTypeRepository.save(existingType);
    }

    /**
     * 删除一个会议类型.
     */
    @Transactional
    public void deleteMeetingType(Long id) {
        if (!meetingTypeRepository.existsById(id)) {
            throw new EntityNotFoundException("未找到ID为 " + id + " 的会议类型，无法删除");
        }
        meetingTypeRepository.deleteById(id);
    }
}