// ServiceItemService.java
package com.example.bookroom.service;

import com.example.bookroom.model.ServiceItem;
import com.example.bookroom.repository.ServiceItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceItemService {

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    // 获取所有服务项 (已修改：现在返回所有服务项，包括停用的)
    public List<ServiceItem> getAllServiceItems() {
        return serviceItemRepository.findAll(); // 将 findByDisabledFalse() 改为 findAll()
    }

    // 添加新服务项
    public ServiceItem addServiceItem(ServiceItem serviceItem) {
        // 在实际应用中，这里可以添加更多验证逻辑
        return serviceItemRepository.save(serviceItem);
    }

    // 修改服务项
    public ServiceItem updateServiceItem(Long id, ServiceItem serviceDetails) {
        ServiceItem existingService = serviceItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("找不到ID为 " + id + " 的服务项"));

        existingService.setServiceName(serviceDetails.getServiceName());
        existingService.setDisabled(serviceDetails.isDisabled()); // 允许修改停用状态

        return serviceItemRepository.save(existingService);
    }

    // 删除服务项
    public void deleteServiceItem(Long id) {
        if (!serviceItemRepository.existsById(id)) {
            throw new EntityNotFoundException("找不到ID为 " + id + " 的服务项，无法删除");
        }
        serviceItemRepository.deleteById(id);
    }
}