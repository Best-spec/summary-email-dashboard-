// ข้อมูลสำหรับกราฟ
const mockData = {
    quarterly: {
        labels: ['มค-มีค 24', 'เมย-มิย 24', 'กค-กย 24', 'ตค-ธค 24'],
        sales: [15.2, 18.7, 22.3, 25.8],
        profit: [3.8, 4.5, 5.2, 6.1]
    },
    categories: [
        { name: 'เครื่องใช้ไฟฟ้า', value: 35 },
        { name: 'เครื่องประดับ', value: 25 },
        { name: 'เฟอร์นิเจอร์', value: 20 },
        { name: 'เสื้อผ้า', value: 15 },
        { name: 'อาหารและเครื่องดื่ม', value: 5 }
    ]
};

function initializeCharts() {
    // กราฟแสดงผลประกอบการรายไตรมาส
    const quarterlyChart = document.getElementById('quarterlyChart');
    if (quarterlyChart) {
        new Chart(quarterlyChart, {
            type: 'line',
            data: {
                labels: mockData.quarterly.labels,
                datasets: [{
                    label: 'ยอดขาย',
                    data: mockData.quarterly.sales,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.3
                }, {
                    label: 'กำไรสุทธิ',
                    data: mockData.quarterly.profit,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                    context.parsed.y.toLocaleString('th-TH') + ' ล้านบาท';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('th-TH') + ' ล้านบาท';
                            }
                        }
                    }
                }
            }
        });
    }

    // กราฟแสดงสัดส่วนประเภทสินค้า
    const categoryChart = document.getElementById('categoryChart');
    if (categoryChart) {
        new Chart(categoryChart, {
            type: 'doughnut',
            data: {
                labels: mockData.categories.map(c => c.name),
                datasets: [{
                    data: mockData.categories.map(c => c.value),
                    backgroundColor: [
                        'rgb(59, 130, 246)',   // น้ำเงิน
                        'rgb(249, 115, 22)',   // ส้ม
                        'rgb(234, 179, 8)',    // เหลือง
                        'rgb(34, 197, 94)',    // เขียว
                        'rgb(168, 85, 247)'    // ม่วง
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// เรียกใช้งานเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', initializeCharts);
