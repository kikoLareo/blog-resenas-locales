const bcrypt = require('bcrypt');

// Verificar las variables de entorno
console.log('🔍 Verificando variables de entorno:');
console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
console.log('ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH ? 'Configurado' : 'No configurado');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Configurado' : 'No configurado');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

// Probar la contraseña
const testPassword = 'admin123';
const hash = process.env.ADMIN_PASSWORD_HASH;

if (hash) {
  bcrypt.compare(testPassword, hash).then(isValid => {
    console.log('🔐 Prueba de contraseña:', isValid ? '✅ Correcta' : '❌ Incorrecta');
  });
} else {
  console.log('❌ No hay hash configurado');
}

// Generar un nuevo hash para comparar
bcrypt.hash(testPassword, 10).then(newHash => {
  console.log('🔄 Nuevo hash generado:', newHash);
  console.log('📋 Para usar este hash, actualiza ADMIN_PASSWORD_HASH en .env.local');
});
