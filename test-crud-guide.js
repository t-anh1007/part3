// Test CRUD operations
console.log('=== CRUD TEST GUIDE ===');

console.log('\n1. PRODUCTS CRUD:');
console.log('   Admin page: http://localhost:3000/products/admin');
console.log('   Create: http://localhost:3000/products/create');
console.log('   Edit: http://localhost:3000/products/[ID]/edit');
console.log('   Delete: DELETE /products/[ID] (via fetch)');

console.log('\n2. SUPPLIERS CRUD:');
console.log('   Admin page: http://localhost:3000/suppliers');
console.log('   Create: http://localhost:3000/suppliers/create');
console.log('   Edit: http://localhost:3000/suppliers/[ID]/edit');
console.log('   Delete: DELETE /suppliers/[ID] (via fetch)');

console.log('\n3. DEBUGGING STEPS:');
console.log('   - Open Developer Tools (F12)');
console.log('   - Go to Network tab');
console.log('   - Try edit/delete operations');
console.log('   - Check request/response status');

console.log('\n4. COMMON ISSUES:');
console.log('   - 404: Route not found or wrong URL');
console.log('   - 403: Not authenticated as admin');
console.log('   - 500: Server error (check console)');

console.log('\n5. EXPECTED BEHAVIOR:');
console.log('   - Edit: Form submit → Redirect to admin page');
console.log('   - Delete: Fetch request → Alert → Redirect to admin page');

console.log('\n=== END GUIDE ===');