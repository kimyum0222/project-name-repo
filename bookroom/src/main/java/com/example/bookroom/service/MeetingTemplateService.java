package com.example.bookroom.service;

import com.example.bookroom.model.MeetingTemplate;
import com.example.bookroom.repository.MeetingTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * 会议模板服务类
 * 负责模板的存储、读取和操作
 */
@Service
public class MeetingTemplateService {

    private final MeetingTemplateRepository templateRepository;

    @Autowired
    public MeetingTemplateService(MeetingTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    /**
     * 项目启动时初始化模板数据
     */
    @PostConstruct
    public void initTemplates() {
        if (templateRepository.count() == 0) {
            List<MeetingTemplate> templates = Arrays.asList(
                    new MeetingTemplate("1", "IATF16949、ISOTS22163体系审核", "专题会议",
                            "第一会议室(办公楼三楼主楼)", "IATF16949、ISOTS22163体系审核首次会议", ""),
                    new MeetingTemplate("2", "质量管理体系内部审核首次会议", "专题会议",
                            "第三会议室(办公楼四楼主楼)", "质量管理体系内部审核首次会议", ""),
                    new MeetingTemplate("3", "计算机设备招标会", "招标会",
                            "第五会议室(办公楼四楼主楼)", "VDA6.5 产品审核标准培训", "谢红民"),
                    new MeetingTemplate("4", "VDA6.5 产品审核标准培训", "专题会议",
                            "619会议室(办公楼六楼)", "RCL认证审核首次会议", "谢红民"),
                    new MeetingTemplate("5", "RCL认证审核", "专题会议",
                            "第一会议室(办公楼三楼主楼)", "ASI CoC标准化认证审核首次会议", "谢红民"),
                    new MeetingTemplate("6", "ASI CoC标准化认证审核", "专题会议",
                            "第二会议室(办公楼四楼主楼)", "质量月活动讨论和动员会", "谢红民"),
                    new MeetingTemplate("7", "质量月活动讨论和动员会", "交流会",
                            "第一会议室(办公楼三楼主楼)", "", ""),
                    new MeetingTemplate("8", "总经理办公室", "办公室",
                            "第二会议室(办公楼三楼主楼)", "", ""),
                    new MeetingTemplate("9", "党委会", "党委会",
                            "第一会议室(办公楼三楼主楼)", "", ""),
                    new MeetingTemplate("10", "ASI PS标准认证审核", "专题会议",
                            "第一会议室(办公楼三楼主楼)", "ASI PS标准认证审核", "谢红民"),
                    new MeetingTemplate("11", "远程审核委员会", "专题会议",
                            "第三会议室(办公楼四楼主楼)", "针对外部远程审核的方案进行现场审查和反馈的...", "谢红民"),
                    new MeetingTemplate("12", "OCA-组活动实务培训", "专题会议",
                            "619会议室(办公楼六楼)", "OCA-组活动实务培训", "谢红民"),
                    new MeetingTemplate("13", "调度会", "研讨会",
                            "第三会议室(办公楼四楼主楼)", "ISO 22163：2023 政府行业质量管理体系系统培训", "谢红民"),
                    new MeetingTemplate("14", "ISO 22163：2023 政府行业质量管理体系系统培训", "专题会议",
                            "619会议室(办公楼六楼)", "质量管理体系系统培训培训", "谢红民"),
                    new MeetingTemplate("15", "质量管理体系系统培训培训", "专题会议",
                            "第一会议室(办公楼三楼主楼)", "质量管理体系系统培训培训", "谢红民"),
                    new MeetingTemplate("16", "季度报告分析会", "专题会议",
                            "学术会议室(办公楼五楼主楼)", "ASI认证项目辅导", "谢红民"),
                    new MeetingTemplate("17", "ASI认证项目辅导", "专题会议",
                            "第一会议室(办公楼三楼主楼)", "", ""),
                    new MeetingTemplate("18", "机关一支部会", "交流会",
                            "第一会议室(办公楼三楼主楼)", "", ""),
                    new MeetingTemplate("19", "生产经营协会", "经营协会",
                            "第一会议室(办公楼三楼主楼)", "OEO管理体系认证审核首次会议", ""),
                    new MeetingTemplate("20", "OEO管理体系认证审核", "专题会议",
                            "第二会议室(办公楼四楼主楼)", "部门间例会", ""),
                    new MeetingTemplate("21", "工作交流会", "交流会",
                            "第一会议室(办公楼四楼主楼)", "绿色建材产品认证审核首次会议", "谢红民"),
                    new MeetingTemplate("22", "绿色建材产品认证审核", "专题会议",
                            "第二会议室(办公楼四楼主楼)", "2023年度OCA-组活动抽题评审", "谢红民")
            );
            templateRepository.saveAll(templates);
        }
    }

    /**
     * 获取所有模板
     */
    public List<MeetingTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    /**
     * 根据ID获取模板
     */
    public MeetingTemplate getTemplateById(String id) {
        return templateRepository.findById(id).orElse(null);
    }

    /**
     * 创建新模板
     */
    public MeetingTemplate createTemplate(MeetingTemplate template) {
        // 生成唯一ID
        if (template.getId() == null || template.getId().isEmpty()) {
            template.setId(UUID.randomUUID().toString());
        }
        return templateRepository.save(template);
    }

    /**
     * 更新模板
     */
    public MeetingTemplate updateTemplate(String id, MeetingTemplate updatedTemplate) {
        if (templateRepository.existsById(id)) {
            updatedTemplate.setId(id);
            return templateRepository.save(updatedTemplate);
        }
        return null;
    }

    /**
     * 删除模板
     */
    public void deleteTemplate(String id) {
        templateRepository.deleteById(id);
    }
}