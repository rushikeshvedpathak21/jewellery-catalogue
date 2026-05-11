insert into categories (id, name_en, name_hi, name_mr, is_visible)
values
('11111111-1111-1111-1111-111111111111', 'Necklaces', 'हार', 'हार', true),
('22222222-2222-2222-2222-222222222222', 'Rings', 'अंगूठी', 'अंगठी', true),
('33333333-3333-3333-3333-333333333333', 'Earrings', 'बाली', 'कानातले', true),
('44444444-4444-4444-4444-444444444444', 'Bangles', 'चूड़ियाँ', 'बांगड्या', true),
('55555555-5555-5555-5555-555555555555', 'Mangalsutra', 'मंगलसूत्र', 'मंगळसूत्र', true),
('66666666-6666-6666-6666-666666666666', 'Chains', 'चेन', 'साखळी', true)
on conflict (id) do nothing;

insert into settings (id, shop_name, whatsapp_number, address, google_maps_link, open_hours, banner_image_url, instagram_link, announcement_text_en, announcement_text_hi, announcement_text_mr, announcement_visible)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Shree Gold Palace',
  '919999999999',
  'Main Bazaar, Taluka Market Road, India',
  'https://maps.google.com',
  'Mon-Sun: 10:00 AM - 8:30 PM',
  '',
  'https://instagram.com',
  'Diwali collection is now available | Visit our shop for the latest designs | Personal WhatsApp inquiry only',
  'दिवाली कलेक्शन अब उपलब्ध है | नवीनतम डिज़ाइनों के लिए हमारी दुकान पर आएं | केवल WhatsApp पूछताछ',
  'दिवाळी संग्रह आता उपलब्ध आहे | नवीन डिझाइन्ससाठी दुकानास भेट द्या | फक्त WhatsApp चौकशी',
  true
)
on conflict (id) do nothing;

insert into feature_flags (feature_key, feature_name_en, feature_name_hi, feature_name_mr, is_enabled, disabled_message_en, disabled_message_hi, disabled_message_mr)
values
('catalogue', 'Catalogue', 'कैटलॉग', 'कॅटलॉग', true, 'Our catalogue is currently unavailable. Please contact us on WhatsApp for product details.', 'हमारा कैटलॉग अभी उपलब्ध नहीं है। उत्पाद जानकारी के लिए WhatsApp पर संपर्क करें।', 'आमचा कॅटलॉग सध्या उपलब्ध नाही. उत्पादनांसाठी WhatsApp वर संपर्क करा.'),
('search', 'Search', 'खोज', 'शोध', true, 'Search is currently disabled. Please browse our categories.', 'खोज सुविधा अभी बंद है। कृपया हमारी श्रेणियां देखें।', 'शोध सुविधा सध्या बंद आहे. कृपया आमच्या श्रेणी पहा.'),
('wishlist', 'Wishlist', 'विशलिस्ट', 'विशलिस्ट', true, 'Wishlist feature is currently unavailable.', 'विशलिस्ट सुविधा अभी उपलब्ध नहीं है।', 'विशलिस्ट सुविधा सध्या उपलब्ध नाही.'),
('new_arrivals', 'New Arrivals', 'नए आइटम', 'नवीन वस्तू', true, 'No new arrivals at the moment. Check back soon!', 'अभी कोई नया आइटम नहीं है। जल्द वापस आएं!', 'सध्या नवीन वस्तू नाहीत. लवकरच परत या!'),
('featured_products', 'Featured Products', 'विशेष उत्पाद', 'वैशिष्ट्यीकृत उत्पादने', true, 'Featured products are currently unavailable.', 'फीचर्ड उत्पाद अभी उपलब्ध नहीं हैं।', 'फीचर्ड उत्पादने सध्या उपलब्ध नाहीत.'),
('product_detail', 'Product Details', 'उत्पाद विवरण', 'उत्पादन तपशील', true, 'Product details are currently unavailable. Please contact us on WhatsApp.', 'उत्पाद विवरण अभी उपलब्ध नहीं है। WhatsApp पर संपर्क करें।', 'उत्पादन तपशील सध्या उपलब्ध नाही. WhatsApp वर संपर्क करा.'),
('whatsapp_inquiry', 'WhatsApp Inquiry', 'WhatsApp पूछताछ', 'WhatsApp चौकशी', true, 'WhatsApp inquiry is temporarily unavailable. Please visit our shop directly.', 'WhatsApp पूछताछ अस्थायी रूप से उपलब्ध नहीं है। कृपया सीधे हमारी दुकान पर आएं।', 'WhatsApp चौकशी तात्पुरती उपलब्ध नाही. कृपया आमच्या दुकानात थेट भेट द्या.'),
('announcement_bar', 'Announcement Bar', 'घोषणा पट्टी', 'घोषणा पट्टी', true, 'Announcements are currently disabled.', 'घोषणा अभी बंद है।', 'घोषणा सध्या बंद आहे.'),
('share_product', 'Share Product', 'उत्पाद साझा करें', 'उत्पादन शेअर', true, 'Share is currently unavailable.', 'शेयर सुविधा अभी उपलब्ध नहीं है।', 'शेअर सुविधा सध्या उपलब्ध नाही.'),
('qr_code', 'QR Code', 'QR कोड', 'QR कोड', true, 'QR code is currently unavailable.', 'QR कोड अभी उपलब्ध नहीं है।', 'QR कोड सध्या उपलब्ध नाही.'),
('recently_viewed', 'Recently Viewed', 'हाल ही में देखे गए', 'अलीकडे पाहिलेले', true, 'Recently viewed items are currently disabled.', 'हाल ही में देखे गए आइटम अभी उपलब्ध नहीं हैं।', 'अलीकडे पाहिलेले आयटम सध्या उपलब्ध नाहीत.'),
('category_filter', 'Category Filter', 'श्रेणी फ़िल्टर', 'श्रेणी फिल्टर', true, 'Category filter is currently unavailable.', 'श्रेणी फ़िल्टर अभी उपलब्ध नहीं है।', 'श्रेणी फिल्टर सध्या उपलब्ध नाही.'),
('metal_filter', 'Metal Filter', 'मेटल फ़िल्टर', 'मेटल फिल्टर', true, 'Metal filter is currently unavailable.', 'मेटल फ़िल्टर अभी उपलब्ध नहीं है।', 'मेटल फिल्टर सध्या उपलब्ध नाही.'),
('sort_options', 'Sort Options', 'क्रमबद्ध विकल्प', 'क्रमवारी पर्याय', true, 'Sort options are currently unavailable.', 'सॉर्ट विकल्प अभी उपलब्ध नहीं हैं।', 'क्रमवारी पर्याय सध्या उपलब्ध नाहीत.'),
('photo_zoom', 'Photo Zoom', 'फ़ोटो ज़ूम', 'फोटो झूम', true, 'Photo zoom is currently disabled.', 'फ़ोटो ज़ूम अभी बंद है।', 'फोटो झूम सध्या बंद आहे.'),
('related_products', 'Related Products', 'संबंधित उत्पाद', 'संबंधित उत्पादने', true, 'Related products are currently unavailable.', 'संबंधित उत्पाद अभी उपलब्ध नहीं हैं।', 'संबंधित उत्पादने सध्या उपलब्ध नाहीत.'),
('instagram_link', 'Instagram Link', 'Instagram लिंक', 'Instagram लिंक', true, 'Instagram link is currently unavailable.', 'Instagram लिंक अभी उपलब्ध नहीं है।', 'Instagram लिंक सध्या उपलब्ध नाही.'),
('google_maps', 'Google Maps Link', 'Google Maps लिंक', 'Google Maps लिंक', true, 'Google Maps link is currently unavailable.', 'Google Maps लिंक अभी उपलब्ध नहीं है।', 'Google Maps लिंक सध्या उपलब्ध नाही.'),
('bulk_csv_upload', 'Bulk CSV Upload', 'बल्क CSV अपलोड', 'बल्क CSV अपलोड', true, 'Bulk CSV upload is currently unavailable.', 'बल्क CSV अपलोड अभी उपलब्ध नहीं है।', 'बल्क CSV अपलोड सध्या उपलब्ध नाही.')
on conflict (feature_key) do nothing;
