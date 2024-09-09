"use client";

import React from "react";

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong during login!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
