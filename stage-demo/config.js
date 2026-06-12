// ============================================================================
// JOINSTICK Stage Demo — Runtime Config / ไฟล์ตั้งค่าระบบเดโมบนเวที
// ----------------------------------------------------------------------------
// วิธีใช้ (TH):
//   1) วาง Supabase Project URL และ anon key ของโปรเจกต์คุณลงในช่องด้านล่าง
//      (หาได้ที่ Supabase Dashboard -> Project Settings -> API)
//   2) ถ้าปล่อยทั้งสองค่าเป็นสตริงว่าง ("") ระบบจะทำงานใน Local Mode
//      ข้อมูลจะถูกเก็บใน localStorage ของเบราว์เซอร์เครื่องนั้นเท่านั้น
//      เหมาะสำหรับทดสอบบนเครื่องเดียว ไม่เหมาะกับงานจริง
//   3) ADMIN_PASSCODE คือรหัสผ่านสำหรับเข้าหน้าแอดมิน /stage-demo/admin
//
// How to use (EN):
//   1) Paste your Supabase Project URL + anon (public) key below.
//   2) Leave both as empty strings ("") to run in Local Mode — data stays in
//      this browser's localStorage only (single-machine testing).
//   3) ADMIN_PASSCODE gates the admin console at /stage-demo/admin.
// ============================================================================
window.STAGE_DEMO_CONFIG = {
  SUPABASE_URL: "https://ifijehertlavbxawfvbn.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaWplaGVydGxhdmJ4YXdmdmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNTE1OTYsImV4cCI6MjA5NjgyNzU5Nn0.Ab_joM3JgnxTTsiejHVxJjqYZwQjIo8pWM3lhd3_BWs",
  ADMIN_PASSCODE: "base-e11"
};
