

export async function getInquiryData() {
  const res = await fetch('http://127.0.0.1:5001/inquiry');
  if (!res.ok) throw new Error('โหลด inquiry ไม่ได้');
  return await res.json();
}
