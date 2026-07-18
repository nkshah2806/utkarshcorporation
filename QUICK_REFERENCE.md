# Quick Reference: Error Handling in Utkarsh App

## When Adding a New API Call

### Step 1: Create Service Method (if needed)
```javascript
// src/services/myService.js
export const myService = {
  fetchData: async (params) => {
    try {
      const response = await api.get("/endpoint", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};
```

### Step 2: Use in Component with Error Handling
```javascript
import { myService } from "@/services/myService";
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await myService.fetchData();
      setData(result);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
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

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {/* Render data */}
    </div>
  );
}
```

### Step 3: Never Use Direct API Calls
❌ **WRONG:**
```javascript
useEffect(() => {
  api.get("/data").then(r => setData(r.data));
}, []);
```

✅ **RIGHT:**
```javascript
const loadData = async () => {
  try {
    const data = await service.fetchData();
    setData(data);
  } catch (error) {
    // Handle error
  }
};
```

## Error Types Handled

| Error | Toast Message | Recovery |
|-------|---------------|----------|
| 404 Not Found | "Endpoint not found" or API message | Show empty state |
| 500 Server Error | "Internal server error" | Show empty state, retry button |
| Network Timeout | "Connection timeout" | Show empty state, retry button |
| Validation Error | API validation message | Show on form, highlight field |
| Auth Error (401) | Already handled by axios interceptor | Redirects to login |
| Generic Error | "Operation failed" | Show generic error message |

## Common Patterns

### 1. Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await service.submitForm(formData);
    toast({
      title: "Success",
      description: "Form submitted successfully",
    });
    // Reset form or redirect
  } catch (error) {
    toast({
      title: "Error",
      description: error?.response?.data?.message || "Failed to submit form",
      variant: "destructive",
    });
  }
};
```

### 2. Multiple API Calls
```javascript
const loadData = async () => {
  try {
    const [data1, data2, data3] = await Promise.all([
      service.fetch1(),
      service.fetch2(),
      service.fetch3(),
    ]);
    setData1(data1);
    setData2(data2);
    setData3(data3);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load data",
      variant: "destructive",
    });
  }
};
```

### 3. Optional API Calls (shouldn't crash if fails)
```javascript
const loadOptionalData = async () => {
  try {
    const data = await service.fetchOptional();
    setOptionalData(data);
  } catch (error) {
    // Log but don't show toast for optional data
    console.error("Optional data failed:", error);
  }
};
```

## Files Structure

```
src/
├── hooks/
│   ├── useApiMutation.js     ← Use for mutations
│   ├── useApiQuery.js        ← Use for queries
│   └── use-toast.js          ← Toast notifications
├── services/
│   ├── ordersService.js
│   ├── productsService.js
│   ├── categoriesService.js
│   ├── contactService.js
│   └── adminService.js
└── pages/
    └── YourPage.jsx          ← Use services with error handling
```

## Testing
To test error handling:
1. Go offline (DevTools → Network → Offline)
2. Change endpoint to non-existent one
3. Verify toast appears instead of crash
4. Verify page stays functional

## Important Notes
- ✅ Always wrap API calls in try-catch
- ✅ Always show user-friendly error messages
- ✅ Always use services for API calls
- ✅ Never call api directly in components
- ✅ Always handle Promise.all errors
- ❌ Don't let errors bubble up silently
- ❌ Don't show technical error messages to users
