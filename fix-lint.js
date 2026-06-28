const fs = require('fs');
const path = require('path');

const modules = ['auth', 'users', 'products', 'orders', 'cart', 'wishlist', 'admin'];
const baseDir = path.join(__dirname, 'src', 'modules');

for (const mod of modules) {
  const servicePath = path.join(baseDir, mod, `${mod}.service.ts`);
  if (fs.existsSync(servicePath)) {
    let content = fs.readFileSync(servicePath, 'utf8');
    content = content.replace(/create\(createDto: Create[a-zA-Z]+Dto\)/g, match => {
      return match.replace('createDto', '_createDto');
    });
    content = content.replace(/update\(id: string, updateDto: Update[a-zA-Z]+Dto\)/g, match => {
      return match.replace('updateDto', '_updateDto');
    });
    fs.writeFileSync(servicePath, content);
  }
}
console.log('Fixed linting in services');
