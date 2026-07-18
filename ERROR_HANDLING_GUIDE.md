# API Error Handling Implementation Guide

## Overview
This document explains the error handling improvements implemented across the Utkarsh Corporation frontend application.

## Problem Solved
**Before:** API errors (404, 500, etc.) would crash the entire page, showing a blank screen with no user feedback.

**After:** All API errors are caught gracefully and displayed as toast notifications, keeping the page functional.

## Architecture

### 1. Custom Hooks

#### `useApiMutation` (src/hooks/useApiMutation.js)
- Wraps React Query's `useMutation` 
- Automatically shows success/error toast notifications
- Handles error messages from API responses
- Usage:
```javascript
const { mutate, isPending } = useApiMutation(
  (data) => apiService.createOrder(data),
  {
    successMessage: "Order created successfully",
    errorMessage: "Failed to create order",
  }
);
```

#### `useApiQuery` (src/hooks/useApiQuery.js)
- Wraps React Query's `useQuery`
- Automatically shows error toast notifications
- Handles API errors gracefully
- Usage:
```javascript
const { data, isLoading, error } = useApiQuery(
  ["products"],
  () => productsService.getProducts(),
  { errorMessage: "Failed to load products" }
);
```

### 2. Service Layer
Created centralized service files for all API calls with proper error handling:

- **ordersService.js** - Order operations
- **productsService.js** - Product operations
- **categoriesService.js** - Category operations
- **contactService.js** - Contact/distributor/health camp forms
- **adminService.js** - Admin operations

Each service:
- ✅ Wraps API calls in try-catch blocks
- ✅ Logs errors to console for debugging
- ✅ Throws errors to be handled by components
- ✅ Returns structured data

### 3. Updated Pages
All pages now use the new services and proper error handling:

1. **Account.jsx** - Displays orders and wishlist with error handling
2. **Checkout.jsx** - Order creation with proper error messages
3. **Contact.jsx** - Contact form with toast notifications
4. **Distributor.jsx** - Distributor inquiry with error handling
5. **Home.jsx** - Featured products/categories with fallback states
6. **Shop.jsx** - Product filtering with error handling
7. **HealthCamps.jsx** - Health camps listing with loading states
8. **ProductDetail.jsx** - Product details with error handling
9. **OrderSuccess.jsx** - Order confirmation with error handling
10. **AdminDashboard.jsx** - Admin operations with error messages

## Error Handling Pattern

### In Components
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    const result = await service.getData();
    setData(result);
  } catch (error) {
    const errorMsg = error?.response?.data?.message || 
                     error?.message || 
                     "Failed to load data";
    toast({
      title: "Error",
      description: errorMsg,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
```

## Toast Notification
All errors show a toast notification with:
- **Title:** "Error"
- **Description:** Error message from API or generic fallback
- **Variant:** "destructive" (red styling)

Success messages show:
- **Title:** "Success"
- **Description:** Success message
- **Variant:** "default" (green styling)

## API Error Response Format
The services handle errors in this priority:
1. `error.response?.data?.message` - API's message field
2. `error.response?.data?.detail` - API's detail field
3. `error.message` - JavaScript error message
4. Fallback generic message

## 404 Error Handling
When an endpoint returns 404:
1. ✅ Toast notification appears: "Error: Endpoint not found"
2. ✅ Page continues to function
3. ✅ Fallback data is shown (empty state)
4. ✅ No page crash

## Benefits
- 🎯 Better user experience - users know what went wrong
- 🛡️ No more blank screens on errors
- 🔍 Easier debugging with console logs
- 📱 Mobile-friendly error messages
- ♻️ Reusable error handling patterns
- 🧪 Centralized service layer for easy testing

## Testing Error Scenarios

### Test 404 Error
1. Go to any page that loads data
2. Intentionally use a wrong endpoint in the service
3. Observe toast notification appears instead of crash

### Test Network Timeout
1. Go offline
2. Try to load data
3. Observe timeout error displays as toast

### Test Invalid Data
1. Send malformed data in a form
2. Observe API validation error displays as toast

## Future Improvements
- Add retry logic for failed requests
- Implement exponential backoff for network errors
- Add error tracking/reporting (Sentry)
- Create error boundary components
- Add loading skeletons instead of "Loading..."
