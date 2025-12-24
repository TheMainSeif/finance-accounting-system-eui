# CSS Conflict Fix Script
# This script adds 'student-' prefix to all class names in Student Portal files
# to prevent conflicts with Finance Portal CSS

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CSS Conflict Resolution Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define file paths
$cssFile = "src\layouts\DashboardLayout.css"
$jsxFile = "src\layouts\DashboardLayout.jsx"

# Create backups
Write-Host "Creating backups..." -ForegroundColor Yellow
Copy-Item $cssFile "$cssFile.backup" -Force
Copy-Item $jsxFile "$jsxFile.backup" -Force
Write-Host "✓ Backups created (.backup files)" -ForegroundColor Green
Write-Host ""

# Define class name mappings
$classReplacements = @{
    'dashboard-container' = 'student-dashboard-container'
    'dashboard-topbar' = 'student-dashboard-topbar'
    'dashboard-sidebar' = 'student-dashboard-sidebar'
    'dashboard-main' = 'student-dashboard-main'
    'menu-toggle-btn' = 'student-menu-toggle-btn'
    'menu-icon' = 'student-menu-icon'
    'topbar-brand' = 'student-topbar-brand'
    'topbar-logo' = 'student-topbar-logo'
    'sidebar-overlay' = 'student-sidebar-overlay'
    'sidebar-close-btn' = 'student-sidebar-close-btn'
    'sidebar-header' = 'student-sidebar-header'
    'sidebar-nav' = 'student-sidebar-nav'
    'sidebar-footer' = 'student-sidebar-footer'
    'sidebar-logo' = 'student-sidebar-logo'
    'sidebar-portal-title' = 'student-sidebar-portal-title'
    'logo-container' = 'student-logo-container'
    'portal-info' = 'student-portal-info'
    'nav-list' = 'student-nav-list'
    'nav-item' = 'student-nav-item'
    'nav-link' = 'student-nav-link'
    'nav-icon' = 'student-nav-icon'
    'user-profile' = 'student-user-profile'
    'user-avatar' = 'student-user-avatar'
    'user-info' = 'student-user-info'
    'user-name' = 'student-user-name'
    'user-id' = 'student-user-id'
    'signout-btn' = 'student-signout-btn'
    'signout-icon' = 'student-signout-icon'
}

# Fix CSS file
Write-Host "Updating CSS file..." -ForegroundColor Yellow
$cssContent = Get-Content $cssFile -Raw

foreach ($old in $classReplacements.Keys) {
    $new = $classReplacements[$old]
    # Replace class selectors (e.g., .dashboard-container)
    $cssContent = $cssContent -replace "\.${old}\b", ".$new"
}

$cssContent | Set-Content $cssFile -NoNewline
Write-Host "✓ CSS file updated ($($classReplacements.Count) classes renamed)" -ForegroundColor Green
Write-Host ""

# Fix JSX file
Write-Host "Updating JSX file..." -ForegroundColor Yellow
$jsxContent = Get-Content $jsxFile -Raw

foreach ($old in $classReplacements.Keys) {
    $new = $classReplacements[$old]
    # Replace className attributes (e.g., className="dashboard-container")
    $jsxContent = $jsxContent -replace "className=`"${old}`"", "className=`"$new`""
    # Replace className with template literals (e.g., className={`dashboard-container ${...}`})
    $jsxContent = $jsxContent -replace "className=\{``${old}\s", "className={``$new "
    # Replace in string concatenation
    $jsxContent = $jsxContent -replace "'${old}'", "'$new'"
}

$jsxContent | Set-Content $jsxFile -NoNewline
Write-Host "✓ JSX file updated ($($classReplacements.Count) className attributes renamed)" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ CSS Conflict Resolution Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files updated:" -ForegroundColor White
Write-Host "  - $cssFile" -ForegroundColor Gray
Write-Host "  - $jsxFile" -ForegroundColor Gray
Write-Host ""
Write-Host "Backups created:" -ForegroundColor White
Write-Host "  - $cssFile.backup" -ForegroundColor Gray
Write-Host "  - $jsxFile.backup" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Check the browser - Student Portal should still work" -ForegroundColor White
Write-Host "  2. Check Finance Portal - should have no styling conflicts" -ForegroundColor White
Write-Host "  3. If everything works, delete .backup files" -ForegroundColor White
Write-Host ""
Write-Host "To rollback (if needed):" -ForegroundColor Yellow
Write-Host "  Copy-Item $cssFile.backup $cssFile -Force" -ForegroundColor Gray
Write-Host "  Copy-Item $jsxFile.backup $jsxFile -Force" -ForegroundColor Gray
Write-Host ""
