# JOINSTICK Stage Demo

ระบบเดโมบนเวทีสำหรับงานอีเวนต์ — ผู้ชมสแกน QR เพื่อลองเล่น JOINSTICK สั้น ๆ บนมือถือ แอดมินควบคุมจังหวะจากหน้าจอคอนโซล แล้วปิดท้ายด้วยแบบสอบถามความพึงพอใจ

A stage-demo system for live events: attendees scan a QR, play a short demo on their phone, the admin phase-locks the room, then everyone answers a 1-question survey.

## โครงสร้าง / What's inside

| Path | คืออะไร |
|---|---|
| `/stage-demo/` | หน้าเดโมสำหรับผู้ชม (มือถือ) — Join → Harvester → Insight → Challenge → Survey |
| `/stage-demo/admin/` | คอนโซลแอดมิน (เดสก์ท็อป) — สร้าง session, โชว์ QR, สลับเฟส, ดูผลสด, export CSV |
| `/stage-demo/config.js` | ไฟล์ตั้งค่า (Supabase URL/key + รหัสแอดมิน) |
| `/stage-demo/supabase-schema.sql` | สคีมาฐานข้อมูล รันใน Supabase SQL Editor |

ระบบมี 3 เฟส (แอดมินเป็นคนสลับ): **`demo`** → **`eyes_up`** → **`survey`**

## ติดตั้ง / Setup

1. สร้างโปรเจกต์ใหม่ที่ [supabase.com](https://supabase.com) (free tier พอ)
2. เปิด **SQL Editor** ในโปรเจกต์ แล้ววางเนื้อหาทั้งไฟล์ `supabase-schema.sql` → Run (รันซ้ำได้ ไม่พัง)
3. ไปที่ **Project Settings → API** คัดลอก **Project URL** และ **anon (public) key** มาใส่ใน `stage-demo/config.js`:
   ```js
   window.STAGE_DEMO_CONFIG = {
     SUPABASE_URL: "https://xxxx.supabase.co",
     SUPABASE_ANON_KEY: "eyJ...",
     ADMIN_PASSCODE: "base-e11"
   };
   ```
4. Deploy แบบ static ทั้งโฟลเดอร์ (Netlify / Vercel / GitHub Pages) หรือทดสอบในเครื่องด้วย `npx live-server` ที่ root ของ repo
5. เปิด `/stage-demo/admin/` → ใส่รหัส `base-e11` → กดสร้าง session → ระบบจะสร้างโค้ด 6 ตัว + QR code ให้ฉายขึ้นจอ ผู้ชมสแกนแล้วจะเข้า `/stage-demo/?s=CODE` อัตโนมัติ

## Local Mode (ทดสอบโดยไม่ต้องมี Supabase)

ถ้า `SUPABASE_URL` ใน `config.js` เป็นค่าว่าง `""` ทั้งสองหน้าจะเข้าสู่ **Local Mode** อัตโนมัติ:

- ข้อมูลทั้งหมดเก็บใน `localStorage` ของเบราว์เซอร์เครื่องนั้น (key `stage_demo_local_db`) — **ไม่ออกไปไหน ใช้ทดสอบเท่านั้น**
- เปิดแท็บผู้ใช้ + แท็บแอดมินในเบราว์เซอร์เดียวกัน จะเห็นข้อมูลซิงก์กันแบบเรียลไทม์
- หน้าผู้ใช้ที่ไม่มี `?s=` จะสร้าง/เข้าร่วม session ทดสอบ `DEMO01` ให้เอง
- จะมีป้ายสีเหลือง "Local Mode — ข้อมูลอยู่ในเครื่องนี้เท่านั้น" แสดงตลอด ส่วนโหมด Supabase จะแสดงป้ายเขียว "Supabase Connected"

## ข้อมูลที่เก็บ / Data model (อธิบายแบบไม่ต้องเป็นวิศวกร)

| ตาราง | เก็บอะไร |
|---|---|
| `demo_sessions` | "รอบเดโม" แต่ละรอบ — โค้ด 6 ตัวที่อยู่ใน QR, ชื่อรอบ, เฟสปัจจุบัน (`demo`/`eyes_up`/`survey`), เปิด/ปิดใช้งาน, เวลาที่เปลี่ยนเฟสล่าสุด |
| `demo_participants` | ผู้เข้าร่วม 1 คน (จริง ๆ คือ 1 เครื่อง) ต่อ 1 แถว — รหัสเครื่องแบบสุ่ม (`device_id` ไม่ใช่ข้อมูลส่วนตัว), ชื่อเล่นที่ระบบสุ่มให้ (เช่น "Brave Otter #42"), หน้าที่กำลังอยู่ (`current_step`), ชนิดเบราว์เซอร์ (`user_agent`), เวลาเข้าร่วม และ heartbeat `last_seen_at` ทุก 20 วินาที (ถ้าไม่เกิน 60 วิ ถือว่า "ออนไลน์") |
| `demo_harvester_answers` | คำตอบ Harvester 3 ข้อ (Inspiration / Relevance / Action) คะแนน **0–4** ต่อข้อ — เก็บข้อความคำถามตรงตามที่ผู้ใช้เห็นไว้ด้วย |
| `demo_survey_responses` | แบบสอบถามท้ายงาน 1 ข้อ ความพึงพอใจ **1–5** (อีโมจิ 😞–🤩) + คอมเมนต์สั้น ๆ (ไม่บังคับ) คนละ 1 คำตอบ |
| `demo_events` | log เหตุการณ์ดิบทุกอย่าง — `join`, `harvester_complete`, `challenge_accept`, `survey_submit`, `step_change` พร้อมเวลา ใช้วิเคราะห์ funnel ย้อนหลัง |

สรุป: ระบบ**ไม่เก็บ**ชื่อจริง อีเมล หรือเบอร์โทร — เก็บเฉพาะรหัสเครื่องสุ่ม ชื่อเล่นสุ่ม คะแนน และคอมเมนต์ที่ผู้ใช้พิมพ์เอง

## Runbook วันงาน

**ก่อนเริ่ม:** เปิด `/stage-demo/admin/` บนโน้ตบุ๊ก → สร้าง session → ฉาย QR ขึ้นจอใหญ่

1. **Phase 1 — Demo:** ผู้ชมสแกน QR → Join (ได้ชื่อเล่นอัตโนมัติ ไม่ต้องพิมพ์) → ตอบ Harvester 3 ข้อ → ดู Insight ของตัวเอง → รับ Challenge ทุกคนเล่นตามจังหวะตัวเอง แอดมินเห็นจำนวนคนออนไลน์/ความคืบหน้าแบบสด ๆ
2. **Phase 2 — Eyes Up:** เมื่อสปีกเกอร์ต้องการสายตาทั้งห้อง แอดมินกด **Eyes Up** → มือถือทุกเครื่องถูกล็อกเต็มจอทันที กดอะไรไม่ได้ จนกว่าจะสลับเฟสกลับ
3. **Phase 3 — Survey:** แอดมินกด **Survey** → ทุกเครื่องเด้งแบบสอบถาม 1 ข้อ (1–5) + คอมเมนต์ → ส่งแล้วเห็นหน้า booth info
4. **จบงาน:** ผู้เข้าร่วมเห็นข้อความ *"อยากรู้จัก JOINSTICK มากขึ้น? แวะมาคุยกับทีม BASE Playhouse ได้ที่บูธ No. E11"* — แอดมินกด **Export CSV** เพื่อดึงข้อมูลผู้เข้าร่วม/คะแนน/คอมเมนต์ทั้งหมด

หมายเหตุ: คนที่ส่ง survey แล้วจะค้างหน้า done ตลอด ไม่โดนเฟสสลับไปมาหลังจากนั้น ส่วนคนที่เพิ่งสแกนระหว่าง Eyes Up จะเข้าหน้าล็อกทันทีหลัง join

## ความปลอดภัย / Security note

> **ระบบนี้เป็น demo-grade เท่านั้น** — anon key อยู่ในไฟล์ JS ฝั่ง client และ RLS policy เปิดกว้าง (ใครมี key ก็อ่าน/เขียนข้อมูลได้ทุกแถว) ออกแบบมาสำหรับงานอีเวนต์วันเดียวกับข้อมูลที่ไม่อ่อนไหวเท่านั้น
>
> - ห้ามนำ schema/policy ชุดนี้ไปใช้กับระบบจริง
> - หลังจบงาน: export ข้อมูลที่ต้องการ แล้ว **ลบโปรเจกต์ Supabase ทิ้ง** (หรืออย่างน้อย rotate key + ปิด session)
> - `ADMIN_PASSCODE` เป็นแค่ตัวกั้นหน้า UI ไม่ใช่ระบบ auth จริง
