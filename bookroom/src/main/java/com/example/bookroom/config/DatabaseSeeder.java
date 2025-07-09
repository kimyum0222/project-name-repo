package com.example.bookroom.config;

import com.example.bookroom.model.ConferenceRoom;
import com.example.bookroom.model.MeetingType; // 引入新的模型
import com.example.bookroom.model.Role;
import com.example.bookroom.model.ServiceItem;
import com.example.bookroom.model.User;
import com.example.bookroom.repository.*; // 引入所有 Repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/**
 * 统一的数据播种器 (Database Seeder).
 * 在程序启动时，直接通过Java代码创建和保存所有模块的初始数据。
 */
@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired private ConferenceRoomRepository conferenceRoomRepository;
    @Autowired private ServiceItemRepository serviceItemRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private MeetingTypeRepository meetingTypeRepository; // 注入新的 Repository

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("数据库播种程序启动 (硬编码模式)...");
        
        seedUsers();
        seedRoles();
        seedServiceItems();
        seedConferenceRooms();
        seedMeetingTypes(); // vvv 调用我们新增的初始化方法 vvv

        System.out.println("数据库播种程序成功完成。");
    }

    /**
     * === vvv 新增的“会议类型”初始化方法 vvv ===
     */
    private void seedMeetingTypes() {
        if (meetingTypeRepository.count() > 0) {
            System.out.println("会议类型数据已存在，跳过初始化。");
            return;
        }
        System.out.println("正在初始化会议类型数据...");
        List<MeetingType> types = Arrays.asList(
            createMeetingType("广告推介会", "商务型", false),
            createMeetingType("经营例会", "工作性", false),
            createMeetingType("座谈会", "工作性", false),
            createMeetingType("理事会", "决策性", true),
            createMeetingType("视频会议", "工作性", false),
            createMeetingType("董事会", "决策性", false),
            createMeetingType("股东大会", "制度性", false),
            createMeetingType("调度会", "工作性", false),
            createMeetingType("党委会", "决策性", false),
            createMeetingType("茶话会", "联谊性", true),
            createMeetingType("招标会", "商务性", false),
            createMeetingType("专题会议", "专业性", false),
            createMeetingType("党代会", "制度性", false),
            createMeetingType("协调会", "工作性", true),
            createMeetingType("表彰会", "告知性", false),
            createMeetingType("庆祝会", "告知性", true),
            createMeetingType("团拜会", "联谊性", true),
            createMeetingType("工作会", "工作性", true),
            createMeetingType("研讨会", "专业性", false),
            createMeetingType("动员大会", "工作性", true),
            createMeetingType("招商会", "商务性", false),
            createMeetingType("办公会", "工作性", false),
            createMeetingType("行政会", "决策性", true),
            createMeetingType("交流会", "工作性", false)
        );
        meetingTypeRepository.saveAll(types);
        System.out.println("-> 会议类型数据初始化成功！");
    }

    // --- 下面的所有方法保持不变 ---

    private void seedUsers() {
        if (userRepository.count() > 0) { return; }
        System.out.println("正在初始化用户数据...");
        List<User> users = Arrays.asList(
            new User("0099", "郭剑峰"), new User("0150", "谢志军"), new User("0010", "陈德祥"),
            new User("1230", "吴世文"), new User("5129", "黄运东"), new User("1257", "陈铁勇"),
            new User("0417", "薛志全"), new User("2920", "沈文新"), new User("4300", "张磊"),
            new User("1900", "胡振兴"), new User("1347", "陈景春"), new User("0187", "程碧权"),
            new User("2541", "徐志斌"), new User("6367", "林岩"), new User("0101", "金有美"),
            new User("0202", "覃楫如"), new User("0303", "杨鹭语"), new User("0404", "黄海荣"),
            new User("0505", "吴承翰"), new User("0239", "黄丹晨"), new User("0240", "薛志全"),
            new User("0241", "张磊"), new User("1253", "徐志斌"), new User("0203", "罗京都"),
            new User("0304", "景耀华"), new User("4234", "陶靖柘"), new User("1245", "杨旭"),
            new User("4521", "刘芯妤"), new User("1243", "王文震"), new User("4628", "丁悦")
        );
        userRepository.saveAll(users);
        System.out.println("-> 用户数据初始化成功！");
    }

    private void seedRoles() {
        if (roleRepository.count() > 0) { return; }
        System.out.println("正在初始化角色数据...");
        Role role1 = new Role();
        role1.setRoleName("安环保卫部 (安委会)");
        role1.setMemberIds(Arrays.asList("0099", "0150", "0010", "1230", "5129", "1257", "0417", "2920", "4300", "1900", "1347", "0187", "2541", "6367"));
        Role role2 = new Role();
        role2.setRoleName("数字中心");
        role2.setMemberIds(Arrays.asList("0101", "0202", "0303", "0404", "0505", "0239"));
        Role role3 = new Role();
        role3.setRoleName("安环保卫部2");
        role3.setMemberIds(Arrays.asList("0240", "0241", "1253"));
        Role role4 = new Role();
        role4.setRoleName("设备技改部");
        role4.setMemberIds(Arrays.asList("0203", "0304", "4234"));
        Role role5 = new Role();
        role5.setRoleName("办公室");
        role5.setMemberIds(Arrays.asList("1245", "4521", "1243", "4628"));
        roleRepository.saveAll(Arrays.asList(role1, role2, role3, role4, role5));
        System.out.println("-> 角色数据初始化成功！");
    }

    private void seedServiceItems() {
        if (serviceItemRepository.count() > 0) { return; }
        System.out.println("正在初始化会议服务数据...");
        List<ServiceItem> items = Arrays.asList(
            createServiceItem("茶水", false), createServiceItem("电脑", false),
            createServiceItem("桌牌", false), createServiceItem("会议视频", false)
        );
        serviceItemRepository.saveAll(items);
        System.out.println("-> 会议服务数据初始化成功！");
    }

    private void seedConferenceRooms() {
        // 为了方便，这里也用硬编码，你可以根据需要改回从Excel读取
        if (conferenceRoomRepository.count() > 0) { return; }
        System.out.println("正在初始化会议室数据...");
        ConferenceRoom room1 = new ConferenceRoom();
        room1.setRoomNumber("619");
        room1.setName("619会议室");
        room1.setAddress("办公楼六楼");
        room1.setCapacity(100);
        room1.setManagingUnit("总部");
        room1.setProjectionDevice("投影屏");
        room1.setComputerConfig("无");
        conferenceRoomRepository.save(room1);
        System.out.println("-> 会议室数据初始化成功！");
    }

    private ServiceItem createServiceItem(String name, boolean disabled) {
        ServiceItem item = new ServiceItem();
        item.setServiceName(name);
        item.setDisabled(disabled);
        return item;
    }
    
    // 创建 MeetingType 的辅助小方法
    private MeetingType createMeetingType(String name, String remark, boolean disabled) {
        MeetingType type = new MeetingType();
        type.setTypeName(name);
        type.setRemark(remark);
        type.setDisabled(disabled);
        return type;
    }
}
