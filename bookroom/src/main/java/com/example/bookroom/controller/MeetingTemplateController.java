package com.example.bookroom.controller;

import com.example.bookroom.model.MeetingTemplate;
import com.example.bookroom.service.MeetingTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 会议模板控制器
 * 提供模板管理的API接口
 */
@CrossOrigin 
 @RestController
@RequestMapping("/api/templates")
public class MeetingTemplateController {

    private final MeetingTemplateService templateService;

    @Autowired
    public MeetingTemplateController(MeetingTemplateService templateService) {
        this.templateService = templateService;
    }

    /**
     * 获取所有模板
     * GET /api/templates
     */
    @GetMapping
    public ResponseEntity<List<MeetingTemplate>> getAllTemplates() {
        return ResponseEntity.ok(templateService.getAllTemplates());
    }

    /**
     * 根据ID获取模板
     * GET /api/templates/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<MeetingTemplate> getTemplateById(@PathVariable String id) {
        MeetingTemplate template = templateService.getTemplateById(id);
        if (template != null) {
            return ResponseEntity.ok(template);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * 创建新模板
     * POST /api/templates
     */
    @PostMapping
    public ResponseEntity<MeetingTemplate> createTemplate(@RequestBody MeetingTemplate template) {
        return ResponseEntity.ok(templateService.createTemplate(template));
    }

    /**
     * 更新模板
     * PUT /api/templates/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<MeetingTemplate> updateTemplate(
            @PathVariable String id,
            @RequestBody MeetingTemplate updatedTemplate) {
        MeetingTemplate result = templateService.updateTemplate(id, updatedTemplate);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * 删除模板
     * DELETE /api/templates/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
}