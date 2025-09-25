const bcrypt = require('bcrypt');

async function generatePassword() {
  if (process.argv.length !== 4) {
    console.log('Uso: node generate-admin-password.js <email> <password>');
    process.exit(1);
  }

  const email = process.argv[2];
  const password = process.argv[3];

  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    console.log('\n=== Credenciales Generadas ===\n');
    console.log('Copia estas líneas EXACTAMENTE como aparecen a tu archivo .env:\n');
    console.log('ADMIN_EMAIL=' + email);
    // Usamos comillas simples para evitar la interpretación del $
    console.log("ADMIN_PASSWORD_HASH='" + hash + "'");
    console.log('\nVerificación de formato:');
    console.log('- Longitud del hash:', hash.length);
    console.log('- Primeros caracteres:', hash.substring(0, 7));
    console.log('- Hash completo para debug:', hash);
    console.log('\n¡IMPORTANTE! El hash debe estar entre comillas simples en el .env\n');
  } catch (error) {
    console.error('Error al generar el hash:', error);
    process.exit(1);
  }
}

generatePassword();