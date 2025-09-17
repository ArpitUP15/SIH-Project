import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import axios from "axios"

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [role, setRole] = useState("norole");
    const [isCounselor, setIsCounselor] = useState(role === "Student" ? false : true);

  const handleLogin = (e) => {
    e.preventDefault();

    const HandleSigninApiCall = async () => {
      try {
        console.log(isCounselor);

        const body = {
          email: email,
          password: password,
        };

        console.log("Sending data to the backend", body);

        const res = await axios.post(
          "https://mindease-backend-2qv5.onrender.com/api/auth/login/",
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(res.data);
        console.log("Login Successful");

        navigate("/");
      } catch (err) {
        console.log("An error occurred:", err);
      }
    };

    HandleSigninApiCall();
  };


  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
  };

  useEffect(() => {
    setShowPopup(true);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg border-2 p-4">
        <form onSubmit={handleLogin}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              <div className="text-pink-500 text-2xl mr-2">logo</div>
              <h1 className="text-4xl font-bold text-blue-500">
                <i>MindEase</i>
              </h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back to
              <br />
              MindEase
            </h2>
            <p className="text-gray-600 font-bold">
              Log in to continue your journey.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="block text-[12px] font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 top-1 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-3 text-sm py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[12px] font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 text-sm pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded-md transition duration-200 flex items-center justify-center"
            >
              Login
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <div className="mx-4 text-gray-500 text-sm">OR</div>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-1 px-4 rounded-md transition duration-200 flex items-center justify-center"
          >
            Sign in with Google
          </button>
        </div>

        <div className="text-center mt-4">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <a
            href="/authenticate/signup"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Sign Up
          </a>
        </div>
      </div>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="backdrop-blur-sm bg-white/70 border border-gray-200 rounded-lg w-80">
          <DialogHeader>
            <DialogTitle>Login As</DialogTitle>
            <DialogDescription>Choose your role to continue</DialogDescription>
          </DialogHeader>

          <div className="mt-4 p-4 flex flex-col gap-4">
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                setRole("Student");
                setShowPopup(false);
              }}
            >
              Student
            </button>
            <button
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => {
                setRole("Admin");
                setShowPopup(false);
              }}
            >
              Admin
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginComponent;
