import os
import math
from PIL import Image, ImageDraw, ImageFont

os.makedirs("assets", exist_ok=True)

def create_festive_icon(size, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer circle with festive crimson gradient feel
    padding = size * 0.05
    box = [padding, padding, size - padding, size - padding]
    
    # Crimson circular base
    draw.ellipse(box, fill="#D90429", outline="#FFB800", width=int(size * 0.035))
    
    # Inner gold decorative circle
    inner_pad = size * 0.12
    draw.ellipse([inner_pad, inner_pad, size - inner_pad, size - inner_pad], outline="#FFD700", width=int(size * 0.015))
    
    # Center emblem: Diya / Trishul stylized art
    cx, cy = size / 2, size / 2
    
    # Flame (Diya flame)
    flame_w = size * 0.12
    flame_h = size * 0.22
    flame_top = cy - size * 0.28
    
    # Golden outer flame
    draw.polygon([
        (cx, flame_top),
        (cx + flame_w, cy - size * 0.10),
        (cx - flame_w, cy - size * 0.10)
    ], fill="#FFD700")
    
    # Orange inner flame
    draw.polygon([
        (cx, flame_top + size * 0.05),
        (cx + flame_w * 0.6, cy - size * 0.10),
        (cx - flame_w * 0.6, cy - size * 0.10)
    ], fill="#FF5722")
    
    # Diya Base (Golden bowl)
    bowl_top = cy - size * 0.08
    bowl_bottom = cy + size * 0.18
    bowl_w = size * 0.32
    draw.chord([cx - bowl_w, bowl_top - size * 0.05, cx + bowl_w, bowl_bottom], start=0, end=180, fill="#FFC107", outline="#FFF8E1", width=int(size * 0.015))
    
    # Diya Stand
    stand_w = size * 0.14
    draw.rectangle([cx - stand_w * 0.5, bowl_bottom - size * 0.02, cx + stand_w * 0.5, bowl_bottom + size * 0.08], fill="#FFA000")
    draw.ellipse([cx - stand_w, bowl_bottom + size * 0.06, cx + stand_w, bowl_bottom + size * 0.12], fill="#FFB300")
    
    img.save(filename, "PNG")
    print(f"Generated {filename}")

create_festive_icon(192, "assets/icon-192.png")
create_festive_icon(512, "assets/icon-512.png")
create_festive_icon(64, "assets/favicon.png")
