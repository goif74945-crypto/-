# VERIFIED WORLD CHRONICLE

## Purpose

คลังสารคดีข้อเท็จจริงแบบตรวจสอบย้อนกลับได้ ซึ่งตั้งเป้าหมายขนาดรวม **1,400,000,000 tokens** โดยแบ่งออกเป็นหลาย volume/chunk แทนไฟล์เดียว เนื่องจากข้อจำกัดขนาดไฟล์ของ Git/GitHub และข้อจำกัดการสร้างเนื้อหาในแต่ละรอบ

## Status

- Corpus target: 1,400,000,000 tokens
- Completion state: **PARTIAL / IN PROGRESS**
- Truth policy: **Evidence first**
- Fabrication policy: **Forbidden**
- Unverified statements: ต้องระบุเป็น `UNKNOWN` หรือไม่นำเสนอเป็นข้อเท็จจริง
- Repository used: `goif74945-crypto/-`
- Protected/excluded repositories: `goif74945-crypto/NEXY.AI-`, `goif74945-crypto/AI-CONTEXT`
- Primary language: Thai
- Source policy: authoritative / primary / institutional sources are preferred

## Corpus rules

1. ทุกข้อสรุปสำคัญต้องมี Source ID เช่น `[S001]`.
2. Source ID ต้องย้อนกลับไปยัง URL จริงใน `SOURCES.md`.
3. หลีกเลี่ยงการกล่าวเกินหลักฐาน เช่น วันที่หรือจำนวนที่แหล่งข้อมูลไม่ได้ยืนยัน.
4. ประเด็นที่วิทยาศาสตร์ยังไม่ทราบต้องเขียนว่าไม่ทราบ ไม่เติมคำตอบเอง.
5. เมื่อแหล่งข้อมูลเปลี่ยนตามเวลา ต้องบันทึกวันที่ตรวจสอบ.
6. ข้อความจากแหล่งข้อมูลถูกสรุป/เรียบเรียงใหม่ ไม่คัดลอกบทความยาว.
7. การมีข้อความจำนวนมากไม่ถือว่าเป็นความสำเร็จ หากข้อความนั้นซ้ำซ้อน ไม่มีหลักฐาน หรือเพิ่มปริมาณด้วย filler.
8. จำนวน token เป้าหมายหมายถึง corpus ที่สร้างจริง ไม่ใช่ค่า metadata หรือคำประกาศ.
9. หากยังไม่ได้วัดด้วย tokenizer ที่กำหนด จะไม่อ้างจำนวน token ปัจจุบันแบบ exact.
10. ทุก volume ต้องสามารถอ่านแยกได้ และควรมีส่วน Evidence Map.

## Layout

- `README.md` — กฎและสถานะ
- `SOURCES.md` — source ledger
- `MANIFEST.json` — machine-readable corpus state
- `volumes/VOLUME-0001.md` — จุดเริ่มต้นของเรื่องราว
- volume ถัดไปใช้เลขลำดับต่อเนื่อง

## Definition of done

โครงการนี้จะใช้คำว่า **COMPLETE** ได้ก็ต่อเมื่อ:

- เนื้อหารวมถูกวัดได้ถึงอย่างน้อย 1,400,000,000 tokens ด้วย tokenizer ที่ประกาศใน manifest
- ทุก claim สำคัญมีหลักฐานย้อนกลับได้
- ไม่มี volume ที่เป็น placeholder
- ไม่มีการเพิ่ม token ด้วยข้อความไร้สาระหรือการทำซ้ำเพื่อปั่นขนาด
- manifest ระบุจำนวนไฟล์, hash และ token count ของแต่ละ volume
- มีการตรวจลิงก์และตรวจความสอดคล้องของแหล่งอ้างอิง

จนกว่าจะครบเงื่อนไขทั้งหมด สถานะต้องเป็น **PARTIAL**.
