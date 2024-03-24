import React from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true);
      console.error(error, errorInfo);
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="h-full w-full mx-auto flex justify-center items-center">
        <h1 className="text-3xl font-medium">Something went wrong. Please try again later.</h1>;
      </div>
    )
  }

  return <>{children}</>;
};

export default ErrorBoundary;
