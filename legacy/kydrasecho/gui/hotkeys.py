# legacy/kydrasecho/gui/hotkeys.py
# System-wide hotkeys for Push-to-Talk (PTT) and Command Palette.
# Windows/Kali friendly via pynput (no admin required).
from __future__ import annotations
from typing import Callable, Optional
from pynput import keyboard
import threading

class HotkeyManager:
    def __init__(
        self,
        on_ptt: Callable[[], None],
        on_palette: Callable[[], None],
        ptt_combo=("ctrl", "shift", "space"),
        palette_combo=("ctrl", "shift", "k"),
    ):
        self.on_ptt = on_ptt
        self.on_palette = on_palette
        self._ptt = set(k.lower() for k in ptt_combo)
        self._pal = set(k.lower() for k in palette_combo)
        self._pressed = set()
        self._listener: Optional[keyboard.Listener] = None
        self._thread: Optional[threading.Thread] = None

    def _key_to_str(self, key) -> str:
        try:
            if isinstance(key, keyboard.KeyCode) and key.char:
                return key.char.lower()
            if hasattr(keyboard.Key, key.name if hasattr(key, "name") else ""):
                return (key.name or "").lower()
            return str(key).split(".")[-1].lower()
        except Exception:
            return ""

    def _on_press(self, key):
        self._pressed.add(self._key_to_str(key))
        if self._ptt.issubset(self._pressed):
            self.on_ptt()
        if self._pal.issubset(self._pressed):
            self.on_palette()

    def _on_release(self, key):
        self._pressed.discard(self._key_to_str(key))

    def start(self):
        if self._listener: return
        self._listener = keyboard.Listener(on_press=self._on_press, on_release=self._on_release)
        self._thread = threading.Thread(target=self._listener.start, daemon=True)
        self._thread.start()

    def stop(self):
        if self._listener:
            self._listener.stop()
            self._listener = None
