<template>
  <main-layout>
    <el-card shadow="never">
      <div class="toolbar">
        <el-button-group>
          <el-button @click="changeView('resourceTimelineDay')">日</el-button>
          <el-button @click="changeView('resourceTimelineWeek')">周</el-button>
          <el-button @click="changeView('resourceTimelineMonth')">月</el-button>
        </el-button-group>
        <el-date-picker 
          v-model="currentDate" 
          type="date" 
          placeholder="选择日期" 
          style="margin: 0 10px;"
        />
        <el-button @click="handleRefresh">刷新</el-button>
        <el-button type="primary" @click="openNewMeetingDialog">+ 新建会议</el-button>
      </div>
      <FullCalendar ref="fullCalendar" :options="calendarOptions" style="margin-top: 20px;" />
    </el-card>

    <el-dialog v-model="dialogVisible" title="新建会议" width="800px">
      <el-form :model="newMeetingForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="会议名称" required>
              <el-input v-model="newMeetingForm.title" />
            </el-form-item>
            <el-form-item label="联系人" required>
              <el-select v-model="newMeetingForm.contact" placeholder="请选择联系人" style="width:100%">
                <el-option v-for="user in allUsers" :key="user.id" :label="user.name" :value="user.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="会议地点" required>
              <el-select v-model="newMeetingForm.roomId" placeholder="请选择会议室" style="width:100%">
                <el-option v-for="room in meetingRooms" :key="room.id" :label="room.title" :value="room.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期" required>
              <el-date-picker v-model="newMeetingForm.date" type="date" placeholder="选择日期" style="width: 100%;"/>
            </el-form-item>
            <el-form-item label="内部参会人员">
              <el-select v-model="newMeetingForm.internalAttendees" multiple placeholder="请选择内部参会人员" style="width:100%">
                <el-option v-for="user in allUsers" :key="user.id" :label="user.name" :value="user.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="附件">
              <el-upload action="#" :auto-upload="false">
                <el-button>选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议类型" required>
              <el-select v-model="newMeetingForm.type" placeholder="请选择类型" style="width:100%">
                <el-option v-for="type in meetingTypes" :key="type.id" :label="type.typeName" :value="type.typeName" />
              </el-select>
            </el-form-item>
            <el-form-item label="召集人" required>
              <el-select v-model="newMeetingForm.convener" placeholder="请选择召集人" style="width:100%">
                <el-option v-for="user in allUsers" :key="user.id" :label="user.name" :value="user.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="会议内容">
              <el-input v-model="newMeetingForm.content" type="textarea" :rows="4"/>
            </el-form-item>
            <el-form-item label="时间" required>
              <el-time-picker v-model="newMeetingForm.startTime" placeholder="开始时间" style="width: 135px;"/>
              <span style="margin: 0 10px;">至</span>
              <el-time-picker v-model="newMeetingForm.endTime" placeholder="结束时间" style="width: 135px;"/>
            </el-form-item>
            <el-form-item label="会议服务">
              <el-checkbox-group v-model="newMeetingForm.services">
                <el-checkbox label="文件打印" />
                <el-checkbox label="茶水" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmNewMeeting">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </main-layout>
</template>

<script setup>
import { ref, reactive, watch, onMounted} from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import MainLayout from '../../layouts/MainLayout.vue';
import FullCalendar from '@fullcalendar/vue3';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import calendarService from '@/api/calendarService.js'; // 导入 calendarService (保持不变)
import meetingTypeService from '@/api/meetingTypeService.js'; // 【新增】导入 meetingTypeService
import { ElMessage } from 'element-plus';

/**
 * 将 Date 对象格式化为YYYY-MM-DD
 * @param {Date} date - JavaScript Date 对象
 */
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 将 Date 对象格式化为 HH:mm:ss
 * @param {Date} date - JavaScript Date 对象
 */
function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// --- 数据部分 ---
const meetingRooms = ref([]); 
const meetings = ref([]);     
const allUsers = ref([]);     // 从后端获取所有用户
const meetingTypes = ref([]); // 从后端获取会议类型

const newMeetingForm = reactive({
    title: '', type: '', convener: '', contact: '', roomId: '',
    content: '', date: null, startTime: null, endTime: null,
    services: [], internalAttendees: [],
});

// --- FullCalendar 核心配置 ---
const calendarOptions = reactive({
  schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
  plugins: [resourceTimelinePlugin, interactionPlugin],
  initialView: 'resourceTimelineWeek', 
  headerToolbar: false,
  locale: 'zh-cn',
  firstDay: 1,  
  resourceAreaWidth: 100,
  resources: [], 
  events: [],    
  slotMinTime: "08:00:00",
  slotMaxTime: "23:00:00",
  slotDuration: '00:15:00',
  height: 'auto',
  selectable: true,
  eventColor: '#28a745', 
  selectOverlap: false,
  select: (selectionInfo) => {
    Object.assign(newMeetingForm, {
        title: '', 
        type: '', 
        convener: '', 
        contact: '',
        content: '', 
        services: [],
        internalAttendees: [],
        roomId: selectionInfo.resource.id, 
        date: selectionInfo.start,
        startTime: selectionInfo.start, 
        endTime: selectionInfo.end,
    });
    dialogVisible.value = true;
   const calendarApi = fullCalendar.value.getApi();
       calendarApi.unselect();
     },
   views: {
      resourceTimelineWeek: {
        slotLabelFormat: [
            { year: 'numeric', month: 'numeric', day: 'numeric', separator: ' ', omitZeroDay: true }, 
            { weekday: 'short' }, 
            { hour: 'numeric', minute: '2-digit', meridiem: false } 
        ]
      },
      resourceTimelineDay: {
        slotLabelFormat: [
            { hour: 'numeric', minute: '2-digit', meridiem: false } 
        ]
      },
      resourceTimelineMonth: {
        slotLabelFormat: { day: 'numeric' } 
      }
   }
});
	   
// --- 页面交互逻辑 ---
const fullCalendar = ref(null);
const currentDate = ref(new Date()); 
const dialogVisible = ref(false);

// 【已升级】从后端加载日历数据和下拉列表数据
async function loadAllData() {
    try {
        const [resourcesData, eventsData, usersData, meetingTypesData] = await Promise.all([
            calendarService.getResources(),
            calendarService.getEvents(),
            calendarService.getUsers(), 
            meetingTypeService.getEnabled() // 【关键修改】这里改为调用 meetingTypeService.getEnabled()
        ]);
        meetingRooms.value = resourcesData;
        meetings.value = eventsData;
        allUsers.value = usersData; 
        meetingTypes.value = meetingTypesData; // meetingTypes 现在只包含启用的类型

        // 将获取到的数据更新到日历配置中
        calendarOptions.resources = resourcesData;
        calendarOptions.events = eventsData;
    } catch (error) {
        console.error("加载数据失败:", error);
        ElMessage.error("加载数据失败，请检查后端服务是否运行。");
    }
}

// 【已升级】确认新建会议的逻辑 (与之前版本相同，无需改动)
const handleConfirmNewMeeting = async () => {
    console.log("--- “确认”按钮被点击，开始执行 handleConfirmNewMeeting 函数 ---");
    console.log("当前的表单数据(newMeetingForm):", JSON.parse(JSON.stringify(newMeetingForm)));

    if (!newMeetingForm.title) {
        ElMessage.warning('会议名称不能为空！');
        console.log("验证失败: [会议名称] 为空。");
        return;
    }
    if (!newMeetingForm.roomId) {
        ElMessage.warning('会议地点不能为空！');
        console.log("验证失败: [会议地点] 为空。");
        return;
    }
    if (!newMeetingForm.date) {
        ElMessage.warning('日期不能为空！');
        console.log("验证失败: [日期] 为空。");
        return;
    }
    if (!newMeetingForm.startTime) {
        ElMessage.warning('开始时间不能为空！');
        console.log("验证失败: [开始时间] 为空。");
        return;
    }
    if (!newMeetingForm.endTime) {
        ElMessage.warning('结束时间不能为空！');
        console.log("验证失败: [结束时间] 为空。");
        return;
    }

    console.log("✅ 所有必填项验证通过，准备构建发送到后端的数据...");

    const payload = {
        title: newMeetingForm.title,
        type: newMeetingForm.type,
        convener: newMeetingForm.convener,
        contact: newMeetingForm.contact,
        roomId: newMeetingForm.roomId,
        content: newMeetingForm.content,
        services: newMeetingForm.services || [],
        internalAttendees: newMeetingForm.internalAttendees || [],
        date: formatDate(newMeetingForm.date),
        startTime: formatTime(newMeetingForm.startTime),
        endTime: formatTime(newMeetingForm.endTime),
    };

    try {
        console.log("即将发送到后端的数据(payload):", payload);
        await calendarService.createEvent(payload);
        await loadAllData(); // 创建成功后重新加载所有数据
        ElMessage.success('会议创建成功！');
        dialogVisible.value = false;
    } catch (error) {
        console.error("❌ 创建会议失败，后端返回错误:", error.response || error);
        const errorMessage = error.response?.data?.message || '请检查浏览器控制台以获取详细错误。';
        ElMessage.error("创建会议失败: " + errorMessage);
    }
};

onMounted(() => {
    loadAllData(); // 页面加载时获取所有数据
});

// --- 其他函数保持不变 ---
const changeView = (viewName) => {
  const calendarApi = fullCalendar.value.getApi();
  if (calendarApi) {
    calendarApi.changeView(viewName, currentDate.value);
  }
};
watch(currentDate, (newDate) => {
  if (newDate) {
    const calendarApi = fullCalendar.value?.getApi();
    if (calendarApi) {
      calendarApi.goToDate(newDate);
    }
  }
});
const handleRefresh = () => {
    alert('正在刷新数据...');
    loadAllData(); // 刷新时也加载所有数据
};
const openNewMeetingDialog = () => {
    const calendarApi = fullCalendar.value.getApi();
    const currentCalDate = calendarApi.getDate();
    Object.assign(newMeetingForm, {
        title: '', type: '', convener: '', contact: '', roomId: '',
        content: '', date: currentCalDate, startTime: null, endTime: null,
        services: [], internalAttendees: [],
    });
    dialogVisible.value = true;
};
onLoad((options) => {
  if (options.from === 'template' && options.data) {
    const template = JSON.parse(decodeURIComponent(options.data));
    Object.assign(newMeetingForm, {
        title: template.name, type: template.type, convener: template.initiator,
        contact: template.contact, roomId: template.room, content: template.content,
        services: template.services, date: new Date(), startTime: null,
        endTime: null, internalAttendees: [],
    });
    dialogVisible.value = true;
  }
});
</script>

<style scoped>
:deep(.fc) { 
  --fc-timeline-slot-width: 3px; 
  --fc-timeline-slot-label-font-size: 0.8em; 
}
</style>