import {
  hasLoggedInUser,
  loginAnonymous,
  logoutCurrentUser,
  getCurrentUser
} from "./../stitch/authentication";

export function StitchAuthProvider(props) {
  // Set up our authentication state and initialize it using the
  // functions that we export from "/src/stitch/authentication.js"
  const [authState, setAuthState] = React.useState({
    isLoggedIn: hasLoggedInUser(),
    currentUser: getCurrentUser()
  });
  const handleAnonymousLogin = async () => {
    // Call the function we defined to log in to Stitch and then update
    // our authentication state
    if (!authState.isLoggedIn) {
      const loggedInUser = await loginAnonymous();
      setAuthState({
        ...authState,
        isLoggedIn: true,
        currentUser: loggedInUser
      });
    }
  };
  const handleLogout = async () => {
    // Call the function we defined to log out of Stitch and then update
    // our authentication state
    if (authState.isLoggedIn) {
      await logoutCurrentUser();
      setAuthState({
        ...authState,
        isLoggedIn: false,
        currentUser: null
      });
    }
  };
  // In the actual code we call useMemo() on the value to improve performance
  return (
    <StitchAuthContext.Provider value={{
      isLoggedIn: authState.isLoggedIn,
      currentUser: authState.currentUser,
      actions: { handleAnonymousLogin, handleLogout }
    }}>
      {props.children}
    </StitchAuthContext.Provider>
  );
}
