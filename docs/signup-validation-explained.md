# อธิบายการเช็ค username / email ซ้ำ (Client-side validation)

## สรุปสิ่งที่ทำไป

1. **Backend** เพิ่ม route `GET /api/signup/check?username=xxx` สำหรับเช็คว่า **username** ถูกใช้แล้วหรือยัง
2. **Frontend** เรียก API นี้ทั้งตอน **blur ช่อง username** และตอน **กด submit** แล้วแสดง error ใต้ช่องที่ซ้ำ
3. เมื่อ **submit ไปที่ POST /api/signup** แล้ว server ตอบว่า email ซ้ำ หรือ username ซ้ำ จะ **แมป error ไปที่ช่อง username / email** แทนการ alert อย่างเดียว

หมายเหตุ: **name** ในระบบนี้ไม่มีการเช็คซ้ำ (ชื่อคนซ้ำกันได้) จึงเช็คเฉพาะ **username** และ **email** (email จะรู้จาก response ตอน submit เพราะ Supabase ไม่มี API ให้เช็ค email ผ่าน GET)

---

## Backend: `auth.mjs`

### 1. เพิ่ม GET `/check`

```js
signupRouter.get("/check", async (req, res) => {
```

- **signupRouter.get** = ลงทะเบียน route แบบ GET (อ่านข้อมูล ไม่เปลี่ยนข้อมูล)
- **"/check"** = path ย่อยของ router ดังนั้น URL เต็มคือ `GET /api/signup/check`
- **async (req, res) =>** = handler เป็น async function รับ `req` (request), `res` (response)

---

### 2. อ่านและ trim query

```js
const username = typeof req.query.username === "string" ? req.query.username.trim() : "";
```

- **req.query** = object ของ query string เช่น `?username=john` → `req.query.username === "john"`
- **typeof ... === "string"** = ป้องกันกรณีไม่มี query หรือส่งเป็นอย่างอื่น (เช่น array)
- **.trim()** = ตัดช่องว่างหัวท้าย
- ถ้าไม่ใช่ string หรือไม่มี → ใช้ `""`

---

### 3. เช็ค username ใน DB

```js
let usernameTaken = false;
if (username) {
  const { rows } = await pool.query(
    "SELECT 1 FROM users WHERE username = $1 LIMIT 1",
    [username]
  );
  usernameTaken = rows.length > 0;
}
```

- **pool.query(sql, params)** = ส่งคำสั่ง SQL ไปที่ DB (PostgreSQL)
- **$1** = placeholder ตัวที่ 1 จะถูกแทนด้วย `[username]` (กัน SQL injection)
- **SELECT 1** = ไม่สนใจ column แค่ต้องการว่ามีแถวหรือไม่
- **LIMIT 1** = ดึงแค่ 1 แถวพอ
- **rows.length > 0** = มีแถว = username นี้มีในตารางแล้ว → **usernameTaken = true**

---

### 4. ส่ง JSON กลับ

```js
return res.status(200).json({ usernameTaken });
```

- **res.status(200)** = HTTP 200 OK
- **.json({ usernameTaken })** = ส่ง response เป็น JSON และปิดการส่งให้ เช่น `{ "usernameTaken": true }`
- **return** = จบการทำงานของ handler

---

### 5. กรณี error

```js
} catch (err) {
  console.error("Signup check error:", err);
  return res.status(500).json({ usernameTaken: false });
}
```

- **catch** = ถ้า `pool.query` หรืออะไรใน try โยน error จะเข้ามาที่นี่
- **res.status(500)** = Server Error
- ส่ง **usernameTaken: false** เพื่อให้ฝั่ง client ไม่ต้องพึ่ง error มากเกินไป (ถือว่า “ยังไม่รู้ว่า taken”)

---

## Frontend: `SignUpPage.jsx`

### 1. ฟังก์ชันเช็ค username ซ้ำ

```js
const checkUsernameTaken = async (username) => {
  if (!username || !username.trim()) return false;
  try {
    const { data } = await axios.get(
      `${apiBase}/api/signup/check?username=${encodeURIComponent(username.trim())}`
    );
    return data.usernameTaken === true;
  } catch {
    return false;
  }
};
```

- **async (username) =>** = ฟังก์ชันแบบ async รับพารามิเตอร์ `username`
- **if (!username || !username.trim()) return false;** = ถ้าว่างหรือเป็นแค่ช่องว่าง ไม่ต้องเรียก API คืน false (ไม่ถือว่า taken)
- **axios.get(url)** = HTTP GET ไม่เปลี่ยนข้อมูล
- **`${apiBase}/api/signup/check?username=...`** = ใช้ base URL จาก env แล้วต่อ path และ query
- **encodeURIComponent(username.trim())** = encode ค่า username ให้ปลอดภัยใน URL (เช่น มีช่องว่าง หรืออักขระพิเศษ)
- **const { data } = await ...** = รอ response แล้วดึง `response.data`
- **data.usernameTaken === true** = คืนเป็น boolean ว่าซ้ำหรือไม่ (ถ้า API ล้มใน catch จะคืน false)

---

### 2. SignUp คืน object แทน true/false

```js
return { success: true };
// หรือ
return { success: false, field, message };
```

- **success** = บอกว่าสมัครสำเร็จหรือไม่
- **field** = ชื่อ field ที่ error ("username" หรือ "email") เพื่อไป set ใต้ช่องนั้น
- **message** = ข้อความจาก server (เช่น "This username is already taken", "User with this email already exists")

การแมปจากข้อความ server:

```js
let field = null;
if (message.includes("username") && message.toLowerCase().includes("taken")) field = "username";
else if (message.includes("email") && (message.includes("exists") || message.includes("already"))) field = "email";
return { success: false, field, message };
```

- **message.includes("...")** = เช็คว่าข้อความมีคำนั้นหรือไม่
- **message.toLowerCase()** = แปลงเป็นตัวเล็กก่อนเช็ค "taken" ให้ไม่สนใจตัวใหญ่เล็ก
- ถ้า match กับข้อความที่ backend ส่งสำหรับ username/email ก็ตั้ง **field** แล้วส่งกลับไปให้ set ที่ **errors[field]**

---

### 3. handleChange ล้าง error ตอนพิมพ์

```js
if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
```

- **errors[name]** = error ของ field ที่กำลังเปลี่ยน (เช่น `errors.username`)
- **setErrors((prev) => ({ ...prev, [name]: "" }))** = อัปเดต state โดยคัดลอก `prev` แล้วใส่ `[name]: ""` (ล้าง error ของ field นั้น)
- **[name]** = computed property name เช่น name เป็น `"username"` จะได้ key `username`

---

### 4. handleUsernameBlur — เช็คตอนเลิก focus ช่อง username

```js
const handleUsernameBlur = async () => {
  const u = formData.username.trim();
  if (!u) return;
  const taken = await checkUsernameTaken(u);
  setErrors((prev) => ({ ...prev, username: taken ? "This username is already taken" : "" }));
  setTouched((prev) => ({ ...prev, username: true }));
};
```

- **onBlur** = เรียกเมื่อผู้ใช้เลิก focus ที่ input (คลิกออกหรือ tab ออก)
- **if (!u) return;** = ถ้ายังไม่กรอก username ไม่ต้องเรียก API
- **taken ? "..." : ""** = ถ้าซ้ำใส่ข้อความ error ไม่ซ้ำใส่สตริงว่าง
- **setTouched** = บอกว่า field นี้ถูก “แตะ” แล้ว เพื่อให้แสดง error ใต้ช่องได้

---

### 5. handleSubmit — เช็คซ้ำก่อน submit + ใช้ผลจาก SignUp

```js
const usernameTaken = await checkUsernameTaken(formData.username.trim());
if (usernameTaken) newErrors = { ...newErrors, username: "This username is already taken" };
```

- ก่อนส่ง POST เราอีกครั้งเช็ค username ผ่าน **checkUsernameTaken**
- ถ้า taken จะ merge เข้า **newErrors** ให้ช่อง username มี error

```js
const result = await SignUp();
if (result.success) {
  setShowSuccess(true);
} else {
  if (result.field) setErrors((prev) => ({ ...prev, [result.field]: result.message }));
  else alert(`Signup failed: ${result.message}`);
}
```

- **result.success** = สมัครสำเร็จหรือไม่
- **result.field** = ถ้ามี แปลว่า server บอกว่าผิดที่ช่องไหน (username หรือ email)
- **setErrors((prev) => ({ ...prev, [result.field]: result.message }))** = ใส่ error ใต้ช่องนั้นด้วยข้อความจาก server
- ถ้าไม่มี **field** (เช่น error อื่น) ใช้ **alert** อย่างเดียว

---

### 6. ผูก onBlur ที่ input username

```js
onBlur={handleUsernameBlur}
```

- เมื่อผู้ใช้ blur ออกจากช่อง username จะเรียก **handleUsernameBlur** → เช็ค username ซ้ำแล้วอัปเดต **errors.username** และ **touched.username**

---

## สรุป flow การเช็คซ้ำ

| จุดที่เช็ค | วิธีเช็ค |
|------------|----------|
| **Username** | เรียก `GET /api/signup/check?username=...` ตอน blur และตอน submit |
| **Email** | ไม่มี API เช็คจาก client โดยตรง จึงรู้จาก response ของ `POST /api/signup` (ข้อความ "User with this email already exists") แล้วไป set **errors.email** |
| **Name** | ไม่มีการเช็คซ้ำ (ชื่อซ้ำได้ในระบบนี้) |

ทุก syntax ข้างต้นคือส่วนที่เพิ่ม/แก้เพื่อให้ “เช็ค username / email ว่าซ้ำกันไหมในส่วน client validate” และให้ error แสดงที่ช่องที่เกี่ยวข้องแทนการ alert อย่างเดียว
