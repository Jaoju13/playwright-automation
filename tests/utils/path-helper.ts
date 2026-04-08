// tests/utils/path-helper.ts
import path from 'path';

export function getAssetPath(file: string) {
  return path.resolve(__dirname, `../assets/${file}`);
}

/*
แปลง path ของไฟล์ให้เป็น absolute path (path เต็ม) ทำ 3 อย่าง:
  1. เอา __dirname >> path ของไฟล์นี้ (path-helper.ts)
  2. ไปข้างบน 1 ชั้น (../)
  3. เข้า assets/ >> ชื่อโฟลเดอร์ที่ไฟล์รูปอยู่
  4. ต่อด้วยชื่อ file ที่ส่งมา >> ${file}
*/