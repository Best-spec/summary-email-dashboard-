import { getInquiryData } from "./api/inquiry.js";

// ฟังก์ชันนี้คือเอาไว้ render ตารางจากข้อมูล JSON ที่ได้จาก getInquiryData
export async function showInquiryCard(containerId = 'kpi-container') {
  const data = await getInquiryData(); // อันนี้เป็น object จาก API/JSON
  const containerid = document.getElementById('kpi-container');
  if (!containerid) return console.error(`❌ ไม่เจอ container: ${containerid}`);

  let html = '';

for (const [lang, items] of Object.entries(data)) {
  html += `<div class="mb-6">`;
  html += `<h3 class="text-xl font-bold mb-4 text-gray-800">${lang}</h3>`;
  html += `<div class="space-y-3">`;
  
  for (const [label, count] of Object.entries(items)) {
    html += `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex justify-between items-center">
          <h4 class="text-gray-800 font-medium text-base">${label}</h4>
          <span class="text-black text-lg px-3 py-1 rounded-full font-semibold">${count}</span>
        </div>
      </div>`;
  }
  
  html += `</div></div>`;
}

  containerid.innerHTML = html;
  console.log("ได้อยู้")
  console.log(data)
}
