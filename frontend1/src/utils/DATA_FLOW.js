/**
 * DATA FLOW & REQUEST/RESPONSE CYCLE
 * 
 * This file documents how data flows through the application
 * from UI components to backend API and back.
 */

// ============================================================================
// COMPLETE LOGIN FLOW WITH LOGGING
// ============================================================================

/*
1. USER TYPES EMAIL & PASSWORD
   ├─ Login.jsx: handleChange()
   ├─ logger.stateUpdate('LoginComponent', 'email', 'user@example.com')
   └─ Component re-renders with new state

2. USER CLICKS "SIGN IN"
   ├─ Login.jsx: handleLogin(e)
   ├─ logger.userAction('LOGIN_ATTEMPT', { email })
   ├─ validateForm()
   ├─ logger.validation('LoginComponent', isValid, errors)
   ├─ If valid, proceeds to step 3
   └─ If invalid, displays errors to user

3. FORM IS VALID - CALL API
   ├─ Login.jsx: await login(email, password)
   ├─ AuthContext.jsx: login() function
   ├─ logger.auth('LOGIN_START', { email })
   ├─ authAPI.login({ email, password })
   │
   ├─ API LAYER
   │  ├─ axios.js: Request Interceptor
   │  ├─ logger.apiRequest('POST', '/auth/login', payload)
   │  ├─ Adds Authorization header
   │  └─ Sends request to backend
   │
   └─ Step 4

4. BACKEND PROCESSES REQUEST
   ├─ POST http://localhost:5000/api/auth/login
   ├─ Backend validates credentials
   ├─ Backend returns { user: {...}, token: "jwt..." }
   └─ Step 5

5. RESPONSE RECEIVED
   ├─ axios.js: Response Interceptor
   ├─ logger.apiSuccess('POST', '/auth/login', responseData)
   ├─ Returns response to authAPI.login()
   ├─ authAPI.login() returns to AuthContext.login()
   └─ Step 6

6. STORE IN STATE & STORAGE
   ├─ AuthContext.jsx: login()
   ├─ setUser(userData)
   ├─ logger.stateUpdate('AuthContext', 'user', userData)
   ├─ setToken(newToken)
   ├─ localStorage.setItem('user', JSON.stringify({...}))
   ├─ logger.auth('LOGIN_SUCCESS', { userId, email })
   ├─ Return { success: true, user: userData }
   └─ Step 7

7. UPDATE UI & NAVIGATE
   ├─ Login.jsx: if (result.success)
   ├─ logger.auth('LOGIN_SUCCESS', { userId })
   ├─ navigate('/home')
   └─ User redirected to home page


// ============================================================================
// ERROR SCENARIO - INVALID CREDENTIALS
// ============================================================================

1-3. Same as above, request sent

4. BACKEND REJECTS REQUEST
   ├─ POST http://localhost:5000/api/auth/login
   ├─ Backend returns 401 { message: "Invalid credentials" }
   └─ Step 5

5. ERROR RESPONSE RECEIVED
   ├─ axios.js: Response Interceptor (error path)
   ├─ logger.apiError('POST', '/auth/login', errorObject)
   ├─ Checks if status === 401
   ├─ If 401: clears localStorage and redirects to /login
   ├─ Returns error.response to catch block
   └─ Step 6

6. ERROR HANDLING
   ├─ AuthContext.jsx: login() catch block
   ├─ errorMsg = err.response?.data?.message
   ├─ setError(errorMsg)
   ├─ logger.auth('LOGIN_ERROR', { error, status })
   ├─ Return { success: false, error: errorMsg }
   └─ Step 7

7. DISPLAY ERROR TO USER
   ├─ Login.jsx: if (!result.success)
   ├─ setAuthError(result.error)
   ├─ logger.auth('LOGIN_FAILED', { error })
   ├─ Component re-renders with error message
   └─ User sees "Invalid credentials" message


// ============================================================================
// CREATE EVENT FLOW
// ============================================================================

1. USER FILLS FORM & CLICKS "CREATE EVENT"
   ├─ CreateEvent.jsx: handleSubmit(e)
   ├─ logger.userAction('CREATE_EVENT', { title })
   ├─ validateForm()
   ├─ logger.validation('CreateEvent', isValid, errors)
   └─ If valid, proceed

2. CREATE EVENT PAYLOAD
   ├─ eventPayload = {
   │    title: string,
   │    description: string,
   │    date: string,
   │    time: string,
   │    location: string,
   │    category: string
   │  }
   ├─ logger.data('CREATE', 'Event', eventPayload)
   └─ Call API

3. API CALL
   ├─ eventAPI.createEvent(eventPayload)
   ├─ axios.js: Request Interceptor
   ├─ logger.apiRequest('POST', '/events', eventPayload)
   ├─ Adds Authorization header with user's token
   ├─ POST http://localhost:5000/api/events
   └─ Backend processes

4. SUCCESS RESPONSE
   ├─ Backend returns { _id: "...", ...eventData }
   ├─ axios.js: Response Interceptor
   ├─ logger.apiSuccess('POST', '/events', responseData)
   ├─ CreateEvent.jsx: response.data
   ├─ logger.data('CREATE_SUCCESS', 'Event', { eventId })
   ├─ navigate('/my-events')
   └─ User redirected


// ============================================================================
// FETCH EVENTS FLOW
// ============================================================================

1. USER NAVIGATES TO "/my-events"
   ├─ MyEvents.jsx component mounts
   ├─ logger.lifecycle('MyEvents', 'MOUNT')
   ├─ useEffect hook triggers
   └─ Check if user._id exists

2. FETCH CREATED EVENTS
   ├─ logger.data('FETCH', 'Created Events', { userId })
   ├─ eventAPI.getUserEvents(user._id)
   ├─ axios.js: Request Interceptor
   ├─ logger.apiRequest('GET', '/users/:userId/events', null)
   ├─ GET http://localhost:5000/api/users/{userId}/events
   └─ Backend returns array of events

3. RESPONSE RECEIVED
   ├─ axios.js: Response Interceptor
   ├─ logger.apiSuccess('GET', '/users/:userId/events', responseData)
   ├─ setCreatedEvents(response.data)
   ├─ logger.stateUpdate('MyEvents', 'createdEvents', '5 events')
   └─ Component re-renders with events

4. FETCH JOINED EVENTS
   ├─ Same flow as step 2-3
   ├─ logger.data('FETCH', 'Joined Events', { userId })
   ├─ eventAPI.getUserJoinedEvents(user._id)
   ├─ setJoinedEvents(response.data)
   └─ Component re-renders


// ============================================================================
// RSVP FLOW
// ============================================================================

1. USER CLICKS "ATTENDING" BUTTON
   ├─ EventDetails.jsx: handleRSVP('attending')
   ├─ logger.userAction('RSVP', { eventId, status })
   ├─ setIsSubmittingRsvp(true)
   └─ Call API

2. API CALL
   ├─ rsvpAPI.addRsvp(eventId, { status: 'attending', guestCount: 1 })
   ├─ axios.js: Request Interceptor
   ├─ logger.apiRequest('POST', '/events/:id/rsvp', payload)
   ├─ POST http://localhost:5000/api/events/{eventId}/rsvp
   └─ Backend processes

3. SUCCESS RESPONSE
   ├─ Backend returns { status: 'attending', ... }
   ├─ axios.js: Response Interceptor
   ├─ logger.apiSuccess('POST', '/events/:id/rsvp', responseData)
   ├─ setRsvpStatus('attending')
   ├─ logger.stateUpdate('EventDetails', 'rsvpStatus', 'attending')
   ├─ Button highlights in green
   ├─ Message: "You marked as attending"
   └─ User sees confirmation


// ============================================================================
// COMMENT FLOW
// ============================================================================

1. USER TYPES COMMENT & CLICKS "POST"
   ├─ EventDetails.jsx: handleAddComment()
   ├─ logger.userAction('POST_COMMENT', { eventId })
   ├─ Check if comment is not empty
   └─ Call API

2. API CALL
   ├─ eventAPI.createEvent(eventId, { text: comment })
   ├─ axios.js: Request Interceptor
   ├─ logger.apiRequest('POST', `/events/:id/comment`, payload)
   ├─ POST http://localhost:5000/api/events/{eventId}/comment
   └─ Backend processes

3. SUCCESS RESPONSE
   ├─ Backend returns { commentId, ... }
   ├─ axios.js: Response Interceptor
   ├─ logger.apiSuccess('POST', `/events/:id/comment`, responseData)
   ├─ Add comment to UI state
   ├─ logger.stateUpdate('EventDetails', 'comments', 'added comment')
   ├─ Clear input
   ├─ setNewComment('')
   └─ User sees new comment


// ============================================================================
// CONSOLE LOG EXAMPLES
// ============================================================================

/*
When you open Browser Console (F12), you'll see colored logs like:

[API REQUEST] POST http://localhost:5000/api/auth/login
Payload: {email: "user@example.com", password: "password123"}

[STATE UPDATE] LoginComponent
isLoading: true

[VALIDATION] LoginComponent - ✅ VALID
Errors: {}

[AUTH] LOGIN_START
Details: {email: "user@example.com"}

[API SUCCESS] POST http://localhost:5000/api/auth/login
Response: {user: {_id: "1", name: "John", email: "..."}, token: "jwt..."}

[STATE UPDATE] AuthContext
user: {_id: "1", name: "John", email: "..."}

[AUTH] LOGIN_SUCCESS
Details: {userId: "1", email: "user@example.com"}

[LIFECYCLE] EventDetails
MOUNT

[DATA] FETCH Event
Details: {eventId: "123"}

[API REQUEST] GET http://localhost:5000/api/events/123

[API SUCCESS] GET http://localhost:5000/api/events/123
Response: {_id: "123", title: "Tech Conference", ...}

[STATE UPDATE] EventDetails
event: {_id: "123", title: "Tech Conference", ...}
*/


// ============================================================================
// DEBUGGING WORKFLOW
// ============================================================================

/*
1. OPEN DEVTOOLS
   - Press F12 or Right-click → Inspect
   - Go to Console tab
   - Clear console (click 🚫)

2. PERFORM ACTION
   - Click login button
   - Watch colored logs appear
   - Trace the flow step by step

3. SEARCH FOR ISSUES
   - Look for red [API ERROR] entries
   - Check the error message and status code
   - Review the request/response

4. CHECK NETWORK TAB
   - Click Network tab
   - Perform action again
   - Click the failed request
   - Review Request/Response headers and body

5. CHECK STORAGE
   - Application tab
   - Local Storage
   - Check localStorage.getItem('user')
   - Verify token is stored

6. TRACE STATE
   - Search console for [STATE UPDATE]
   - Verify data changes are logged
   - Check if UI reflects state changes
*/
