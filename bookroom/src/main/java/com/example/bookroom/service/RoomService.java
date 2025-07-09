package com.example.bookroom.service;

import com.example.bookroom.model.ConferenceRoom;
import com.example.bookroom.repository.ConferenceRoomRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.annotation.PostConstruct; // <-- 确保导入这个注解
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays; // <-- 确保导入这个类
import java.util.List;

@Service
public class RoomService {

    @Autowired
    private ConferenceRoomRepository conferenceRoomRepository;

    // === vvv 新增的初始化方法 vvv ===
    @PostConstruct
    public void initRooms() {
        // 检查数据库中是否已有数据，避免重复添加
        if (conferenceRoomRepository.count() == 0) {
            List<ConferenceRoom> rooms = Arrays.asList(
                // 请根据您的实际需求，填写一些会议室数据
                new ConferenceRoom("R001", "第一会议室", "办公楼三楼主楼", 10, "投影仪, 白板", "IT部", "PC, 麦克风"),
                new ConferenceRoom("R002", "第二会议室", "办公楼四楼主楼", 15, "投影仪", "行政部", "PC"),
                new ConferenceRoom("R003", "第三会议室", "办公楼四楼主楼", 8, "白板", "行政部", "无"),
                new ConferenceRoom("R004", "第四会议室", "研发楼二楼", 20, "大屏, 视频会议系统", "研发部", "PC, 摄像头, 麦克风"),
                new ConferenceRoom("R005", "第五会议室", "办公楼四楼主楼", 12, "投影仪", "行政部", "无"),
                new ConferenceRoom("R006", "619会议室", "办公楼六楼", 6, "无", "IT部", "无"),
                new ConferenceRoom("R007", "学术会议室", "办公楼五楼主楼", 50, "投影仪, 音响, 讲台", "行政部", "PC, 麦克风")
            );
            // 假设ConferenceRoom的ID是roomNumber，并且是String类型。
            // 如果ID是自动生成的，您可能需要调整ConferenceRoom构造函数或使用Setter。
            // 注意：您当前的addRoom方法中使用了room.getRoomNumber()作为ID，所以这里初始化也应该包含ID。
            conferenceRoomRepository.saveAll(rooms);
            System.out.println("RoomService: 会议室数据初始化完成。已添加 " + rooms.size() + " 条会议室记录。");
        } else {
            System.out.println("RoomService: 会议室表已存在数据，跳过初始化。");
        }
    }
    // === ^^^ 新增的初始化方法 ^^^ ===


    /**
     * 从数据库获取所有会议室。
     */
    public List<ConferenceRoom> getAllRooms() {
        return conferenceRoomRepository.findAll();
    }

    /**
     * 添加一个新的会议室到数据库。
     */
    public ConferenceRoom addRoom(ConferenceRoom room) {
        // 注意：这里您使用了 room.getRoomNumber() 作为 ID 的存在性检查。
        // 请确保 ConferenceRoom 实体中的 ID 字段是 roomNumber，并且是 String 类型。
        if (conferenceRoomRepository.existsById(room.getRoomNumber())) {
            throw new IllegalArgumentException("错误：会议室房号 '" + room.getRoomNumber() + "' 已存在！");
        }
        return conferenceRoomRepository.save(room);
    }

    /**
     * === vvv 新增的“修改”功能 vvv ===
     * 修改一个已存在的会议室。
     * @param roomNumber 要修改的会议室的房号 (ID)
     * @param roomDetails 包含新数据的会议室对象
     * @return 更新后的会议室对象
     */
    public ConferenceRoom updateRoom(String roomNumber, ConferenceRoom roomDetails) {
        ConferenceRoom existingRoom = conferenceRoomRepository.findById(roomNumber)
                .orElseThrow(() -> new EntityNotFoundException("错误：找不到房号为 '" + roomNumber + "' 的会议室！"));

        existingRoom.setName(roomDetails.getName());
        existingRoom.setAddress(roomDetails.getAddress());
        existingRoom.setCapacity(roomDetails.getCapacity());
        existingRoom.setManagingUnit(roomDetails.getManagingUnit());
        existingRoom.setProjectionDevice(roomDetails.getProjectionDevice());
        existingRoom.setComputerConfig(roomDetails.getComputerConfig());

        return conferenceRoomRepository.save(existingRoom);
    }

    /**
     * === vvv 新增的“删除”功能 vvv ===
     * 根据房号删除一个会议室。
     * @param roomNumber 要删除的会议室的房号 (ID)
     */
    public void deleteRoom(String roomNumber) {
        if (!conferenceRoomRepository.existsById(roomNumber)) {
            throw new EntityNotFoundException("错误：找不到房号为 '" + roomNumber + "' 的会议室，无法删除！");
        }
        conferenceRoomRepository.deleteById(roomNumber);
    }
}