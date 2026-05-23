# app/ml_models/id_card_generator.py
from PIL import Image, ImageDraw, ImageFont
import qrcode
import numpy as np
import cv2
from datetime import datetime
import os

class IDCardGenerator:
    def __init__(self):
        self.card_width = 600
        self.card_height = 400
        self.bg_color = (255, 255, 255)
        self.accent_color = (41, 128, 185)
        self.text_color = (51, 51, 51)
        
    async def generate_id_card(self, student, photo_path):
        """Generate professional ID card for student"""
        # Create blank card
        card = Image.new('RGB', (self.card_width, self.card_height), self.bg_color)
        draw = ImageDraw.Draw(card)
        
        # Draw header
        draw.rectangle([(0, 0), (self.card_width, 80)], fill=self.accent_color)
        
        # Add title
        try:
            font_title = ImageFont.truetype("arial.ttf", 28)
            font_normal = ImageFont.truetype("arial.ttf", 16)
            font_small = ImageFont.truetype("arial.ttf", 12)
        except:
            font_title = ImageFont.load_default()
            font_normal = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        draw.text((20, 25), "STUDENT IDENTITY CARD", fill=(255, 255, 255), font=font_title)
        
        # Load and resize student photo
        if os.path.exists(photo_path):
            student_img = Image.open(photo_path)
            student_img = student_img.resize((150, 150))
            # Make circular photo
            mask = Image.new('L', (150, 150), 0)
            mask_draw = ImageDraw.Draw(mask)
            mask_draw.ellipse((0, 0, 150, 150), fill=255)
            card.paste(student_img, (50, 110), mask)
        else:
            # Default avatar
            draw.ellipse((50, 110, 200, 260), fill=(200, 200, 200))
            draw.text((110, 170), "No Photo", fill=(100, 100, 100), font=font_normal)
        
        # Add student information
        info_y = 120
        info_x = 230
        
        info_fields = [
            (f"Student ID:", student.student_id),
            (f"Name:", student.name),
            (f"Department:", student.department),
            (f"Year:", student.year),
            (f"Email:", student.email[:30] + "..." if len(student.email) > 30 else student.email)
        ]
        
        for label, value in info_fields:
            draw.text((info_x, info_y), label, fill=self.accent_color, font=font_normal)
            draw.text((info_x + 120, info_y), str(value), fill=self.text_color, font=font_normal)
            info_y += 30
        
        # Generate QR code with student info
        qr_data = f"ID:{student.student_id}|Name:{student.name}|Dept:{student.department}"
        qr = qrcode.QRCode(box_size=4, border=2)
        qr.add_data(qr_data)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")
        qr_img = qr_img.resize((80, 80))
        card.paste(qr_img, (self.card_width - 110, self.card_height - 100))
        
        # Add footer
        draw.rectangle([(0, self.card_height - 40), (self.card_width, self.card_height)], fill=self.accent_color)
        draw.text((20, self.card_height - 32), "Valid for academic year 2024-2025", fill=(255, 255, 255), font=font_small)
        draw.text((self.card_width - 200, self.card_height - 32), "www.university.edu", fill=(255, 255, 255), font=font_small)
        
        # Add holographic effect (simple gradient)
        overlay = Image.new('RGBA', card.size, (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        for i in range(3):
            overlay_draw.rectangle(
                [(i*200, 0), (i*200 + 100, self.card_height)],
                fill=(255, 255, 255, 20)
            )
        card = Image.alpha_composite(card.convert('RGBA'), overlay).convert('RGB')
        
        # Save card
        output_path = f"generated_id_cards/student_{student.id}_id_card.png"
        os.makedirs("generated_id_cards", exist_ok=True)
        card.save(output_path)
        
        return output_path