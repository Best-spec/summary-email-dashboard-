// File handling functionality
let uploadedFiles = [];

// Setup CSRF token for AJAX requests
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function showErrorToast(message) {
  const toastContainer = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `
    bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg
    animate-slideIn
  `;
  toast.innerText = message;

  toastContainer.appendChild(toast);

  // ลบออกหลัง 5 วินาที
  setTimeout(() => {
    toast.remove();
  }, 5000);
}


// Initialize handlers when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeDropZone();
    initializeFileInput();
    // initializeCharts();
    initializeDeleteHandlers();
    
    // Initialize existing files from Django template
    const fileItems = document.getElementById('fileItems');
    if (fileItems) {
        const files = Array.from(fileItems.getElementsByClassName('file-item')).map(item => ({
            id: item.dataset.fileId,
            name: item.querySelector('.file-name').textContent
        }));
        uploadedFiles = files;
    }
});

function initializeDropZone() {
    const dropZone = document.getElementById('dropZone');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
}

function initializeFileInput() {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', handleFileSelect, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    document.getElementById('dropZone').classList.add('border-blue-500', 'bg-blue-50');
}

function unhighlight(e) {
    document.getElementById('dropZone').classList.remove('border-blue-500', 'bg-blue-50');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    // Show loading state
    const dropZone = document.getElementById('dropZone');
    const originalDropZoneContent = dropZone.innerHTML;
    dropZone.innerHTML = `
        <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div class="text-gray-600">กำลังอัปโหลด...</div>
        </div>
    `;

    const formData = new FormData();
    [...files].forEach(file => formData.append('files', file));

    fetch('/upload/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update with all files from server
            uploadedFiles = data.allFiles;
            updateFileList();
            
            // Restore drop zone
            dropZone.innerHTML = originalDropZoneContent;
            
            // Show success message
            showMessage('อัปโหลดไฟล์สำเร็จ', 'success');
        } else {
            throw new Error(data.error || 'เกิดข้อผิดพลาดในการอัปโหลด');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        
        // Restore drop zone
        dropZone.innerHTML = originalDropZoneContent;
        
        // Show error message
        showMessage(error.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 'error');
    });
}

function updateFileList() {
    const fileItems = document.getElementById('fileItems');
    const emptyState = document.getElementById('emptyState');
    const fileCount = document.getElementById('fileCount');

    fileCount.textContent = uploadedFiles.length;

    if (uploadedFiles.length === 0) {
        emptyState.style.display = 'block';
        fileItems.innerHTML = '';
    } else {
        emptyState.style.display = 'none';
        fileItems.innerHTML = uploadedFiles.map(file => `
            <div class="file-item mb-2 p-2 bg-gray-50 rounded flex items-center justify-between transition-all duration-300" data-file-id="${file.id}">
                <span class="file-name">${file.name}</span>
                <button onclick="showDeleteModal('${file.id}')" class="delete-btn text-red-500 hover:text-red-700 transition-colors">❌</button>
            </div>
        `).join('');
    }
}

// Delete functionality with modal
let fileToDelete = null;

function showDeleteModal(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    fileToDelete = fileId;
    
    // Update modal with file name
    const deleteFileName = document.getElementById('deleteFileName');
    deleteFileName.textContent = file.name;
    
    // Show modal
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('hidden');
}

function deleteFile(fileID) {
  if (!confirm("แน่ใจว่าจะลบไฟล์ทั้งหมด?")) return;

  fetch(`/delete-file/${fileID}/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    }
  })
  .then(response => {
    if (response.ok) {
      // ลบตาราง CSV ออกจาก DOM ทันที
      const fileElem = document.querySelector(`[data-file-id="${fileID}"]`);
      if (fileElem) fileElem.remove();
    } else {
      alert("ลบไม่สำเร็จ");
    }
  });
}
window.deleteFile = deleteFile;

function initializeDeleteHandlers() {
    const modal = document.getElementById('deleteModal');
    const cancelBtn = document.getElementById('cancelDelete');
    const confirmBtn = document.getElementById('confirmDelete');

    // Close modal on cancel
    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        fileToDelete = null;
    });

    // Close modal on clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            fileToDelete = null;
        }
    });

    // Handle confirm delete
    confirmBtn.addEventListener('click', () => {
        if (fileToDelete === null) return;
        
        // Show loading state
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            กำลังลบ...
        `;

        // Call delete API
        fetch(`/delete/${fileToDelete}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                showMessage('ลบไฟล์สำเร็จ', 'success');
                
                // Hide modal
                modal.classList.add('hidden');
                
                // Reload the page after a short delay to show the success message
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                showMessage(data.error || 'เกิดข้อผิดพลาดในการลบไฟล์', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('เกิดข้อผิดพลาดในการลบไฟล์', 'error');
        })
        .finally(() => {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'ลบไฟล์';
            fileToDelete = null;
        });
    });
}

document.getElementById('fileInput').addEventListener('change', async (e) => {
  const files = e.target.files;
  if (!files.length) return;

  const allowedExtensions = ['.csv', '.xls', '.xlsx'];
  const formData = new FormData();

  for (const file of files) {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        showErrorToast(`❌ ไฟล์ ${file.name} ไม่ใช่ไฟล์ที่รองรับ`);
        return;
    }
    formData.append('files', file);
  }

  try {
    const res = await fetch('/upload-file/', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      }
    });

    const data = await res.json();
    if (!data.success) {
      showErrorToast(`❌ ${data.error}`);
    } else {
      console.log('✅ อัปโหลดเรียบร้อย:', data.files);
      // อัพเดทรายการไฟล์ทันที
      uploadedFiles = data.files; // อัพเดท uploadedFiles array
      updateFileList(); // อัพเดทการแสดงผล
      showMessage('อัปโหลดไฟล์สำเร็จ', 'success');
    }
  } catch (err) {
    showErrorToast('❌ อัปโหลดล้มเหลว: ' + err.message);
  }

  e.target.value = ''; // reset input
});

function analyzeAll() {
  fetch('/analyze-all/')
    .then(res => res.json())
    .then(data => {
        console.log(data)
      if (data.success) {
        // console.log("ผลลัพธ์ทั้งหมด:", data.results)
        // document.getElementById('kpi-container').innerHTML = data.results;
        // มึงจะโชว์ตารางหรือกราฟก็ได้ตรงนี้
      } else {
        showErrorToast("เกิดข้อผิดพลาด ดึงข้อมูลไม่ได้", "red")
      }
    })
    console.log('ปุ่มทํางานอยู่')
}

window.analyzeAll = analyzeAll;
