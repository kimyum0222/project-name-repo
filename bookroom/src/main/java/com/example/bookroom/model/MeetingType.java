package com.example.bookroom.model;

import jakarta.persistence.*;
import lombok.Data; // 保持这个导入

/**
 * MeetingType (会议类型) 实体类.
 * 它将映射到数据库中的 "meeting_types" 表.
 */
@Entity
@Table(name = "meeting_types")
@Data // Lombok 会自动生成 Getter/Setter，hashCode/equals，toString，但不会影响我们手动添加构造函数
public class MeetingType {

    /**
     * 会议类型的ID，由数据库自动生成和自增长.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 会议类型的名称，我们要求它不能为空且唯一.
     * 在前端对应 `form.type`.
     */
    @Column(name = "type_name", nullable = false, unique = true)
    private String typeName;

    /**
     * 类型备注.
     */
    @Column(name = "remark")
    private String remark;

    /**
     * 是否停用.
     * 默认为 false (即“启用”).
     */
    @Column(name = "disabled", nullable = false)
    private boolean disabled = false;

    // --- 新增的构造函数 ---
    // 无参构造函数：这是JPA规范要求的实体类必须有的公共无参构造函数
    public MeetingType() {
    }

    // 接受 typeName 的构造函数：
    // 用于在初始化数据时只传入类型名称。
    // remark 和 disabled 会使用它们的默认值 (null 和 false)。
    public MeetingType(String typeName) {
        this.typeName = typeName;
        // remark 和 disabled 会自动初始化为字段定义时的默认值 (null 和 false)
        // 如果您希望显式设置，可以取消下面两行的注释：
        // this.remark = "";
        // this.disabled = false;
    }
    // --- 结束新增的构造函数 ---

    // Getter 和 Setter 方法由 @Data 自动生成，不需要手动写在这里，
    // 但为了代码可读性，这里注释掉提示它们的存在。
    // public Long getId() { ... }
    // public void setId(Long id) { ... }
    // public String getTypeName() { ... }
    // public void setTypeName(String typeName) { ... }
    // public String getRemark() { ... }
    // public void setRemark(String remark) { ... }
    // public boolean isDisabled() { ... }
    // public void setDisabled(boolean disabled) { ... }
}