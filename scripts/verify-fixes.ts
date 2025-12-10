
import { calculateOverallRating } from '../lib/rating';
import { cleanContent } from '../lib/utils';

console.log('Running verification checks...');

// Test calculateOverallRating
console.log('\nTesting calculateOverallRating:');
const ratings1 = { food: 8, service: 8, ambience: 8, value: 8 };
const result1 = calculateOverallRating(ratings1);
console.log(`Test 1 (All 8s): Expected 8, Got ${result1} - ${result1 === 8 ? 'PASS' : 'FAIL'}`);

const ratings2 = { food: 10, service: 5, ambience: 5, value: 5 };
const result2 = calculateOverallRating(ratings2);
// (10+5+5+5)/4 = 6.25
console.log(`Test 2 (Mixed): Expected 6.25, Got ${result2} - ${result2 === 6.25 ? 'PASS' : 'FAIL'}`);

const ratings3 = { food: 0, service: 0, ambience: 0, value: 0 };
const result3 = calculateOverallRating(ratings3);
console.log(`Test 3 (Zeros): Expected 0, Got ${result3} - ${result3 === 0 ? 'PASS' : 'FAIL'}`);

// Test cleanContent
console.log('\nTesting cleanContent:');
const content1 = 'This is a test [1] with citation.';
const clean1 = cleanContent(content1);
console.log(`Test 1 (Citation): Expected "This is a test  with citation.", Got "${clean1}" - ${clean1 === 'This is a test  with citation.' ? 'PASS' : 'FAIL'}`);

const content2 = 'No citation here.';
const clean2 = cleanContent(content2);
console.log(`Test 2 (No citation): Expected "No citation here.", Got "${clean2}" - ${clean2 === 'No citation here.' ? 'PASS' : 'FAIL'}`);

console.log('\nVerification complete.');
