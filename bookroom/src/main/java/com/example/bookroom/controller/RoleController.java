package com.example.bookroom.controller;

import com.example.bookroom.model.Role;
import com.example.bookroom.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * RoleController (角色接口).
 * 负责处理所有与角色相关的API请求.
 */
@RestController
@RequestMapping("/api/roles")
//@CrossOrigin(origins = "*")//
public class RoleController {

    @Autowired
    private RoleService roleService;

    // GET /api/roles - 获取所有角色
    @GetMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    // POST /api/roles - 添加一个新角色
    @PostMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<Role> addRole(@RequestBody Role role) {
        // 前端通常只发送 roleName，我们创建一个新对象来保存
        Role newRole = new Role();
        newRole.setRoleName(role.getRoleName());
        return new ResponseEntity<>(roleService.addRole(newRole), HttpStatus.CREATED);
    }

    // PUT /api/roles/{id} - 修改一个角色
    @PutMapping(value = "/{id}", produces = "application/json;charset=UTF-8")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody Role roleDetails) {
        return ResponseEntity.ok(roleService.updateRole(id, roleDetails));
    }

    // DELETE /api/roles/{id} - 删除一个角色
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    // POST /api/roles/{roleId}/members - 为角色添加一个成员
    @PostMapping("/{roleId}/members")
    public ResponseEntity<Void> addMemberToRole(@PathVariable Long roleId, @RequestBody Map<String, String> payload) {
        String memberId = payload.get("memberId");
        roleService.addMemberToRole(roleId, memberId);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/roles/{roleId}/members/{memberId} - 从角色中移除一个成员
    @DeleteMapping("/{roleId}/members/{memberId}")
    public ResponseEntity<Void> removeMemberFromRole(@PathVariable Long roleId, @PathVariable String memberId) {
        roleService.removeMemberFromRole(roleId, memberId);
        return ResponseEntity.noContent().build();
    }
}
