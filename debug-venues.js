// Script simple para probar queries de Sanity
console.log('🔍 Testing Sanity queries...');

// Vamos a crear un endpoint API temporal para hacer las queries
const queries = [
  {
    name: 'Cal Pep por título',
    query: '*[_type == "venue" && title match "Cal Pep*"] { _id, title, slug, "city": city-> { title, slug } }'
  },
  {
    name: 'Cal Pep por slug',
    query: '*[_type == "venue" && slug.current match "*cal-pep*"] { _id, title, slug, "city": city-> { title, slug } }'
  },
  {
    name: 'Venues Barcelona',
    query: '*[_type == "venue" && city->title == "Barcelona"][0...5] { _id, title, slug, "city": city-> { title, slug } }'
  }
];

queries.forEach((q, i) => {
  console.log(`\n${i + 1}. ${q.name}:`);
  console.log(q.query);
});

console.log('\n📝 Crear endpoint API temporal para ejecutar estas queries...');