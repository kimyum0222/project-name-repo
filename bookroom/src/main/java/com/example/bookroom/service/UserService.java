package com.example.bookroom.service;

import com.example.bookroom.model.User;
import com.example.bookroom.repository.UserRepository;
import jakarta.annotation.PostConstruct; // 导入这个注解
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays; // 导入 Arrays
import java.util.List;

/**
 * UserService (人员服务).
 * 负责处理所有与用户相关的业务逻辑.
 */
@Service
public class UserService {

    // 使用 @Autowired，让 Spring Boot 自动把 UserRepository "指令官" 注入进来
    @Autowired
    private UserRepository userRepository;

    /**
     * 项目启动时初始化用户数据（如果数据库中没有用户）
     * 只有当 userRepository.count() 为 0 时（即表为空），才执行数据插入。
     */
    @PostConstruct
    public void initUsers() {
        if (userRepository.count() == 0) { // 检查用户表是否为空
            List<User> users = Arrays.asList(
                // 您可以在这里添加更多用户
                new User("张三", "001"),
                new User("李四", "002"),
                new User("王五", "003"),
                new User("赵六", "004"),
                new User("谢红民", "005"), // 添加一个之前模板中出现过的名字，确保能匹配上
                new User("刘七", "006"),
                new User("钱八", "007")
            );
            userRepository.saveAll(users);
            System.out.println("UserService: 用户数据初始化完成。已添加 " + users.size() + " 条用户记录。");
        } else {
            System.out.println("UserService: 用户表已存在数据，跳过初始化。");
        }
    }

    /**
     * 获取所有用户.
     * @return 数据库中所有用户的列表.
     */
    public List<User> getAllUsers() {
        // 直接调用 UserRepository 自带的 findAll() 方法
        return userRepository.findAll();
    }
}