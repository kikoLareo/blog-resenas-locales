const bcrypt = require('bcrypt');

async function generatePassword() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log('Uso: node scripts/generate-password.js <email> <password>');
    console.log('Ejemplo: node scripts/generate-password.js admin@example.com admin123');
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('\n🔐 Contraseña generada para:', email);
    console.log('📝 Contraseña original:', password);
    console.log('🔒 Hash generado:', hashedPassword);
    
    console.log('\n📋 Para usar en lib/auth.ts:');
    console.log(`'${email}': '${hashedPassword}', // ${password}`);
    
    console.log('\n📋 Para usar en .env:');
    console.log(`ADMIN_PASSWORDS="${email}:${password}"`);
    
  } catch (error) {
    console.error('❌ Error generando contraseña:', error);
  }
}

generatePassword();
