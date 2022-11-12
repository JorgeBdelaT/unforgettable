import React, { useState } from "react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";

import { signOut } from "next-auth/react";

const SignOutBtn = () => {
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    setLoading(true);

    await queryClient.cancelQueries();
    await signOut();

    setLoading(false);
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="text-indigo-200 opacity-90 hover:text-indigo-300 disabled:pointer-events-none disabled:text-slate-500"
    >
      <ArrowLeftOnRectangleIcon className="h-6 w-6" />
    </button>
  );
};

export default React.memo(SignOutBtn);
