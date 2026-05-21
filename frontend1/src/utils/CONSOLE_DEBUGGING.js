/**
 * QUICK START: DEBUGGING WITH CONSOLE LOGS
 * 
 * This file shows how to debug the application using browser console logs.
 */

// ============================================================================
// STEP 1: OPEN BROWSER CONSOLE
// ============================================================================

/*
1. Open your browser (Chrome, Firefox, Safari, Edge)
2. Press F12 or Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows/Linux)
3. Click on the "Console" tab
4. You should see colored messages
*/


// ============================================================================
// STEP 2: UNDERSTANDING LOG COLORS
// ============================================================================

/*
BLUE         [API REQUEST]    - Shows API calls being sent
              Example: [API REQUEST] POST http://localhost:5000/api/auth/login
              Shows: Method, URL, and payload

GREEN        [API SUCCESS]    - Shows successful API responses
              Example: [API SUCCESS] POST http://localhost:5000/api/auth/login
              Shows: Response data returned from backend

RED          [API ERROR]      - Shows failed API calls
              Example: [API ERROR] POST http://localhost:5000/api/auth/login
              Shows: Error message, status code (401, 404, 500, etc.)

PURPLE       [STATE UPDATE]   - Shows when component state changes
              Example: [STATE UPDATE] LoginComponent
              Shows: Which state variable changed and what value

ORANGE       [USER ACTION]    - Shows user interactions
              Example: [USER ACTION] LOGIN_ATTEMPT
              Shows: What the user did and relevant details

CYAN         [AUTH]           - Shows authentication events
              Example: [AUTH] LOGIN_SUCCESS
              Shows: Auth flow events (login, logout, token refresh)

BROWN        [DATA]           - Shows data operations
              Example: [DATA] CREATE Event
              Shows: CRUD operations on data

PURPLE       [LIFECYCLE]      - Shows component mounting/unmounting
              Example: [LIFECYCLE] EventDetails - MOUNT
              Shows: Component lifecycle events

GREEN/RED    [VALIDATION]     - Shows form validation results
              Example: [VALIDATION] LoginForm - ✅ VALID
              Shows: Whether form is valid and what errors exist
*/


// ============================================================================
// STEP 3: COMMON DEBUGGING SCENARIOS
// ============================================================================

/*
SCENARIO 1: LOGIN NOT WORKING
─────────────────────────────
1. Open console (F12)
2. Go to login page
3. Type email & password
4. Click "Sign In"
5. Look for these logs:

   [USER ACTION] LOGIN_ATTEMPT
   → Means user clicked the button ✓

   [VALIDATION] LoginComponent - ✅ VALID
   → Form is valid ✓

   [API REQUEST] POST http://localhost:5000/api/auth/login
   → Request was sent to backend ✓

   If you see [API ERROR] after this:
   → Backend rejected the request ✗
   → Check the error message for reason
   → Could be: "Invalid credentials" or "User not found"

   If you see [AUTH] LOGIN_SUCCESS:
   → Login worked but navigation might be broken


SCENARIO 2: CREATING AN EVENT NOT WORKING
──────────────────────────────────────────
1. Open console
2. Go to /create-event page
3. Fill out the form
4. Click "Create Event"
5. Look for these logs:

   [USER ACTION] CREATE_EVENT
   → User clicked submit button ✓

   [VALIDATION] CreateEvent - ✅ VALID
   → Form passed validation ✓

   [DATA] CREATE Event
   → Event payload is ready

   [API REQUEST] POST http://localhost:5000/api/events
   → Request sent to backend

   If you see [API SUCCESS]:
   → Event was created ✓
   → Should redirect to /my-events

   If you see [API ERROR]:
   → Check error message
   → Could be permission issue or missing fields


SCENARIO 3: RSVP NOT UPDATING
──────────────────────────────
1. Open console
2. Go to event details page
3. Click "Attending" button
4. Look for logs:

   [USER ACTION] RSVP
   → Button was clicked ✓

   [DATA] CREATE/UPDATE RSVP
   → RSVP data being sent

   [API REQUEST] POST http://localhost:5000/api/events/:id/rsvp
   → Request sent

   If you see [API SUCCESS]:
   → RSVP updated ✓
   → Button should highlight

   If you see [API ERROR] with status 401:
   → User not logged in
   → Redirect to login


SCENARIO 4: DATA NOT LOADING
─────────────────────────────
1. Open console
2. Navigate to page (e.g., /my-events)
3. Look for logs:

   [LIFECYCLE] MyEvents - MOUNT
   → Component loaded ✓

   [DATA] FETCH Created Events
   → Starting to fetch data

   [API REQUEST] GET http://localhost:5000/api/users/:userId/events
   → Request sent

   If page stays loading:
   → Look for [API ERROR]
   → Check error message
   → Could be backend is down or token expired

   If you see [API SUCCESS]:
   → Data received ✓

   If you see [STATE UPDATE] with data:
   → Data was stored in state ✓
   → Page should render with data
*/


// ============================================================================
// STEP 4: HOW TO FILTER LOGS
// ============================================================================

/*
The console has a filter box at the top. Use it to search:

Search "[API ERROR]"
→ Shows only API errors (fast way to find problems)

Search "[AUTH]"
→ Shows only authentication events

Search "[VALIDATION]"
→ Shows only form validation logs

Search "LoginComponent"
→ Shows all logs related to LoginComponent

Search "eventId"
→ Shows logs mentioning eventId
*/


// ============================================================================
// STEP 5: INSPECTING DETAILED DATA
// ============================================================================

/*
When you see [API SUCCESS], click the arrow to expand:

[API SUCCESS] POST http://localhost:5000/api/auth/login
  ▶ Response: Object

Click the ▶ arrow next to Response to see details:
  Response: Object
    user: {_id: "123abc", name: "John Doe", email: "john@example.com"}
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

This shows exactly what data was received from backend.


When you see [API ERROR], expand it to see:

[API ERROR] POST http://localhost:5000/api/auth/login
  ▶ Error Details: Object

Expand to see:
  Error Details: Object
    message: "Invalid credentials"
    status: 401
    statusText: "Unauthorized"
    data: {message: "Invalid credentials"}
*/


// ============================================================================
// STEP 6: CHECKING STORED DATA
// ============================================================================

/*
After successful login, you should have data in browser storage:

1. Open DevTools (F12)
2. Go to "Application" tab (or "Storage" in Firefox)
3. Click "Local Storage" on left
4. Click the domain (http://localhost:5173)
5. Look for "user" key

You should see:
  Key: user
  Value: {"user":{"_id":"123abc",...},"token":"eyJ..."}

This is the data being used to keep you logged in.

If logging out works but this isn't cleared:
→ localStorage.removeItem('user') might not be working
→ Check [AUTH] LOGOUT logs


If login works but this isn't stored:
→ Component state updated but localStorage.setItem didn't work
→ Check [AUTH] LOGIN_SUCCESS logs
→ Browser might have disabled localStorage
*/


// ============================================================================
// STEP 7: NETWORK TAB DEBUGGING
// ============================================================================

/*
If API is failing, check Network tab:

1. Open DevTools (F12)
2. Click "Network" tab
3. Clear existing requests (circle icon)
4. Perform your action
5. Look for API requests

For a successful request:
- Status: 200 (green)
- Request tab shows what was sent
- Response tab shows what was returned

For a failed request:
- Status: 401, 404, 500 (red)
- Click request to see error details
- Response tab shows error message

Common Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (not logged in / token expired)
- 403: Forbidden (no permission)
- 404: Not Found (resource doesn't exist)
- 500: Server Error (backend crashed)
*/


// ============================================================================
// STEP 8: LOCALSTORAGE DEBUGGING
// ============================================================================

/*
To check localStorage in console, type:

localStorage.getItem('user')
→ Returns the entire user object as JSON string

localStorage.removeItem('user')
→ Clears the stored user (simulates logout)

localStorage.clear()
→ Clears ALL localStorage (careful!)

localStorage.setItem('user', JSON.stringify({test: 'data'}))
→ Manually store something for testing
*/


// ============================================================================
// QUICK REFERENCE: SEARCH FOR COMMON ISSUES
// ============================================================================

/*
"Token expired"
→ Search console for: [AUTH] TOKEN_EXPIRED
→ User should be logged out and redirected to /login

"Invalid credentials"
→ Search: [AUTH] LOGIN_ERROR
→ Check email & password are correct

"Event not found"
→ Search: [API ERROR]
→ Check event ID is correct

"Not authorized"
→ Search: 401
→ User might not be logged in or token is invalid

"Server error"
→ Search: [API ERROR]
→ Backend might be down
→ Check terminal running backend

"Form validation failed"
→ Search: [VALIDATION]
→ Check error messages for required fields

"Page won't load"
→ Search: [LIFECYCLE]
→ Then search: [API REQUEST]
→ Look for [API ERROR] after that
*/


// ============================================================================
// TIPS FOR DEBUGGING
// ============================================================================

/*
1. CLEAR CONSOLE FREQUENTLY
   - Each test, clear console
   - Makes it easier to see fresh logs

2. READ LOGS IN ORDER
   - Logs appear top to bottom
   - Follow the flow: REQUEST → RESPONSE
   - Look for where it fails

3. EXPAND OBJECTS
   - Click ▶ to expand log objects
   - See detailed data

4. USE SEARCH FILTER
   - Don't scroll through hundreds of logs
   - Use filter to find specific issue

5. CHECK NETWORK TAB
   - When console logs seem incomplete
   - Network tab shows actual HTTP requests

6. DISABLE EXTENSIONS
   - Browser extensions might interfere
   - Try incognito mode (Ctrl+Shift+N)

7. CHECK BROWSER CACHE
   - Sometimes old data is cached
   - Hard refresh: Ctrl+Shift+R

8. BACKEND LOGS
   - Check backend terminal for errors
   - Run: cd backend && npm run dev
   - Backend logs show what it received
*/


// ============================================================================
// EXAMPLE: STEP-BY-STEP LOGIN DEBUG
// ============================================================================

/*
Console shows (top to bottom):

1. [USER ACTION] LOGIN_ATTEMPT
   Details: {email: "john@example.com"}
   ✓ User clicked login button

2. [VALIDATION] LoginComponent - ✅ VALID
   Errors: {}
   ✓ Form passed validation

3. [STATE UPDATE] LoginComponent
   isLoading: true
   ✓ Button showing "Signing in..."

4. [AUTH] LOGIN_START
   Details: {email: "john@example.com"}
   ✓ AuthContext calling API

5. [API REQUEST] POST http://localhost:5000/api/auth/login
   Payload: {email: "john@example.com", password: "***"}
   ✓ Request being sent

6. [API SUCCESS] POST http://localhost:5000/api/auth/login
   Response: {user: {...}, token: "..."}
   ✓ Backend accepted credentials

7. [STATE UPDATE] AuthContext
   user: {_id: "123", name: "John", email: "john@example.com"}
   ✓ User stored in state

8. [AUTH] LOGIN_SUCCESS
   Details: {userId: "123", email: "john@example.com"}
   ✓ Login complete

9. [STATE UPDATE] LoginComponent
   isLoading: false
   ✓ Button back to normal

→ Browser redirects to /home
→ Login successful! ✓

---

If it failed at step 5:
→ Check backend is running
→ Check firewall/network

If it failed at step 6:
→ Check error message
→ Likely "Invalid credentials"
→ Verify email & password
*/
