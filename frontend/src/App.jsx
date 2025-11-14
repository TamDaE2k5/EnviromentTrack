import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import LogInPage from "./page/LogInPage";
import SignUpPage from "./page/SignUpPage";
import { Toaster } from 'sonner'
import Page from "./page/Page";
import ProtectedRoute from "./page/protectedRoute";
import ProfilePage from "./page/ProfilePage";
function App() {
  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/login" element={<LogInPage/>}/>
          <Route path='/' element={<Page />}/>
          {/* Private route*/}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }/> 
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
