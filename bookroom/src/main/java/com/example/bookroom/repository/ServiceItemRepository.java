// ServiceItemRepository.java
package com.example.bookroom.repository;

import com.example.bookroom.model.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // <<<<<<< 确保导入 List

/**
 * ServiceItem 的 Repository 接口.
 * 继承 JpaRepository 来获得所有基础的数据库操作功能.
 * 我们要操作的实体是 ServiceItem，它的主键(ID)类型是 Long.
 */
@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    /**
     * 查询所有未被停用的服务项。
     * @return 未被停用的服务项列表
     */
    List<ServiceItem> findByDisabledFalse(); // 新增这行
}