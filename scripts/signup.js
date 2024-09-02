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

async function signUpNewUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    // options: {
    //   emailRedirectTo: 'https://example.com/welcome',
    // },
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
  let signupData;

  const formData = new FormData(e.target);

  const email = formData.get("email");
  const password = formData.get("password");

  const signInOrUp = formData.get("fav_language");

  if (signInOrUp === "SIGN-IN") {
    loginData = await signInWithEmail(email, password);
  } else if (signInOrUp === "SIGN-UP") {
    signupData = await signUpNewUser(email, password);
  }

  if (loginData) {
    window.location.pathname = "/map";
  } else if (signupData) {
    window.location.pathname = "/confirm";
  }
});
