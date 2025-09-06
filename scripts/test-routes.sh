#!/bin/bash

# Route Testing Script for Blog Reseñas Locales
# Tests all public routes and reports status codes

echo "🔍 Blog Reseñas Locales - Route Validation"
echo "=========================================="
echo

# Check if server is running
if ! curl -s --connect-timeout 3 http://localhost:3000 >/dev/null 2>&1; then
    echo "❌ Server not running on localhost:3000"
    echo "Please start the development server first: npm run dev"
    exit 1
fi

echo "✅ Server detected on localhost:3000"
echo

# Define routes to test
declare -a routes=(
    "/ Homepage"
    "/blog Blog index"
    "/categorias Categories listing"
    "/contacto Contact page"
    "/sobre About page"
    "/politica-privacidad Privacy policy"
    "/terminos Terms of service"
    "/cookies Cookie policy"
    "/madrid City page (Madrid)"
    "/madrid/venue/cafe-con-encanto Venue pattern 2"
    "/madrid/cafe-con-encanto Venue pattern 1"
    "/madrid/pizzeria-tradizionale/review/pizza-masa-madre-48h-madrid Problematic review (TODO.md)"
    "/madrid/restaurant-x/review/sushi-de-alta-calidad-en-un-ambiente-acogedor Featured review"
    "/categorias/cafeterias Category detail"
    "/blog/mejor-marisco-coruna Blog post"
)

# Counters
total=0
passed=0
failed=0
errors=0

echo "Testing routes..."
echo "=================="

for route_info in "${routes[@]}"; do
    url=$(echo "$route_info" | cut -d' ' -f1)
    description=$(echo "$route_info" | cut -d' ' -f2-)
    
    total=$((total + 1))
    
    # Test the route
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url" 2>/dev/null)
    
    # Determine status
    if [ "$status_code" -eq 200 ]; then
        echo "✅ $status_code $url - $description"
        passed=$((passed + 1))
    elif [ "$status_code" -eq 404 ]; then
        echo "⚠️  $status_code $url - $description (Not Found)"
        failed=$((failed + 1))
    elif [ "$status_code" -eq 500 ]; then
        echo "❌ $status_code $url - $description (Server Error)"
        errors=$((errors + 1))
    else
        echo "❓ $status_code $url - $description (Unexpected)"
        failed=$((failed + 1))
    fi
done

echo
echo "Summary"
echo "======="
echo "Total routes tested: $total"
echo "✅ Working (200): $passed"
echo "⚠️  Not Found (404): $failed"
echo "❌ Server Errors (500): $errors"
echo

# Calculate success rate
success_rate=$((passed * 100 / total))

if [ "$errors" -gt 0 ]; then
    echo "🔴 CRITICAL: $errors routes have server errors (500)"
    echo "These routes are completely broken and need immediate attention."
    echo
fi

if [ "$success_rate" -ge 80 ]; then
    echo "🟢 Overall Status: GOOD ($success_rate% working)"
elif [ "$success_rate" -ge 60 ]; then
    echo "🟡 Overall Status: FAIR ($success_rate% working)"
else
    echo "🔴 Overall Status: POOR ($success_rate% working)"
fi

echo
echo "Next steps:"
echo "1. Check ROUTE_VALIDATION_REPORT.md for detailed analysis"
echo "2. Review server logs for specific error details"
echo "3. Create individual issues for each 500 error route"

if [ "$errors" -gt 0 ]; then
    exit 1
else
    exit 0
fi