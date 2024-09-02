import { supabase } from "./supa.js";

const signUpForm = document.getElementById("sign-up-form");

async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let loginData;

  const formData = new FormData(e.target);

  const email = formData.get("email");
  const password = formData.get("password");

  loginData = await signInWithEmail(email, password);

  if (loginData) {
    window.location.pathname = "/map";
  }
});
