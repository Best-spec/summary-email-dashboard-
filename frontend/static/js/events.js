import { getInquiryData } from "./api/inquiry.js";

// ฟังก์ชันนี้คือเอาไว้ render ตารางจากข้อมูล JSON ที่ได้จาก getInquiryData
export async function showInquiryCard(containerId = 'kpi-container') {
  const data = await getInquiryData(); // อันนี้เป็น object จาก API/JSON
  const container = document.getElementById(containerId);
  if (!container) return console.error(`❌ ไม่เจอ container: ${containerId}`);

  let html = '';

  for (const [lang, items] of Object.entries(data)) {
    html += `
      <div class="mb-8">
        <h3 class="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">${lang}</h3>
        <div class="overflow-x-auto shadow-lg rounded-lg">
          <table class="min-w-full bg-white border border-gray-200">
            <thead class="bg-gradient-to-r from-green-500 to-purple-600 text-white">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Language</th>
                <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Contact My Doctor at Bangkok Hospital Pattaya</th>
                <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Estimated Cost</th>
                <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">General Inquiry</th>
                <th class="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Other</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">`;
    
    let rowIndex = 0;
    for (const [label, count] of Object.entries(items)) {
      const bgColor = rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white';
      html += `
        <tr class="${bgColor} hover:bg-blue-50 transition-colors duration-150">
          <td class="px-6 py-4 text-sm font-medium text-gray-900">${label}</td>
          <td class="px-6 py-4 text-center">
            <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 min-w-[50px]">
              ${count}
            </span>
          </td>
        </tr>`;
      rowIndex++;
    }
    
    html += `
            </tbody>
          </table>
        </div>
      </div>`;
  }

  container.innerHTML = html;
}
