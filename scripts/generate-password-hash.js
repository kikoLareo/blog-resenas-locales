const bcrypt = require('bcrypt');

const password = process.argv[2] || 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error generando hash:', err);
    return;
  }
  
  console.log('🔐 Hash generado para la contraseña:', password);
  console.log('📋 Copia este hash a tu variable de entorno ADMIN_PASSWORD_HASH:');
  console.log('');
  console.log(hash);
  console.log('');
  console.log('💡 Variables de entorno completas:');
  console.log('ADMIN_EMAIL=admin@example.com');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('NEXTAUTH_SECRET=tu-secret-key-muy-largo');
  console.log('NEXTAUTH_URL=https://tu-dominio.vercel.app');
});
