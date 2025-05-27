
export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
      <span>Calculating...</span>
    </div>
  );
};
