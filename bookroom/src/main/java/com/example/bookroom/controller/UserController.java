package com.example.bookroom.controller;

import com.example.bookroom.model.User;
import com.example.bookroom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * UserController (人员接口).
 * 负责处理所有与用户相关的API请求.
 */
@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "*") // 允许所有来源的前端访问//
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 处理 GET /api/users 请求.
     * @return 包含所有用户的列表.
     */
    @GetMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
