import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="bg-[url('/images/about.jpg')] h-screen w-full flex items-center flex-col justify-center m-auto overflow-hidden bg-no-repeat bg-cover bg-center">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
