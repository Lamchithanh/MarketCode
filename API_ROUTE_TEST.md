# API Route Test 

## Testing PUT /api/admin/products/[id]

The API route has been created at `/app/api/admin/products/[id]/route.ts` with the following endpoints:

- **GET** `/api/admin/products/[id]` - Get single product
- **PUT** `/api/admin/products/[id]` - Update product  
- **DELETE** `/api/admin/products/[id]` - Delete product

## Debugging Features Added:

1. **Console logging** for request tracking
2. **Detailed error messages** with error context
3. **Validation logging** for required fields
4. **Support for tagIds** in PUT requests
5. **Proper response structure** matching expected format

## Expected Request Format:

```json
{
  "title": "Product Title",
  "description": "Product description", 
  "price": 99.99,
  "categoryId": "uuid",
  "technologies": ["React", "TypeScript"],
  "demoUrl": "https://demo.com",
  "githubUrl": "https://github.com/user/repo", 
  "isActive": true,
  "thumbnailUrl": "https://image.com/thumb.jpg",
  "images": ["url1", "url2"],
  "tagIds": ["tag1", "tag2"]
}
```

## Testing Steps:

1. Open admin products page
2. Try to edit a product 
3. Check browser network tab for API call
4. Check server terminal for debug logs
5. Verify response structure

## Expected Response:

```json
{
  "success": true,
  "product": {
    "id": "uuid",
    "title": "Updated Title",
    // ... full product object with relations
  }
}
```
