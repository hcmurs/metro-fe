import Loader from "./Loader";

const LoaderContainer = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Loader />
    </div>
  );
};

export default LoaderContainer;
