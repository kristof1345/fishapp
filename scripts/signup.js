import { supabase } from "./supa.js";

const signUpForm = document.getElementById("sign-up-form");

async function signUpNewUser(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    // options: {
    //   emailRedirectTo: "http://127.0.0.1:5500/map",
    // },
    options: {
      data: {
        username: username, // Add additional user data here
      },
    },
  });

  if (error) {
    console.error(error);
    alert(error.message);
  } else {
    return data;
  }
}

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let signupData;

  const formData = new FormData(e.target);

  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  signupData = await signUpNewUser(email, password, username);

  if (signupData) {
    window.location.pathname = "/map";
  }
});
