package com.example.bookroom.controller;

import com.example.bookroom.model.ServiceItem;
import com.example.bookroom.service.ServiceItemService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services") // 我们为服务管理API定义一个新的基础路径
//@CrossOrigin(origins = "*")
public class ServiceItemController {

    @Autowired
    private ServiceItemService serviceItemService;

    // GET /api/services - 获取所有服务项
    @GetMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<List<ServiceItem>> getAllServiceItems() {
        List<ServiceItem> items = serviceItemService.getAllServiceItems();
        return ResponseEntity.ok(items);
    }

    // POST /api/services - 添加一个新服务项
    @PostMapping(produces = "application/json;charset=UTF-8")
    public ResponseEntity<ServiceItem> addServiceItem(@RequestBody ServiceItem serviceItem) {
        try {
            ServiceItem newItem = serviceItemService.addServiceItem(serviceItem);
            return new ResponseEntity<>(newItem, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // PUT /api/services/{id} - 修改一个服务项
    @PutMapping(value = "/{id}", produces = "application/json;charset=UTF-8")
    public ResponseEntity<?> updateServiceItem(@PathVariable Long id, @RequestBody ServiceItem serviceItem) {
        try {
            ServiceItem updatedItem = serviceItemService.updateServiceItem(id, serviceItem);
            return ResponseEntity.ok(updatedItem);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // DELETE /api/services/{id} - 删除一个服务项
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> deleteServiceItem(@PathVariable Long id) {
        try {
            serviceItemService.deleteServiceItem(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
