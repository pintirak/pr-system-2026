# PR SYSTEM - ระบบบริหารจัดการและขอรับบริการงานประชาสัมพันธ์

ระบบเว็บแอปพลิเคชันสำหรับนักประชาสัมพันธ์และฝ่ายสื่อสารองค์กร ออกแบบด้วย **UI สไตล์ iOS (Apple Human Interface Guidelines)** รองรับการทำงานทั้งบนมือถือและคอมพิวเตอร์อย่างลื่นไหล พร้อมระบบสลับโหมดมืด/โหมดสว่าง (Dark / Light Mode) แดชบอร์ดติดตามสถานะงานแบบเรียลไทม์ การแจ้งเตือนผ่าน LINE และการสรุปผลการดำเนินงานรายเดือนแบบอัตโนมัติ

---

## 🌟 จุดเด่นและฟังก์ชันการทำงานหลัก (Key Features)

1. **การขอรับบริการงานประชาสัมพันธ์ (PR Service Request)**
   - ออกแบบโปสเตอร์ / แบนเนอร์ / Infographic / Backdrop
   - ถ่ายภาพนิ่ง / บันทึกวิดีโองานกิจกรรม / ถ่ายทอดสด (Live)
   - เขียนและลงข่าวประชาสัมพันธ์ Facebook / เว็บไซต์ / สื่อมวลชน
   - งานพิธีกร / งานแถลงข่าว / ประสานงานสื่อ
   - สื่อสิ่งพิมพ์ / วารสาร / จดหมายข่าวอิเล็กทรอนิกส์ (E-Newsletter)
   - รองรับการกำหนดระดับความเร่งด่วน (ปกติ, ด่วน, ด่วนที่สุด) และสร้างรหัสงานอัตโนมัติ (เช่น `PR-2026-0901`)

2. **แดชบอร์ดติดตามสถานะงานแบบเรียลไทม์ (Real-time Workflow Pipeline)**
   - แบ่งขั้นตอนการทำงานออกเป็น 5 ขั้นตอนชัดเจน:
     1. รับเรื่อง / รอดำเนินการ (Pending)
     2. กำลังจัดทำ / ออกแบบ (In Progress)
     3. รอตรวจทาน / แก้ไขแบบ (Review)
     4. ส่งมอบ / เผยแพร่แล้ว (Delivered)
     5. เสร็จสมบูรณ์ (Completed)
   - การเลื่อนขั้นตอนแบบ 1-Click พร้อมระบบคำนวณ Progress % และบันทึกประวัติการทำงาน (Audit Logs)

3. **ระบบแจ้งเตือนผ่าน LINE (LINE Notification Integration)**
   - แจ้งเตือนเมื่อมีคำขอใหม่, มีการอัปเดตสถานะ, งานเสร็จสมบูรณ์ หรือมีงานด่วน
   - รองรับ **1-Click Share to LINE** เพื่อส่งการ์ดข้อมูลงานเข้ากลุ่มไลน์ประชาสัมพันธ์ได้ทันที
   - รองรับ Webhook Dispatch ไปยัง LINE Messaging API / LINE Notify / Make / Zapier

4. **การสรุปผลการดำเนินงานรายเดือนแบบอัตโนมัติ (Automated Monthly Analytics & Report)**
   - วิเคราะห์จำนวนงานทั้งหมด, อัตราความสำเร็จ (%), ระยะเวลาเฉลี่ยต่อภารกิจ (วัน)
   - สถิติยอดการเข้าถึง (Estimated Reach & Impressions) บน Social Media
   - แผนภูมิแจกแจงสัดส่วนประเภทงาน และ 5 หน่วยงานที่มีการขอรับบริการสูงสุด
   - สรุปบทความสำหรับผู้บริหาร (Executive Summary) อัตโนมัติเป็นภาษาไทย
   - ส่งออกข้อมูลเป็น **CSV (Excel)** และสั่ง **พิมพ์รายงาน / PDF** ได้ทันที

5. **ระบบฐานข้อมูลแบบไฟล์เบส และพร้อมเชื่อมต่อ Cloud (File-Base & Cloud Ready)**
   - บันทึกข้อมูลอัตโนมัติแบบ Persistent File-Base ในเบราว์เซอร์
   - ฟังก์ชันดาวน์โหลดและนำเข้าไฟล์ฐานข้อมูล `pr_system_database.json`
   - พร้อมโครงสร้างเชื่อมต่อ Firebase Firestore (`firebase-blueprint.json` & `firestore.rules`)

---

## 📱 ดีไซน์ระบบ iOS (Apple Design System)
- ใช้ฟอนต์ **Prompt** และ **Plus Jakarta Sans** รองรับภาษาไทยและอังกฤษอย่างลงตัว
- iOS Frosted Glass & Blur Effects (`backdrop-blur-xl`)
- Segmented Controls, Pill Badges, Squircle Widgets
- สลับ **Dark Mode** และ **Light Mode** ได้ทันที

---

## 🚀 การติดตั้งและนำโปรเจกต์ขึ้น GitHub (GitHub Deployment)

### 1. ติดตั้ง Dependencies และทดสอบในเครื่อง (Local Setup)
```bash
# ติดตั้งแพ็กเกจ
npm install

# รันโหมด Development
npm run dev

# บิลด์สำหรับ Production
npm run build
```

### 2. นำขึ้น GitHub Repository
```bash
# กำหนดค่าเริ่มต้น Git
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# บันทึก Commit
git commit -m "feat: initial commit for PR System iOS"

# ตั้งชื่อกิ่งเป็น main
git branch -M main

# เชื่อมต่อกับ Repository ของคุณบน GitHub
git remote add origin https://github.com/<YOUR_USERNAME>/pr-system.git

# Push โค้ดขึ้น GitHub
git push -u origin main
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)
```
pr-system/
├── firebase-blueprint.json    # โครงสร้าง Schema สำหรับ Firebase Firestore
├── firestore.rules            # กฎความปลอดภัย Firestore Security Rules
├── metadata.json              # เมตาเดตาของแอปพลิเคชัน
├── package.json               # รายการ Dependencies และ Scripts
├── index.html                 # หน้า Entry point พร้อมฟอนต์และ Viewport
├── src/
│   ├── types.ts               # นิยามข้อมูล TypeScript (PRJob, Category, Config)
│   ├── App.tsx                # คอมโพเนนต์หลัก จัดการ State และ Routing
│   ├── data/
│   │   └── seedData.ts        # ข้อมูลตัวอย่างเริ่มต้นงานประชาสัมพันธ์
│   ├── lib/
│   │   ├── storage.ts         # ระบบจัดการไฟล์เบสและ JSON Backup
│   │   ├── lineNotify.ts      # ฟอร์แมตข้อความและระบบแจ้งเตือน LINE
│   │   ├── monthlyReport.ts   # การประมวลผลสถิติและสรุปรายเดือน
│   │   └── firebase.ts        # การเชื่อมต่อ Firebase Firestore
│   └── components/
│       ├── Header.tsx         # แถบด้านบน iOS พร้อมปุ่ม Dark/Light Mode
│       ├── Navigation.tsx     # แถบสลับหน้า Segmented Tab & Mobile Dock
│       ├── DashboardView.tsx  # แดชบอร์ดติดตามสถานะงานแบบเรียลไทม์
│       ├── RequestListView.tsx# รายการงานทั้งหมดพร้อมระบบค้นหาและกรอง
│       ├── NewRequestModal.tsx# แบบฟอร์มขอรับบริการงานประชาสัมพันธ์
│       ├── TaskDetailModal.tsx# หน้าต่างรายละเอียดงานและอัปเดตสถานะ
│       ├── MonthlyReportView.tsx # สรุปผลการดำเนินงานรายเดือนอัตโนมัติ
│       └── SettingsView.tsx   # จัดการไฟล์เบส, GitHub และ LINE Webhook
└── README.md                  # เอกสารคู่มือระบบ
```

---

## 📄 ใบอนุญาต (License)
Apache License 2.0
