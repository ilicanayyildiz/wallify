-- Sample product data - stock images
INSERT INTO products (title, description, price, thumbnail_url, image_url, category, resolution, created_at)
VALUES
  (
    'Mountain Sunrise',
    'A beautiful sunrise over mountains with vibrant colors reflecting on the valley below.',
    9.99,
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'Nature',
    '5184 × 3456',
    NOW() - INTERVAL '1 day'
  ),
  (
    'Business Meeting',
    'Professional team discussing ideas in a modern office setting. Great for corporate websites and presentations.',
    12.99,
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    'Business',
    '4000 × 3000',
    NOW() - INTERVAL '2 days'
  ),
  (
    'City Lights at Night',
    'Panoramic view of a city skyline at night with illuminated buildings and streets.',
    14.99,
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
    'Urban',
    '6000 × 4000',
    NOW() - INTERVAL '3 days'
  ),
  (
    'Beach Sunset',
    'Golden sunset over a tropical beach with palm trees silhouettes and calm ocean waves.',
    9.99,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'Nature',
    '5500 × 3667',
    NOW() - INTERVAL '4 days'
  ),
  (
    'Modern Workspace',
    'Clean and minimal workspace with laptop, notebook and coffee cup on white desk.',
    11.99,
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd',
    'Business',
    '4200 × 2800',
    NOW() - INTERVAL '5 days'
  ),
  (
    'Abstract Art',
    'Colorful abstract paint pattern with flowing liquid colors in blue, purple and pink.',
    8.99,
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',
    'Abstract',
    '3840 × 2160',
    NOW() - INTERVAL '6 days'
  ),
  (
    'Healthy Food Bowl',
    'Fresh vegetable and grain bowl with avocado, quinoa, and mixed greens. Perfect for food blogs and health websites.',
    10.99,
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    'Food',
    '5500 × 3700',
    NOW() - INTERVAL '7 days'
  ),
  (
    'Technology Desk',
    'Modern technology workspace with multiple screens, keyboard and smart devices.',
    13.99,
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d',
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d',
    'Technology',
    '6016 × 4000',
    NOW() - INTERVAL '8 days'
  ),
  (
    'Forest Path',
    'Misty forest path with sunlight streaming through tall trees creating a magical atmosphere.',
    9.99,
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    'Nature',
    '4500 × 3000',
    NOW() - INTERVAL '9 days'
  ),
  (
    'Creative Workspace',
    'Artist workspace with painting supplies, brushes and colorful palette.',
    11.99,
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
    'Art',
    '4096 × 2730',
    NOW() - INTERVAL '10 days'
  ),
  (
    'Mountain Lake Reflection',
    'Calm mountain lake with perfect reflection of surrounding peaks and blue sky.',
    12.99,
    'https://images.unsplash.com/photo-1439853949127-fa647821eba0',
    'https://images.unsplash.com/photo-1439853949127-fa647821eba0',
    'Nature',
    '5760 × 3840',
    NOW() - INTERVAL '11 days'
  ),
  (
    'Modern Architecture',
    'Bold lines and geometric shapes of modern urban architecture captured from an interesting perspective.',
    14.99,
    'https://images.unsplash.com/photo-1434434319959-1f886517e1fe',
    'https://images.unsplash.com/photo-1434434319959-1f886517e1fe',
    'Architecture',
    '5500 × 3700',
    NOW() - INTERVAL '12 days'
  ); 