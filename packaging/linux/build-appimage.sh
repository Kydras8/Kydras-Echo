#!/usr/bin/env bash
set -euo pipefail
APP=KydrasEcho
APPDIR=AppDir
rm -rf "$APPDIR"
mkdir -p "$APPDIR/usr/bin" "$APPDIR/usr/share/applications" "$APPDIR/usr/share/icons/hicolor/256x256/apps"

pip3 install --upgrade pip pyinstaller
pyinstaller --noconfirm --onefile --name "$APP" \
  --add-data "legacy/kydrasecho/gui/static:gui/static" \
  legacy/kydrasecho/gui/app.py

cp -v dist/$APP "$APPDIR/usr/bin/$APP"

cat > "$APPDIR/$APP.desktop" <<EOF
[Desktop Entry]
Name=Kydras Echo
Exec=$APP
Icon=$APP
Type=Application
Categories=Utility;
EOF
install -Dm644 "$APPDIR/$APP.desktop" "$APPDIR/usr/share/applications/$APP.desktop"

if command -v convert >/dev/null 2>&1; then
  convert -resize 256x256 assets/brand/og-social.png "$APPDIR/usr/share/icons/hicolor/256x256/apps/$APP.png" || true
fi

cat > "$APPDIR/AppRun" <<'EOF'
#!/bin/sh
exec "$APPDIR/usr/bin/KydrasEcho" "$@"
EOF
chmod +x "$APPDIR/AppRun"

if ! command -v appimagetool >/dev/null 2>&1; then
  echo "Install appimagetool: https://github.com/AppImage/AppImageKit/releases"
  exit 1
fi
appimagetool "$APPDIR" "${APP}-x86_64.AppImage"
echo "AppImage created: ${APP}-x86_64.AppImage"
