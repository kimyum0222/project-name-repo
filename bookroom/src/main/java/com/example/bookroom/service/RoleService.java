package com.example.bookroom.service;

import com.example.bookroom.model.Role;
import com.example.bookroom.repository.RoleRepository;
import com.example.bookroom.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * RoleService (角色服务).
 * 负责处理所有与角色相关的业务逻辑.
 */
@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository; // 我们也需要它来检查用户是否存在

    /**
     * 获取所有角色.
     */
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    /**
     * 添加一个新角色.
     * @Transactional 注解确保这个操作是一个完整的事务.
     */
    @Transactional
    public Role addRole(Role role) {
        // 在真实应用中，可以在这里增加对角色名是否已存在的检查
        return roleRepository.save(role);
    }

    /**
     * 修改一个已存在的角色名称.
     */
    @Transactional
    public Role updateRole(Long id, Role roleDetails) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("未找到ID为 " + id + " 的角色"));
        
        role.setRoleName(roleDetails.getRoleName());
        return roleRepository.save(role);
    }

    /**
     * 删除一个角色.
     */
    @Transactional
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new EntityNotFoundException("未找到ID为 " + id + " 的角色，无法删除");
        }
        roleRepository.deleteById(id);
    }

    /**
     * 为一个角色添加一个成员.
     */
    @Transactional
    public void addMemberToRole(Long roleId, String memberId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException("未找到ID为 " + roleId + " 的角色"));
        
        // 检查要添加的用户是否存在于用户表中
        userRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("未找到工号为 " + memberId + " 的用户"));
        
        // 如果成员ID尚未在列表中，则添加
        if (!role.getMemberIds().contains(memberId)) {
            role.getMemberIds().add(memberId);
            roleRepository.save(role); // 保存更新后的角色
        }
    }

    /**
     * 从一个角色中移除一个成员.
     */
    @Transactional
    public void removeMemberFromRole(Long roleId, String memberId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException("未找到ID为 " + roleId + " 的角色"));
        
        role.getMemberIds().remove(memberId);
        roleRepository.save(role); // 保存更新后的角色
    }
}