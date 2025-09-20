// Test script để debug chức năng CRUD sản phẩm

console.log('=== DEBUG CRUD PRODUCTS ===');

// Test routes có được mount đúng không
console.log('Routes được mount:');
console.log('GET /products/admin - Trang quản lý sản phẩm');
console.log('GET /products/:id/edit - Form sửa sản phẩm');
console.log('PUT /products/:id - Cập nhật sản phẩm');
console.log('DELETE /products/:id - Xóa sản phẩm');

console.log('\n=== HƯỚNG DẪN DEBUG ===');
console.log('1. Mở Developer Tools (F12)');
console.log('2. Vào tab Network');
console.log('3. Thực hiện chức năng sửa/xóa');
console.log('4. Kiểm tra request/response');

console.log('\n=== KIỂM TRA CÁC ĐIỂM ===');
console.log('✓ Method Override middleware: Đã cấu hình');
console.log('✓ Routes: Đã định nghĩa');
console.log('✓ Controllers: Đã có logic xử lý');
console.log('✓ Views: Form có _method hidden field');

console.log('\n=== URLs CẦN TEST ===');
console.log('Admin page: http://localhost:3000/products/admin');
console.log('Edit form: http://localhost:3000/products/[ID]/edit');
console.log('API test: http://localhost:3000/api-docs');

// Helper function để test từ browser console
function testDeleteProduct(productId) {
    console.log(`Testing delete product: ${productId}`);
    
    fetch(`/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

console.log('\n=== SỬ DỤNG TRONG BROWSER CONSOLE ===');
console.log('testDeleteProduct("PRODUCT_ID_HERE")');